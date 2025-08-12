import { useState, useEffect, useCallback } from 'react';
import { reverseEngineeringAPI, AnalysisResponse, AnalysisRequest } from '../services/api';

export const useAnalysis = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (request: AnalysisRequest) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await reverseEngineeringAPI.uploadAndAnalyze(request);
      setCurrentAnalysis(response);
      
      // Start polling for status updates
      pollAnalysisStatus(response.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsProcessing(false);
    }
  }, []);

  const pollAnalysisStatus = useCallback(async (analysisId: string) => {
    try {
      const response = await reverseEngineeringAPI.getAnalysisStatus(analysisId);
      setCurrentAnalysis(response);
      
      if (response.status === 'processing') {
        // Continue polling every 2 seconds
        setTimeout(() => pollAnalysisStatus(analysisId), 2000);
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status check failed');
      setIsProcessing(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (message: string) => {
    try {
      const response = await reverseEngineeringAPI.sendChatMessage(message, currentAnalysis);
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Chat message failed');
    }
  }, [currentAnalysis]);

  const generateIntegrationCode = useCallback(async () => {
    if (!currentAnalysis?.results?.apiCalls) {
      throw new Error('No API calls found to generate integration code');
    }
    
    try {
      const code = await reverseEngineeringAPI.generateIntegrationCode(
        currentAnalysis.results.apiCalls
      );
      return code;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Code generation failed');
    }
  }, [currentAnalysis]);

  const submitFeedback = useCallback(async (rating: number, comments: string) => {
    if (!currentAnalysis) {
      throw new Error('No analysis to provide feedback for');
    }
    
    try {
      await reverseEngineeringAPI.submitFeedback(currentAnalysis.id, rating, comments);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Feedback submission failed');
    }
  }, [currentAnalysis]);

  return {
    currentAnalysis,
    isProcessing,
    error,
    startAnalysis,
    sendChatMessage,
    generateIntegrationCode,
    submitFeedback
  };
};