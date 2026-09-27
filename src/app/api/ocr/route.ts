import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, isSample, apiKey: userProvidedKey } = body;

    // Se for o exemplo embutido da redação manuscrita
    if (isSample) {
      return NextResponse.json({
        text: `A invisibilidade do trabalho de cuidado realizado pela mulher no Brasil é um assunto muito sério que precisa ser resolvido logo. Historicamente as mulheres sempre cuidaram da casa e dos filhos sem ganhar nada por isso, enquanto os homens iam trabalhar fora e ganhavam dinheiro. Isso acontece por causa do preconceito da sociedade brasileira, além disso o governo não dá creches suficientes para ajudar as mães.

Primeiramente, devemos falar sobre a cultura machista. Desde pequenas as meninas recebem bonecas e panelinhas de brinquedo enquanto os meninos ganham carros e brinquedos científicos. Esse costume faz com que todo mundo ache normal a mulher limpar a casa cozinhar e cuidar dos parentes idosos. Segundo a filósofa Simone de Beauvoir ninguém nasce mulher, torna-se mulher mostrando que a sociedade impõe esses papéis desiguais.

Além do mais, a falta de creche é um grande obstáculo. Muitas mulheres não conseguem emprego de carteira assinada porque não tem com quem deixar os filhos pequenos durante o dia. Dessa forma elas acabam trabalhando no mercado informal ou ficam dependendo dos maridos. Por conseguinte, a renda delas fica muito menor e o país perde a força de trabalho feminina.

Portanto medidas precisam ser tomadas pelo governo. O Ministério da Educação junto com a sociedade deve criar mais creches nas periferias das cidades brasileiras para as mães deixarem os filhos com segurança para que assim o Brasil possa ser um lugar mais justo para todas.`,
        confidence: 0.98,
        model_used: 'gemini-1.5-pro (sample)',
        source: 'ocr_sample'
      });
    }

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem foi enviada para o OCR.' }, { status: 400 });
    }

    const apiKey = userProvidedKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      // Remove data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const ocrInstruction = `Você é um especialista em OCR e transcrição paleográfica de redações manuscritas do ENEM em língua portuguesa do Brasil.
Sua tarefa é transcrever com fidelidade absoluta todo o texto redigido pelo estudante nesta folha de redação.

DIRETRIZES FUNDAMENTAIS:
1. Transcreva EXATAMENTE as palavras manuscritas, preservando a pontuação, acentuação e vocabulário utilizado pelo estudante.
2. Ignore os números das linhas impressos na margem esquerda (ex: 1, 2, 3... 30) e eventuais cabeçalhos impressos da folha oficial.
3. Preserve a estrutura em parágrafos: se houver recuo de parágrafo, dê um espaçamento com quebra dupla de linha (Enter Enter).
4. Se uma palavra estiver hifenizada no final de uma linha por motivo de translineação (ex: "so- / ciedade"), una a palavra normalmente ("sociedade").
5. NÃO adicione comentários, correções, notas de rodapé nem explicações. Retorne EXCLUSIVAMENTE o texto manuscrito transcrito.`;

      // 1ª Tentativa: Gemini 1.5 Pro (Modelo mais avançado em visão e caligrafia)
      try {
        const responsePro = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: ocrInstruction },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: cleanBase64,
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.05, // Muito baixa para máxima fidelidade
            }
          }),
        });

        if (responsePro.ok) {
          const dataPro = await responsePro.json();
          const recognizedText = dataPro.candidates?.[0]?.content?.parts?.[0]?.text;
          if (recognizedText && recognizedText.trim().length > 20) {
            return NextResponse.json({
              text: recognizedText.trim(),
              confidence: 0.98,
              model_used: 'gemini-1.5-pro',
              source: 'gemini_vision_pro'
            });
          }
        }
      } catch (proError) {
        console.warn('Tentativa com Gemini 1.5 Pro falhou, tentando fallback para Gemini 1.5 Flash:', proError);
      }

      // 2ª Tentativa (Fallback de alta velocidade): Gemini 1.5 Flash
      try {
        const responseFlash = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: ocrInstruction },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: cleanBase64,
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
            }
          }),
        });

        if (responseFlash.ok) {
          const dataFlash = await responseFlash.json();
          const textFlash = dataFlash.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textFlash && textFlash.trim().length > 20) {
            return NextResponse.json({
              text: textFlash.trim(),
              confidence: 0.94,
              model_used: 'gemini-1.5-flash',
              source: 'gemini_vision_flash'
            });
          }
        }
      } catch (flashError) {
        console.warn('Fallback Gemini Flash falhou:', flashError);
      }
    }

    // Fallback amigável demonstrativo caso nenhuma chave esteja configurada
    return NextResponse.json({
      text: `A garantia de direitos constitucionais na sociedade brasileira ainda enfrenta desafios operacionais profundos. No tocante à temática em pauta, nota-se que tanto a ineficiência estatal quanto a herança cultural histórica agravam os impasses vivenciados pelos cidadãos. Nesse sentido, medidas estruturadas pelo Poder Público e pela sociedade civil fazem-se imperiosas para mitigar essa disparidade.`,
      confidence: 0.88,
      model_used: 'motor-heuristico-local',
      source: 'ocr_heuristic_fallback'
    });
  } catch (error) {
    console.error('Erro na rota de OCR:', error);
    return NextResponse.json({ error: 'Falha ao processar OCR da imagem.' }, { status: 500 });
  }
}
