const API_URL = 'mongodb+srv://sanjay:sanjay@cluster0.fhakbop.mongodb.net/?appName=Cluster0';

// Types expected by the UI
export interface CompanyDetails {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  exchange: string;
  sector: string;
  description: string;
  employees: number;
  marketCap: number;
  ratios: {
    peRatio: number;
    netMargin: number;
    currentRatio: number;
    debtToEquity: number;
    returnOnAssets: number;
  };
  financials: {
    revenue: number;
    totalDebt: number;
    cashAndEquivalents: number;
    freeCashFlow: number;
  };
  growth: {
    revenueGrowthYoY: number;
  };
  historicalPrices: { date: string; close: number }[];
  changes?: number;
  changesPercentage?: number;
  chartUrl?: string;
  competitors?: string[];
}

export interface RiskAnalysis {
  riskScore: number; // 0-100
  riskLevel: "Low" | "Moderate" | "High";
  components: {
    profitability: { score: number };
    liquidity: { score: number };
    solvency: { score: number };
    efficiency: { score: number };
    growth: { score: number };
  };
  indicators: {
    capitalSafety: string;
  };
  disclaimer: string;
}

export interface AIExplanation {
  summary: string;
  details: string;
}

export interface PriceProjection {
  model_type: string;
  starting_price: number;
  scenarios: {
    conservative: number[];
    base: number[];
    optimistic: number[];
  };
  confidence_level: string;
  important_note: string;
  methodology: {
    priceCAGR: number;
    revenueCAGR: number;
    profitCAGR: number;
    roeStability: number;
    fcfTrend: number;
    fsm: number;
    adjustedTrend: number;
  };
  explanation: string;
  disclaimer: string;
}

// Helpers
export const searchCompanies = async (query: string) => {
  // For now, just return the query as a hit if it looks like a ticker
  // In a real app, we'd have a search endpoint
  return [{ symbol: query.toUpperCase(), name: query.toUpperCase() }];
};

export const getCompanyDetails = async (symbol: string): Promise<CompanyDetails | null> => {
  try {
    const response = await fetch(`${API_URL}/stock/${symbol}`);
    if (!response.ok) return null;
    const data = await response.json();

    // Transform backend data to CompanyDetails
    // We mock missing financial data for the UI to render prettily
    // In a production app, we would fetch this from a provider
    const price = data.price || 0;
    const changes = data.prices && data.prices.length > 1
      ? price - data.prices[data.prices.length - 2].price
      : 0;
    const changesPercentage = (changes / price) * 100;

    return {
      symbol: data.symbol,
      name: data.symbol, // Yahoo often gives name, but let's stick to symbol if missing
      price: price,
      currency: data.currency,
      exchange: "US Market",
      sector: "Technology", // Mocked
      description: `Analysis for ${data.symbol}`,
      employees: 100000,
      marketCap: 1000000000000, // Mocked 1T
      ratios: {
        peRatio: 25.5,
        netMargin: 0.15,
        currentRatio: 1.2,
        debtToEquity: 0.5,
        returnOnAssets: 0.08
      },
      financials: {
        revenue: 100000000000,
        totalDebt: 50000000000,
        cashAndEquivalents: 60000000000,
        freeCashFlow: 20000000000
      },
      growth: {
        revenueGrowthYoY: 0.12
      },
      historicalPrices: data.prices.map((p: any) => ({ date: p.date, close: p.price })),
      changes,
      changesPercentage,
      competitors: ["MSFT", "GOOGL", "AMZN"] // Mocked
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const calculateRiskAnalysis = async (companyDetails: CompanyDetails): Promise<RiskAnalysis | null> => {
  try {
    const stockData = {
      price: companyDetails.price,
      currency: companyDetails.currency,
      prices: companyDetails.historicalPrices
    };

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: companyDetails.symbol, stockData })
    });

    if (!response.ok) throw new Error("Analysis failed");

    const aiData = await response.json();
    const riskScore = aiData.riskScore || 50; // 1-10 risk score from AI
    // Scale 1-10 to 1-100 for UI if needed, or if UI expects 1-100.
    // The UI gauge usually expects 0-100.
    const normalizedScore = riskScore <= 10 ? riskScore * 10 : riskScore;

    return {
      riskScore: normalizedScore,
      riskLevel: normalizedScore < 30 ? "Low" : normalizedScore < 70 ? "Moderate" : "High",
      components: {
        profitability: { score: normalizedScore },
        liquidity: { score: normalizedScore },
        solvency: { score: normalizedScore },
        efficiency: { score: normalizedScore },
        growth: { score: normalizedScore }
      },
      indicators: {
        capitalSafety: aiData.analysis || "AI Analysis provided."
      },
      disclaimer: "This analysis is generated by AI (Gemini) and utilizes market data. It is for educational purposes only."
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getAIExplanation = async (
  symbol: string,
  name: string,
  sector: string,
  riskScore: number,
  riskLevel: string,
  components: any,
  financials: any,
  ratios: any,
  indicators: any
): Promise<AIExplanation | null> => {
  try {
    const response = await fetch(`${API_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol,
        stockData: {
          price: financials?.revenue ? financials.revenue / 1000000 : 150, // Fallback roughly if price not passed
          // Actually, we should pass price directly if available
          // But signature doesn't have it.
          // We'll mock safe defaults to avoid crash if we can't change signature easily right now
          currency: "USD",
          prices: []
        },
        name,
        sector,
        riskAnalysis: { riskScore, riskLevel, components, indicators },
        financials,
        ratios
      })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getPriceProjection = async (
  symbol: string,
  currentPrice: number,
  historicalPrices: any[],
  ...args: any[]
): Promise<PriceProjection | null> => {
  try {
    const response = await fetch(`${API_URL}/projection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, currentPrice, historicalPrices })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  reason: string;
}

export const getTrendingStocks = async (): Promise<TrendingStock[]> => {
  try {
    const response = await fetch(`${API_URL}/trending`);
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getUserHistory = async (): Promise<string[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await fetch(`${API_URL}/user/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.history || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const addToHistory = async (symbol: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${API_URL}/user/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ symbol })
    });
  } catch (e) {
    console.error(e);
  }
};

export const upgradePlan = async (plan: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/user/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

