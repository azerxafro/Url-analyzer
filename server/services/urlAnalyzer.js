import axios from 'axios';
import { checkSuspiciousDomain, checkSuspiciousPatterns } from './urlChecker.js';
import { validateURL, validateAPIKey } from './validators.js';

export async function analyzeURLExternal(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }

  const urlInfo = validateURL(url);
  
  if (!urlInfo.isValid) {
    return {
      url,
      riskLevel: 'High',
      riskScore: 100,
      checks: [{
        name: 'URL Structure',
        status: 'fail',
        details: 'Invalid URL format or unsupported protocol'
      }],
      timestamp: new Date().toISOString()
    };
  }

  const checks = [];
  let riskScore = 0;

  // Domain check
  const domainCheck = checkSuspiciousDomain(url);
  checks.push({
    name: 'Domain Analysis',
    status: domainCheck.status,
    details: domainCheck.details
  });
  riskScore += domainCheck.score;

  // Pattern check
  const patternCheck = checkSuspiciousPatterns(url);
  checks.push({
    name: 'Pattern Analysis',
    status: patternCheck.status,
    details: patternCheck.details
  });
  riskScore += patternCheck.score;

  // Safe Browsing check
  try {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    validateAPIKey(apiKey);
    const safeBrowsingCheck = await checkSafeBrowsing(url, apiKey);
    checks.push(safeBrowsingCheck.check);
    riskScore += safeBrowsingCheck.score;
  } catch (error) {
    checks.push({
      name: 'Safe Browsing Check',
      status: 'warning',
      details: 'Unable to verify with Google Safe Browsing API'
    });
    riskScore += 15;
  }

  // SSL check
  try {
    const sslCheck = await checkSSL(url);
    checks.push(sslCheck.check);
    riskScore += sslCheck.score;
  } catch (error) {
    checks.push({
      name: 'SSL Certificate',
      status: 'fail',
      details: 'Failed to verify SSL certificate'
    });
    riskScore += 25;
  }

  return {
    url,
    riskLevel: getRiskLevel(riskScore),
    riskScore: Math.min(100, riskScore), // Ensure score doesn't exceed 100
    checks,
    timestamp: new Date().toISOString()
  };
}

async function checkSafeBrowsing(url, apiKey) {
  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: {
          clientId: "url-security-analyzer",
          clientVersion: "1.0.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      },
      {
        timeout: 5000
      }
    );

    if (response.data.matches) {
      return {
        check: {
          name: 'Safe Browsing Check',
          status: 'fail',
          details: 'URL found in Google Safe Browsing database'
        },
        score: 40
      };
    }

    return {
      check: {
        name: 'Safe Browsing Check',
        status: 'pass',
        details: 'URL not found in malicious database'
      },
      score: 0
    };
  } catch (error) {
    throw new Error('Safe Browsing API check failed');
  }
}

async function checkSSL(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: null,
      maxRedirects: 5
    });
    
    const isSecure = response.request?.protocol === 'https:';
    
    return {
      check: {
        name: 'SSL Certificate',
        status: isSecure ? 'pass' : 'fail',
        details: isSecure ? 'Valid SSL certificate' : 'Invalid or missing SSL certificate'
      },
      score: isSecure ? 0 : 25
    };
  } catch (error) {
    throw new Error('SSL certificate check failed');
  }
}

function getRiskLevel(score) {
  if (score < 25) return 'Low';
  if (score < 50) return 'Medium';
  return 'High';
}