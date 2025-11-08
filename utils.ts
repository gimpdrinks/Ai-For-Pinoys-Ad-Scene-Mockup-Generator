export const parseBase64 = (dataUrl: string): { base64Data: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) throw new Error('Invalid Data URL');
    const mimeType = parts[0].split(':')[1].split(';')[0];
    return { base64Data: parts[1], mimeType };
  };
