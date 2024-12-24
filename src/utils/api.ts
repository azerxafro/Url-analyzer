import axios from 'axios';
import type { AnalysisResult } from '../types';

// Always use relative path for API requests
const API_URL = '/api';

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