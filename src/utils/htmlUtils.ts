/**
 * Decodes HTML entities in a string
 * @param text - The text containing HTML entities
 * @returns The decoded string
 */
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return text;
  
  // First try the textarea method for comprehensive decoding
  try {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  } catch {
    // Fallback to manual decoding if textarea method fails
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x3C;/g, '<')
      .replace(/&#x3E;/g, '>')
      .replace(/&#x26;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
};
