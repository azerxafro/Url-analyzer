export type SecurityCheckStatus = 'pass' | 'fail' | 'warning';

export interface SecurityCheck {
  name: string;
  status: SecurityCheckStatus;
  details: string;
}

export interface AnalysisResult {
  url: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  checks: SecurityCheck[];
  timestamp: string;
}