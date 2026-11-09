'use client';

/**
 * Renderiza a primeira página de um arquivo PDF para imagem JPEG via pdf.js
 */
async function renderPdfToJpeg(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Carrega pdfjs dinamicamente do CDN apenas se o usuário enviar um arquivo PDF
  if (!(window as any).pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve();
      };
      script.onerror = () => reject(new Error('Não foi possível inicializar o leitor de PDF. Verifique sua conexão.'));
      document.head.appendChild(script);
    });
  }

  const pdfjsLib = (window as any).pdfjsLib;
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  // Escala 2.0 para manter nitidez na caligrafia da folha de redação
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Falha ao renderizar página do PDF.');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Normaliza qualquer formato de foto ou documento (JPEG, PNG, WEBP, HEIC, HEIF, BMP, GIF, TIFF, PDF)
 * para uma imagem JPEG otimizada (máx 2048px, ~500KB), garantindo compatibilidade absoluta
 * com OpenAI Vision e evitando o limite de payload de 4.5MB da Vercel.
 */
export async function normalizeImageForOCR(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // 1. Suporte a PDF escaneado (CamScanner, Google Drive, impressões)
  if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    return await renderPdfToJpeg(file);
  }

  let imageBlob: Blob = file;

  // 2. Suporte a HEIC / HEIF (fotos nativas de iPhone/iPad)
  if (
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif') ||
    fileType === 'image/heic' ||
    fileType === 'image/heif'
  ) {
    try {
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      imageBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (heicErr) {
      console.warn('Conversão de HEIC tentou fallback nativo:', heicErr);
    }
  }

  // 3. Carregar imagem em elemento HTMLImage
  const objectUrl = URL.createObjectURL(imageBlob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Não foi possível ler o arquivo. Envie uma foto ou documento legível.'));
      image.src = objectUrl;
    });

    // 4. Redimensionar para no máximo 2048px mantendo proporção (ideal para OCR de caligrafia)
    const maxDim = 2048;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    // 5. Renderizar em Canvas com fundo branco
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Falha ao inicializar processador gráfico do navegador.');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // 6. Exportar como JPEG de alta fidelidade
    return canvas.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
