import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, isSample, apiKey: userProvidedKey } = body;

    // Exemplo de demonstração embutido
    if (isSample) {
      return NextResponse.json({
        text: `A invisibilidade do trabalho de cuidado realizado pela mulher no Brasil é um assunto muito sério que precisa ser resolvido logo. Historicamente as mulheres sempre cuidaram da casa e dos filhos sem ganhar nada por isso, enquanto os homens iam trabalhar fora e ganhavam dinheiro. Isso acontece por causa do preconceito da sociedade brasileira, além disso o governo não dá creches suficientes para ajudar as mães.

Primeiramente, devemos falar sobre a cultura machista. Desde pequenas as meninas recebem bonecas e panelinhas de brinquedo enquanto os meninos ganham carros e brinquedos científicos. Esse costume faz com que todo mundo ache normal a mulher limpar a casa cozinhar e cuidar dos parentes idosos. Segundo a filósofa Simone de Beauvoir ninguém nasce mulher, torna-se mulher mostrando que a sociedade impõe esses papéis desiguais.

Além do mais, a falta de creche é um grande obstáculo. Muitas mulheres não conseguem emprego de carteira assinada porque não tem com quem deixar os filhos pequenos durante o dia. Dessa forma elas acabam trabalhando no mercado informal ou ficam dependendo dos maridos. Por conseguinte, a renda delas fica muito menor e o país perde a força de trabalho feminina.

Portanto medidas precisam ser tomadas pelo governo. O Ministério da Educação junto com a sociedade deve criar mais creches nas periferias das cidades brasileiras para as mães deixarem os filhos com segurança para que assim o Brasil possa ser um lugar mais justo para todas.`,
        confidence: 0.98,
        model_used: 'Folha de Exemplo (Demonstração)',
        source: 'ocr_sample'
      });
    }

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem foi enviada para o OCR.' }, { status: 400 });
    }

    // Detectar provedor pela chave (OpenAI começa com "sk-")
    const providedKey = (userProvidedKey && String(userProvidedKey).trim()) || '';
    const openAiKey = (providedKey.startsWith('sk-') ? providedKey : null) ||
                      process.env.OPENAI_API_KEY;

    const geminiKey = (!providedKey.startsWith('sk-') && providedKey ? providedKey : null) ||
                      process.env.GEMINI_API_KEY ||
                      process.env.GOOGLE_API_KEY;

    if (!openAiKey && !geminiKey) {
      return NextResponse.json({
        error: 'Chave de IA não configurada. Você pode usar uma chave do ChatGPT/OpenAI (começa com "sk-") ou do Google Gemini. Insira no campo abaixo ou configure na Vercel.',
        needKey: true
      }, { status: 401 });
    }

    // Formato da imagem (JPEG, PNG, WEBP)
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');

    const ocrInstruction = `Você é um especialista em transcrição paleográfica de redações manuscritas do ENEM em língua portuguesa do Brasil.
Transcreva com fidelidade absoluta todo o texto escrito pelo candidato nesta folha de redação.

DIRETRIZES:
1. Transcreva EXATAMENTE as palavras escritas, preservando pontuação e vocabulário do aluno.
2. Ignore os números das linhas da margem esquerda (1, 2, 3... 30) e os títulos impressos da folha do ENEM.
3. Preserve os parágrafos separando-os com quebra de linha dupla (Enter Enter).
4. Junte palavras separadas por hífen no fim da linha (translineação).
5. Retorne EXCLUSIVAMENTE o texto manuscrito transcrito, sem introduções nem observações.`;

    // 1. OPENAI (CHATGPT - GPT-4o / GPT-4o-mini Vision)
    if (openAiKey) {
      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        // Tentamos gpt-4o (máxima precisão em caligrafia) com fallback para gpt-4o-mini
        let completion;
        try {
          completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: ocrInstruction },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${cleanBase64}`,
                      detail: 'high',
                    },
                  },
                ],
              },
            ],
            temperature: 0.1,
            max_tokens: 1800,
          });
        } catch {
          completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: ocrInstruction },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${cleanBase64}`,
                      detail: 'high',
                    },
                  },
                ],
              },
            ],
            temperature: 0.1,
            max_tokens: 1800,
          });
        }

        const recognizedText = completion.choices[0]?.message?.content?.trim();
        if (recognizedText && recognizedText.length > 10) {
          return NextResponse.json({
            text: recognizedText,
            confidence: 0.99,
            model_used: 'ChatGPT (OpenAI GPT-4o Vision)',
            source: 'openai_vision'
          });
        }
      } catch (openAiErr: any) {
        console.error('Erro na OpenAI:', openAiErr);
        return NextResponse.json({
          error: `Erro na OpenAI (ChatGPT): ${openAiErr.message || 'Verifique o saldo e permissões da sua chave OpenAI'}.`,
          needKey: true,
          provider: 'openai'
        }, { status: 400 });
      }
    }

    // 2. GOOGLE GEMINI (Caso use chave Gemini)
    if (geminiKey) {
      try {
        const responsePro = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: ocrInstruction },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: cleanBase64,
                    }
                  }
                ]
              }
            ],
            generationConfig: { temperature: 0.05 }
          }),
        });

        if (responsePro.ok) {
          const dataPro = await responsePro.json();
          const recognizedText = dataPro.candidates?.[0]?.content?.parts?.[0]?.text;
          if (recognizedText && recognizedText.trim().length > 10) {
            return NextResponse.json({
              text: recognizedText.trim(),
              confidence: 0.98,
              model_used: 'Gemini 1.5 Pro Vision',
              source: 'gemini_vision_pro'
            });
          }
        } else {
          const errJson = await responsePro.json().catch(() => ({}));
          const errMsg = errJson.error?.message || `Status ${responsePro.status}`;
          return NextResponse.json({
            error: `Erro no Gemini: ${errMsg}. Dica: Você também pode usar uma chave da OpenAI (ChatGPT) começando com "sk-".`,
            needKey: true,
            provider: 'gemini'
          }, { status: 400 });
        }
      } catch (geminiErr: any) {
        return NextResponse.json({
          error: `Falha ao conectar no Gemini: ${geminiErr.message}.`,
          needKey: true
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      error: 'Não foi possível processar o OCR. Insira uma chave válida da OpenAI (ChatGPT) ou Gemini.',
      needKey: true
    }, { status: 400 });

  } catch (error: any) {
    console.error('Erro geral na rota de OCR:', error);
    return NextResponse.json({
      error: `Erro ao processar imagem: ${error.message || 'Erro inesperado'}`
    }, { status: 500 });
  }
}
