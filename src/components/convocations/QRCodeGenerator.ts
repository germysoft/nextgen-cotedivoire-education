import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

// Génère un QR code en base64 pour inclusion dans le PDF
export async function generateQRCodeBase64(
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 100,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  };

  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: defaultOptions.width,
      margin: defaultOptions.margin,
      color: defaultOptions.color,
      errorCorrectionLevel: 'H' // High error correction for better scanning
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// Génère un QR code canvas pour affichage web
export async function generateQRCodeCanvas(
  data: string,
  canvas: HTMLCanvasElement,
  options: QRCodeOptions = {}
): Promise<void> {
  const defaultOptions = {
    width: 150,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  };

  try {
    await QRCode.toCanvas(canvas, data, {
      width: defaultOptions.width,
      margin: defaultOptions.margin,
      color: defaultOptions.color,
      errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw error;
  }
}

// Génère un SVG QR code
export async function generateQRCodeSVG(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 100,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  };

  try {
    const svgString = await QRCode.toString(data, {
      type: 'svg',
      width: defaultOptions.width,
      margin: defaultOptions.margin,
      color: defaultOptions.color,
      errorCorrectionLevel: 'H'
    });
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
}
