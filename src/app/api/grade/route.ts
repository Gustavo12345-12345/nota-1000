import { NextRequest, NextResponse } from 'next/server';
import { evaluateEssayPedagogical } from '@/lib/evaluator';
import { CorrectionResult } from '@/types/essay';

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

    const apiKey = userProvidedKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Se houver API key configurada, podemos chamar o Gemini API com formato JSON estruturado
    if (apiKey) {
      try {
        const prompt = `Você é um corretor oficial sênior da banca do ENEM (Exame Nacional do Ensino Médio - INEP).
Avalie a seguinte redação com base nas 5 competências oficiais do ENEM (C1, C2, C3, C4, C5), com pontuações estritamente múltiplas de 40 (0, 40, 80, 120, 160, 200).

TEMA DA REDAÇÃO: "${tema || 'Tema Livre do ENEM'}"
${titulo ? `TÍTULO: "${titulo}"` : ''}

TEXTO DA REDAÇÃO:
"""
${text}
"""

Responda ESTRITAMENTE em formato JSON compatível com a interface abaixo, sem marcação markdown adicional fora do bloco json:
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
      "trecho": string (substring exata contida no texto),
      "problema": string,
      "sugestao": string,
      "competencia": string
    }
  ]
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText);
            // Preencher metadados complementares
            const baseResult = evaluateEssayPedagogical(text, tema, titulo);
            const mergedResult: CorrectionResult = {
              ...baseResult,
              ...parsed,
              id: 'corr-gemini-' + Date.now(),
              tema: tema || 'Tema Livre',
              titulo,
              texto_original: text,
              data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              estatisticas: baseResult.estatisticas,
              distancia_1000: 1000 - (parsed.nota_total || baseResult.nota_total),
            };
            return NextResponse.json(mergedResult);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to pedagogical engine:', geminiError);
      }
    }

    // Fallback garantido e robusto para o avaliador pedagógico INEP
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
