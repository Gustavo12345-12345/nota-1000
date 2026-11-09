import { NextRequest, NextResponse } from 'next/server';
import { evaluateEssayPedagogical } from '@/lib/evaluator';
import { CorrectionResult } from '@/types/essay';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, tema, titulo, apiKey: userProvidedKey } = body;

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'O texto da redação deve possuir ao menos 50 caracteres para ser avaliado.' },
        { status: 400 }
      );
    }

    const providedKey = (userProvidedKey && String(userProvidedKey).trim()) || '';
    const openAiKey = (providedKey.startsWith('sk-') ? providedKey : null) ||
                      process.env.OPENAI_API_KEY ||
                      process.env.NOTA1000 ||
                      process.env['NOTA-1000'] ||
                      process.env.OPENAI_KEY;

    const geminiKey = (!providedKey.startsWith('sk-') && providedKey ? providedKey : null) ||
                      process.env.GEMINI_API_KEY ||
                      process.env.GOOGLE_API_KEY;

    // Helper para garantir que a nota final seja estritamente a soma das 5 competências (0, 40, 80, 120, 160, 200 cada)
    const buildEnemResult = (
      parsed: any,
      baseResult: CorrectionResult,
      sourceId: string
    ): CorrectionResult => {
      const normalizeScore = (val: any, fallback: number) => {
        const num = Number(val);
        if (isNaN(num)) return fallback;
        const valid = [0, 40, 80, 120, 160, 200];
        return valid.reduce((prev, curr) => (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev));
      };

      const c1 = normalizeScore(parsed.competencias?.c1?.nota, baseResult.competencias.c1.nota);
      const c2 = normalizeScore(parsed.competencias?.c2?.nota, baseResult.competencias.c2.nota);
      const c3 = normalizeScore(parsed.competencias?.c3?.nota, baseResult.competencias.c3.nota);
      const c4 = normalizeScore(parsed.competencias?.c4?.nota, baseResult.competencias.c4.nota);
      const c5 = normalizeScore(parsed.competencias?.c5?.nota, baseResult.competencias.c5.nota);

      // REGRA DE OURO: A nota final DEVE ser SEMPRE e OBRIGATORIAMENTE a soma das 5 competências
      const totalCalculado = c1 + c2 + c3 + c4 + c5;

      const merged: CorrectionResult = {
        ...baseResult,
        ...parsed,
        id: `corr-${sourceId}-${Date.now()}`,
        tema: tema || 'Tema do ENEM',
        titulo,
        texto_original: text,
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        estatisticas: baseResult.estatisticas,
        nota_total: totalCalculado,
        distancia_1000: Math.max(0, 1000 - totalCalculado),
        competencias: {
          ...baseResult.competencias,
          ...parsed.competencias,
          c1: { ...baseResult.competencias.c1, ...parsed.competencias?.c1, nota: c1 },
          c2: { ...baseResult.competencias.c2, ...parsed.competencias?.c2, nota: c2 },
          c3: { ...baseResult.competencias.c3, ...parsed.competencias?.c3, nota: c3 },
          c4: { ...baseResult.competencias.c4, ...parsed.competencias?.c4, nota: c4 },
          c5: { ...baseResult.competencias.c5, ...parsed.competencias?.c5, nota: c5 },
        },
      };

      if (merged.detalhes?.proposta_intervencao) {
        merged.detalhes.proposta_intervencao.nota_c5 = c5;
      }

      return merged;
    };

    const gradingPrompt = `Você é um corretor oficial sênior da banca examinadora do ENEM (INEP).
Sua avaliação deve ser MODERADA, EQUILIBRADA e ESTRITAMENTE REALISTA, espelhando com fidelidade a régua oficial de correção do exame nacional.

POSTURA DO CORRETOR (MODERADO E REALISTA):
- NÃO SEJA PERMISSIVO OU LENIENTE: Não dê nota máxima (200) por mera simpatia, formalidade básica ou citações soltas. Para atingir 200 pontos em qualquer competência, o texto deve satisfazer plenamente os requisitos do Nível 5 do Manual de Redação do ENEM.
- NÃO SEJA HIPER-RIGOROSO: Reconheça com justiça o mérito do candidato. Redações de excelência (920 a 960 pontos) possuem repertório produtivo e proposta sólida com pequenos deslizes normativos ou coesivos pontuais que não anulam a qualidade do texto. Não rebaixe um texto de 920-960 para 800 por preciosismo.
- PONTUAÇÃO REALISTA TÍPICA:
  * Redação excelente/exemplar com pequenas falhas isoladas: 920 a 960 pontos (ex: quatro notas 200 e uma 160).
  * Redação boa com desvios normais de alunos competitivos: 800 a 880 pontos.
  * Redação mediana com lacunas argumentativas ou desvios: 600 a 720 pontos.

MATRIZ OFICIAL DAS 5 COMPETÊNCIAS DO ENEM (Notas por competência: 0, 40, 80, 120, 160 ou 200):

1. Competência 1 (Domínio da Norma Culta da Língua Escrita):
   - 200 pts (Nível 5): Excelente domínio da modalidade escrita formal. Admite no máximo 1 desvio gramatical/convenção isolado (ex: uma vírgula ou deslize ortográfico pontual) e nenhuma falha de estrutura sintática, ou 1 falha sintática leve sem outros desvios. Exige períodos maduros e vocabulário culto.
   - 160 pts (Nível 4): Bom domínio. Apresenta poucos desvios gramaticais (2 a 4 desvios de pontuação, crase, concordância ou regência) ou pequenas falhas sintáticas, sem comprometer a fluência.
   - 120 pts (Nível 3): Domínio mediano. Apresenta desvios gramaticais regulares (mais de 4 desvios) ou problemas de estruturação sintática perceptíveis (truncamento ou justa-posição).
   - 80 pts (Nível 2) ou menos: Desvios gramaticais frequentes e vocabulário simplório.

2. Competência 2 (Compreensão da Proposta e Repertório Sociocultural):
   - 200 pts (Nível 5): Desenvolve o tema integralmente (sem tangenciamento) no tipo dissertativo-argumentativo E mobiliza repertório sociocultural que seja simultaneamente LEGITIMADO (filosofia, sociologia, história, literatura, leis ou estatísticas), PERTINENTE ao tema E COMPROVADAMENTE PRODUTIVO para a defesa da tese. Apenas citar autores ou dados sem vinculação crítica direta ao raciocínio NÃO confere 200 (atribua 160).
   - 160 pts (Nível 4): Aborda o tema e apresenta repertório legitimado e pertinente, mas com uso pouco produtivo (repertório decorado, solto ou pouco articulado à argumentação).
   - 120 pts (Nível 3): Aborda o tema recorrendo apenas aos textos motivadores ou sem repertório legitimado de outras áreas do conhecimento.
   - 80 pts (Nível 2): Tangenciamento do tema ou repertório descontextualizado.

3. Competência 3 (Projeto de Texto e Argumentação):
   - 200 pts (Nível 5): Projeto de texto estratégico de excelência. Apresenta introdução com tese clara e dois direcionamentos argumentativos, desenvolvidos em D1 e D2 com autoria, argumentos consistentes, progressão temática, causas e consequências, sem lacunas argumentativas ou ideias soltas.
   - 160 pts (Nível 4): Projeto de texto perceptível e organizado, mas com pequenas lacunas argumentativas, ligeira superficialidade em algum ponto ou desenvolvimento incompleto de um dos argumentos.
   - 120 pts (Nível 3): Projeto de texto com falhas visíveis, argumentos previsíveis, senso comum ou contradições.

4. Competência 4 (Coesão Textual e Mecanismos Linguísticos):
   - 200 pts (Nível 5): Recursos coesivos diversificados. Exige obrigatoriamente conectivos interparágrafos (no início de pelo menos 2 parágrafos: ex: no início de D1 ou D2 e no início da Conclusão) E conectivos intraparágrafos variados em praticamente todos os períodos, sem repetições viciosas (não repete o mesmo conectivo) e sem inadequações de sentido.
   - 160 pts (Nível 4): Uso adequado de conectivos, mas com pouca variedade ou com repetições notórias de termos coesivos (ex: repetição de "além disso", "ademais" ou "portanto") ou ausência de conectivo interparágrafos em algum parágrafo.
   - 120 pts (Nível 3): Coesão mediana, repetições frequentes ou carência de conectivos interparágrafos.

5. Competência 5 (Proposta de Intervenção Social):
   - Avaliação rigorosamente técnica dos 5 elementos da proposta de intervenção (40 pontos por elemento):
     1. Agente (quem executará a medida, ex: Ministério, Governo Federal, Sociedade Civil) - 40 pts
     2. Ação (o que deve ser feito, verbo propositivo prático) - 40 pts
     3. Meio/Modo (como a ação será realizada, instrumento de execução, ex: "por meio de...", "mediante...") - 40 pts
     4. Efeito/Finalidade (para qual objetivo/efeito prático a ação serve, ex: "a fim de...", "com o fito de...") - 40 pts
     5. Detalhamento (especificação prática, explicação suplementar ou exemplo de um dos 4 anteriores) - 40 pts
   - PONTUAÇÃO DE C5:
     * 5 elementos completos e claros = 200 pontos.
     * 4 elementos (falta detalhamento, meio ou outro) = 160 pontos.
     * 3 elementos presentes = 120 pontos.
     * 2 elementos presentes = 80 pontos.
     * 1 elemento presente = 40 pontos.
     * Ausência de proposta ou violação grave dos direitos humanos = 0 pontos.

REGRA MATEMÁTICA OBRIGATÓRIA:
- "nota_total" DEVE SER ESTRITAMENTE A SOMA EXATA:
  nota_total = c1.nota + c2.nota + c3.nota + c4.nota + c5.nota.
- "distancia_1000" = 1000 - nota_total.

TEMA DA REDAÇÃO: "${tema || 'Tema Livre do ENEM'}"
${titulo ? `TÍTULO: "${titulo}"` : ''}

TEXTO DA REDAÇÃO:
"""
${text}
"""

Responda ESTRITAMENTE em formato JSON com esta estrutura exata:
{
  "nota_total": number,
  "distancia_1000": number,
  "feedback_geral": string,
  "competencias": {
    "c1": { "id": "c1", "nome": "Domínio da escrita formal da língua portuguesa", "nota": number, "nivel": string, "feedback": string, "pontos_positivos": string[], "pontos_melhorar": string[] },
    "c2": { "id": "c2", "nome": "Compreender a proposta e aplicar áreas do conhecimento", "nota": number, "nivel": string, "feedback": string, "pontos_positivos": string[], "pontos_melhorar": string[] },
    "c3": { "id": "c3", "nome": "Seleção e organização das informações", "nota": number, "nivel": string, "feedback": string, "pontos_positivos": string[], "pontos_melhorar": string[] },
    "c4": { "id": "c4", "nome": "Mecanismos linguísticos e coesão", "nota": number, "nivel": string, "feedback": string, "pontos_positivos": string[], "pontos_melhorar": string[] },
    "c5": { "id": "c5", "nome": "Proposta de intervenção social", "nota": number, "nivel": string, "feedback": string, "pontos_positivos": string[], "pontos_melhorar": string[] }
  },
  "detalhes": {
    "pontos_fortes": string[],
    "pontos_melhorar": string[],
    "sugestoes_ia": string[],
    "repertorio_sociocultural": { "avaliacao": string, "pertinente": boolean, "legitimo": boolean, "produtivo": boolean, "exemplos_citados": string[] },
    "argumentacao": { "avaliacao": string, "projeto_de_texto": string, "desenvolvimento": string },
    "coesao": { "avaliacao": string, "conectivos_utilizados": string[], "problemas_repeticao": string[] },
    "proposta_intervencao": {
      "nota_c5": number,
      "avaliacao_geral": string,
      "elementos": [
        { "tipo": "agente", "nome": "Agente", "pergunta": "Quem?", "presente": boolean, "trecho_identificado": string, "explicacao": string },
        { "tipo": "acao", "nome": "Ação", "pergunta": "O que?", "presente": boolean, "trecho_identificado": string, "explicacao": string },
        { "tipo": "meio", "nome": "Meio / Modo", "pergunta": "Como?", "presente": boolean, "trecho_identificado": string, "explicacao": string },
        { "tipo": "finalidade", "nome": "Efeito / Finalidade", "pergunta": "Para quê?", "presente": boolean, "trecho_identificado": string, "explicacao": string },
        { "tipo": "detalhamento", "nome": "Detalhamento", "pergunta": "Explicação/Exemplo", "presente": boolean, "trecho_identificado": string, "explicacao": string }
      ]
    }
  },
  "anotacoes_texto": [
    {
      "id": string,
      "tipo": "gramatica" | "argumentacao" | "coesao" | "positivo",
      "trecho": string,
      "problema": string,
      "sugestao": string,
      "competencia": string
    }
  ]
}`;

    // 1. TENTATIVA COM OPENAI (CHATGPT)
    if (openAiKey) {
      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        let completion;
        try {
          // Tentamos gpt-4o para máxima acurácia avaliativa e equilíbrio pedagógico
          completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: 'Você é um avaliador sênior do ENEM e responde exclusivamente em JSON formatado.' },
              { role: 'user', content: gradingPrompt }
            ],
            temperature: 0.15,
          });
        } catch {
          // Fallback gpt-4o-mini
          completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: 'Você é um avaliador sênior do ENEM e responde exclusivamente em JSON formatado.' },
              { role: 'user', content: gradingPrompt }
            ],
            temperature: 0.15,
          });
        }

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          const baseResult = evaluateEssayPedagogical(text, tema, titulo);
          return NextResponse.json(buildEnemResult(parsed, baseResult, 'chatgpt'));
        }
      } catch (openAiErr) {
        console.warn('OpenAI grading failed, trying fallback:', openAiErr);
      }
    }

    // 2. TENTATIVA COM GEMINI
    if (geminiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: gradingPrompt }] }],
            generationConfig: {
              temperature: 0.15,
              responseMimeType: 'application/json',
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText);
            const baseResult = evaluateEssayPedagogical(text, tema, titulo);
            return NextResponse.json(buildEnemResult(parsed, baseResult, 'gemini'));
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to pedagogical engine:', geminiError);
      }
    }

    // 3. Fallback garantido para o motor pedagógico local
    const result = evaluateEssayPedagogical(text, tema || 'Tema do ENEM', titulo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Erro ao avaliar redação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao processar a redação. Tente novamente.' },
      { status: 500 }
    );
  }
}
