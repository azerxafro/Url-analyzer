export const POPULAR_DOMAINS = [
  'amazon.com',
  'google.com',
  'facebook.com',
  'apple.com',
  'microsoft.com',
  'paypal.com',
  'netflix.com',
  'ebay.com',
  'walmart.com',
  'target.com'
];

export const SUSPICIOUS_PATTERNS = [
  { 
    pattern: /\d+(?=[a-z])|[a-z](?=\d+)/i, 
    score: 25, 
    message: 'Mixed numbers and letters in domain' 
  },
  { 
    pattern: /[0o][0-9il]/i, 
    score: 30, 
    message: 'Potential character substitution' 
  },
  { 
    pattern: /-{2,}|\_{2,}/, 
    score: 15, 
    message: 'Suspicious character repetition' 
  },
  {
    pattern: /secure|login|account|verify|update/i,
    score: 20,
    message: 'Suspicious security-related keywords'
  }
];