import { useState, useCallback } from "react";
import {
  searchCompanies,
  getCompanyDetails,
  calculateRiskAnalysis,
  getAIExplanation,
  getPriceProjection,
  type CompanyDetails,
  type RiskAnalysis,
  type AIExplanation,
  type PriceProjection
} from "@/services/api";
import { toast } from "sonner";

export interface AnalysisState {
  company: CompanyDetails | null;
  riskAnalysis: RiskAnalysis | null;
  aiExplanation: AIExplanation | null;
  priceProjection: PriceProjection | null;
  isLoading: boolean;
  isLoadingAI: boolean;
  isLoadingProjection: boolean;
  error: string | null;
}

export function useCompanyAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    company: null,
    riskAnalysis: null,
    aiExplanation: null,
    priceProjection: null,
    isLoading: false,
    isLoadingAI: false,
    isLoadingProjection: false,
    error: null,
  });

  const analyzeCompany = useCallback(async (symbolOrName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First, search for the company to get the symbol
      const searchResults = await searchCompanies(symbolOrName);

      if (searchResults.length === 0) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          company: null,
          riskAnalysis: null,
          aiExplanation: null,
          error: `No company found matching "${symbolOrName}"`
        }));
        return null;
      }

      // Get the first match's symbol
      const symbol = searchResults[0].symbol;

      // Fetch detailed company data
      const companyDetails = await getCompanyDetails(symbol);

      if (!companyDetails) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Could not load details for ${symbol}`
        }));
        return null;
      }

      // Calculate risk score
      const riskAnalysis = await calculateRiskAnalysis(
        companyDetails
      );

      setState(prev => ({
        ...prev,
        company: companyDetails,
        riskAnalysis,
        aiExplanation: null,
        priceProjection: null,
        isLoading: false,
        error: null,
      }));

      return { company: companyDetails, riskAnalysis };
    } catch (error) {
      console.error('Analysis error:', error);
      const message = error instanceof Error ? error.message : 'Failed to analyze company';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message
      }));
      toast.error(message);
      return null;
    }
  }, []);

  const generateExplanation = useCallback(async () => {
    if (!state.company || !state.riskAnalysis) {
      toast.error('Please analyze a company first');
      return;
    }

    setState(prev => ({ ...prev, isLoadingAI: true }));

    try {
      const explanation = await getAIExplanation(
        state.company.symbol,
        state.company.name,
        state.company.sector,
        state.riskAnalysis.riskScore,
        state.riskAnalysis.riskLevel,
        state.riskAnalysis.components,
        state.company.financials,
        state.company.ratios,
        state.riskAnalysis.indicators
      );

      setState(prev => ({
        ...prev,
        aiExplanation: explanation,
        isLoadingAI: false,
      }));

      return explanation;
    } catch (error) {
      console.error('AI explanation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate explanation';
      setState(prev => ({ ...prev, isLoadingAI: false }));
      toast.error(message);
      return null;
    }
  }, [state.company, state.riskAnalysis]);

  const generateProjection = useCallback(async () => {
    if (!state.company) {
      toast.error('Please analyze a company first');
      return;
    }

    setState(prev => ({ ...prev, isLoadingProjection: true }));

    try {
      const projection = await getPriceProjection(
        state.company.symbol,
        state.company.price,
        state.company.historicalPrices || [],
        state.company.financials,
        state.company.ratios,
        state.company.growth
      );

      setState(prev => ({
        ...prev,
        priceProjection: projection,
        isLoadingProjection: false,
      }));

      return projection;
    } catch (error) {
      console.error('Price projection error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate projection';
      setState(prev => ({ ...prev, isLoadingProjection: false }));
      toast.error(message);
      return null;
    }
  }, [state.company]);

  const reset = useCallback(() => {
    setState({
      company: null,
      riskAnalysis: null,
      aiExplanation: null,
      priceProjection: null,
      isLoading: false,
      isLoadingAI: false,
      isLoadingProjection: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    analyzeCompany,
    generateExplanation,
    generateProjection,
    reset,
  };
}
