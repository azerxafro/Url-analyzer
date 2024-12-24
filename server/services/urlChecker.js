import { POPULAR_DOMAINS, SUSPICIOUS_PATTERNS } from './constants.js';
import { levenshteinDistance } from './utils.js';
import { validateURL } from './validators.js';

export function checkSuspiciousDomain(url) {
  const { hostname } = validateURL(url);
  if (!hostname) return { status: 'fail', score: 50, details: 'Invalid hostname' };
  
  // Extract the base domain (e.g., "amaz0n.com" from "www.amaz0n.com/deals")
  const baseDomain = hostname.replace(/^www\./, '');
  
  // Check for number substitutions first
  if (/\d/.test(baseDomain)) {
    const denumberized = baseDomain
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5/g, 's')
      .replace(/7/g, 't');
    
    const matchingDomain = POPULAR_DOMAINS.find(domain => {
      const domainWithoutTLD = domain.replace(/\.[^.]+$/, '');
      return denumberized.includes(domainWithoutTLD);
    });
    
    if (matchingDomain) {
      return {
        status: 'fail',
        score: 40,
        details: `Suspicious number substitution detected, similar to ${matchingDomain}`
      };
    }
  }

  // Then check for typosquatting
  const suspiciousDomain = POPULAR_DOMAINS.find(popularDomain => {
    const distance = levenshteinDistance(baseDomain, popularDomain);
    return distance > 0 && distance <= 2 && baseDomain !== popularDomain;
  });

  if (suspiciousDomain) {
    return {
      status: 'fail',
      score: 35,
      details: `Domain appears to be imitating ${suspiciousDomain}`
    };
  }

  return {
    status: 'pass',
    score: 0,
    details: 'Domain appears legitimate'
  };
}

export function checkSuspiciousPatterns(url) {
  const { hostname } = validateURL(url);
  if (!hostname) return { status: 'fail', score: 50, details: 'Invalid hostname' };

  const matches = [];
  let totalScore = 0;

  // Check each pattern
  for (const { pattern, score, message } of SUSPICIOUS_PATTERNS) {
    if (pattern.test(hostname)) {
      matches.push(message);
      totalScore += score;
    }
  }

  if (matches.length > 0) {
    return {
      status: 'fail',
      score: Math.min(totalScore, 50),
      details: matches.join(', ')
    };
  }

  return {
    status: 'pass',
    score: 0,
    details: 'No suspicious patterns detected'
  };
}