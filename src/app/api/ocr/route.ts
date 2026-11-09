import { NextRequest, NextResponse } from 'next/server';

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

    const apiKey = (userProvidedKey && String(userProvidedKey).trim()) ||
                   process.env.GEMINI_API_KEY ||
                   process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'Chave da Google Gemini API não configurada. Configure a variável GEMINI_API_KEY no painel da Vercel ou clique no ícone de chave (🔑) no topo do site para inserir uma chave válida do Google AI Studio.',
        needKey: true
      }, { status: 401 });
    }

    // Identificar formato da imagem (JPEG, PNG, WEBP, etc.)
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');

    const ocrInstruction = `Você é um especialista em OCR e transcrição paleográfica de redações manuscritas do ENEM em língua portuguesa do Brasil.
Sua tarefa é transcrever com fidelidade absoluta todo o texto redigido pelo estudante nesta folha de redação.

DIRETRIZES FUNDAMENTAIS:
1. Transcreva EXATAMENTE as palavras manuscritas na imagem, preservando pontuação, acentuação e vocabulário utilizado pelo estudante.
2. Ignore os números das linhas impressos na margem esquerda (1, 2, 3... 30) e eventuais cabeçalhos impressos da folha oficial.
3. Preserve a estrutura em parágrafos: separe os parágrafos com quebra de linha dupla (Enter Enter).
4. Se uma palavra estiver dividida no fim de uma linha com hífen de translineação (ex: "so- / ciedade"), una a palavra normalmente ("sociedade").
5. NÃO invente texto. NÃO adicione comentários, correções nem explicações. Retorne EXCLUSIVAMENTE o texto manuscrito transcrito da imagem.`;

    // 1ª Tentativa: Gemini 1.5 Pro
    let lastErrorDetails = '';
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
                    mimeType: mimeType,
                    data: cleanBase64,
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.05,
          }
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
        lastErrorDetails = errJson.error?.message || `Status HTTP ${responsePro.status}`;
        console.warn('Gemini Pro OCR error:', lastErrorDetails);
      }
    } catch (proError: any) {
      lastErrorDetails = proError.message || String(proError);
      console.warn('Tentativa com Gemini 1.5 Pro falhou:', lastErrorDetails);
    }

    // 2ª Tentativa: Gemini 1.5 Flash
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
                    mimeType: mimeType,
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
        if (textFlash && textFlash.trim().length > 10) {
          return NextResponse.json({
            text: textFlash.trim(),
            confidence: 0.95,
            model_used: 'Gemini 1.5 Flash Vision',
            source: 'gemini_vision_flash'
          });
        }
      } else {
        const errJson = await responseFlash.json().catch(() => ({}));
        lastErrorDetails = errJson.error?.message || `Status HTTP ${responseFlash.status}`;
        console.warn('Gemini Flash OCR error:', lastErrorDetails);
      }
    } catch (flashError: any) {
      lastErrorDetails = flashError.message || String(flashError);
      console.warn('Fallback Gemini Flash falhou:', lastErrorDetails);
    }

    // Se chegou até aqui com erro na API da Google, retornar o erro real para o usuário
    return NextResponse.json({
      error: `Erro ao comunicar com a Google Gemini API: ${lastErrorDetails}. Verifique se a sua chave no Google AI Studio está ativa e possui cota.`,
      details: lastErrorDetails,
      needKey: true
    }, { status: 400 });

  } catch (error: any) {
    console.error('Erro na rota de OCR:', error);
    return NextResponse.json({
      error: `Falha ao processar OCR da imagem: ${error.message || 'Erro interno'}`
    }, { status: 500 });
  }
}
