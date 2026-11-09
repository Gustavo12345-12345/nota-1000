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

    // Helper para garantir que a nota final seja estritamente a soma das 5 competências (0 a 200 cada)
    const buildEnemResult = (
      parsed: any,
      baseResult: CorrectionResult,
      sourceId: string
    ): CorrectionResult => {
      const normalizeScore = (val: any, fallback: number) => {
        const num = Number(val);
        if (isNaN(num)) return fallback;
        const valid = [0, 40, 80, 120, 160, 180, 200];
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

    const gradingPrompt = `Você é um avaliador oficial sênior da banca examinadora do ENEM (INEP).
Sua missão pedagógica é avaliar esta redação com a régua REALISTA, JUSTA e EQUILIBRADA do exame — reconhecendo com clareza o mérito de bons textos e NUNCA sendo hiper-rigoroso ou punitivo por preciosismo desnecessário.

DIRETRIZ DE CALIBRAÇÃO E RIGOR JUSTO (MUITO IMPORTANTE):
- No ENEM real, corretores experientes valorizam a competência comunicativa e a autoria do estudante. Redações bem articuladas, com vocabulário formal, repertório legitimado e proposta de intervenção completa pertencem legitimamente à faixa de excelência (920 a 1000 pontos).
- NUNCA rebaixe artificialmente para 800 uma redação que é claramente nível 920 a 960!
- Seja pedagógico e equilibrado: aponte os desvios com clareza e respeito nos comentários, mas atribua a nota justa e merecida na matriz oficial.

MATRIZ OFICIAL DAS 5 COMPETÊNCIAS (Notas permitidas: 0, 40, 80, 120, 160, 180, 200):
1. Competência 1 (Norma Culta da Língua Escrita):
   - 200 pts (Nível 5): Excelente domínio. Pequenos desvios gramaticais ou convenções de escrita são aceitos como excepcionais (até 2 desvios leves isolados de vírgula ou grafia) se a estrutura sintática for fluente e madura. Se o texto for formal e bem escrito, atribua 200.
   - 160 pts (Nível 4): Bom domínio com alguns desvios visíveis, mas sem comprometer a fluência.
2. Competência 2 (Compreensão da Proposta e Repertório Sociocultural):
   - 200 pts (Nível 5): Aborda o tema completamente e utiliza repertório sociocultural legitimado (filosofia, sociologia, história, literatura, legislação ou dados) que seja PERTINENTE e PRODUTIVO. Se citou autores ou conceitos aplicados ao tema (ex: Simone de Beauvoir, Constituição, Dimenstein, Bauman, Hobbes, etc.), a nota DEVE ser 200.
   - 160 pts (Nível 4): Repertório pertinente porém pouco articulado.
3. Competência 3 (Projeto de Texto e Argumentação):
   - 200 pts (Nível 5): Projeto de texto estratégico com introdução clara (apresentando tese), dois parágrafos de desenvolvimento articulados com argumentos consistentes e conclusão coerente.
   - 160 pts (Nível 4): Projeto de texto com pequenas falhas argumentativas.
4. Competência 4 (Coesão Textual e Recursos Linguísticos):
   - 200 pts (Nível 5): Presença expressiva de conectivos interparágrafos (no início de D1, D2 e Conclusão, ex: "Em primeiro lugar", "Ademais", "Além disso", "Portanto", "Outrossim") e conectivos intraparágrafos sem repetição monótona.
   - 160 pts (Nível 4): Coesão adequada, mas com alguma repetição.
5. Competência 5 (Proposta de Intervenção Social):
   - Avaliação objetiva dos 5 elementos (40 pontos cada):
     * Agente: quem executará a medida (40 pts)
     * Ação: o que deve ser feito (40 pts)
     * Meio/Modo: como será executado (40 pts)
     * Efeito/Finalidade: para quê / com qual objetivo (40 pts)
     * Detalhamento: explicação, exemplo ou justificativa de um dos termos (40 pts)
   - SE OS 5 ELEMENTOS ESTIVEREM PRESENTES na proposta (geralmente no parágrafo final), A NOTA DE C5 DEVE SER OBRIGATORIAMENTE 200!

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
