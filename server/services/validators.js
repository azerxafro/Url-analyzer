export function validateURL(url) {
  try {
    const parsedUrl = new URL(url);
    // Remove any trailing slashes and convert to lowercase
    const hostname = parsedUrl.hostname.toLowerCase().replace(/\/$/, '');
    
    return {
      isValid: parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:',
      hostname,
      protocol: parsedUrl.protocol,
      pathname: parsedUrl.pathname
    };
  } catch {
    return {
      isValid: false,
      hostname: '',
      protocol: '',
      pathname: ''
    };
  }
}

export function validateAPIKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
    throw new Error('Invalid API key configuration');
  }
  return true;
}