import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3000/api';

export async function analyzeURLAPI(url: string): Promise<AnalysisResult> {
  try {
    const response = await axios.post(`${API_URL}/analyze`, { url });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('Failed to analyze URL');
  }
}