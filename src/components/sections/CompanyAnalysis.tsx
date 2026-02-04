import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, AlertTriangle, ChevronRight, Building2, Info, Sparkles, Loader2, ExternalLink, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RiskScoreGauge from "@/components/analysis/RiskScoreGauge";
import RiskBreakdown from "@/components/analysis/RiskBreakdown";
import StockPriceChart from "@/components/analysis/StockPriceChart";
import PriceProjectionChart from "@/components/analysis/PriceProjectionChart";
import { useCompanyAnalysis } from "@/hooks/useCompanyAnalysis";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { addToHistory } from "@/services/api";
import AIExplanationCard from "@/components/analysis/AIExplanationCard";
import BenefitsCard from "@/components/analysis/BenefitsCard";
import ProLock from "@/components/common/ProLock";

const CompanyAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const loadingTexts = ["Reading market data...", "Analyzing financials...", "Calculating risk score...", "Forecasting trends..."];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    company,
    riskAnalysis,
    aiExplanation,
    priceProjection,
    isLoading,
    isLoadingAI,
    isLoadingProjection,
    error,
    analyzeCompany,
    generateExplanation,
    generateProjection,
  } = useCompanyAnalysis();

  const isPro = user?.plan === 'pro';

  const handleSearch = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please create an account or sign in to analyze stocks.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!searchQuery.trim()) return;
    await analyzeCompany(searchQuery.trim());
    addToHistory(searchQuery.trim());
  };

  const handleCompetitorClick = async (symbol: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please create an account or sign in to analyze stocks.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setSearchQuery(symbol);
    await analyzeCompany(symbol);
    addToHistory(symbol);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Low":
        return <Badge variant="riskLow">Low Risk</Badge>;
      case "Moderate":
        return <Badge variant="riskModerate">Moderate Risk</Badge>;
      case "High":
        return <Badge variant="riskHigh">High Risk</Badge>;
      default:
        return null;
    }
  };

  // Derive strengths and concerns from the analysis
  const getStrengthsAndConcerns = () => {
    if (!riskAnalysis || !company) return { strengths: [], concerns: [] };

    const strengths: string[] = [];
    const concerns: string[] = [];

    // Profitability
    if (riskAnalysis.components.profitability.score >= 70) {
      strengths.push(`Strong profitability (${(company.ratios.netMargin * 100).toFixed(1)}% net margin)`);
    } else if (riskAnalysis.components.profitability.score < 50) {
      concerns.push(`Profitability may need attention (${(company.ratios.netMargin * 100).toFixed(1)}% net margin)`);
    }

    // Liquidity
    if (riskAnalysis.components.liquidity.score >= 70) {
      strengths.push(`Good liquidity position (${company.ratios.currentRatio.toFixed(2)} current ratio)`);
    } else if (riskAnalysis.components.liquidity.score < 50) {
      concerns.push(`Liquidity position requires monitoring (${company.ratios.currentRatio.toFixed(2)} current ratio)`);
    }

    // Solvency
    if (riskAnalysis.components.solvency.score >= 70) {
      strengths.push(`Conservative debt levels (${company.ratios.debtToEquity.toFixed(2)} D/E)`);
    } else if (riskAnalysis.components.solvency.score < 50) {
      concerns.push(`Higher debt levels (${company.ratios.debtToEquity.toFixed(2)} D/E ratio)`);
    }

    // Efficiency
    if (riskAnalysis.components.efficiency.score >= 70) {
      strengths.push(`Efficient asset utilization (${(company.ratios.returnOnAssets * 100).toFixed(1)}% ROA)`);
    } else if (riskAnalysis.components.efficiency.score < 50) {
      concerns.push(`Asset efficiency could improve (${(company.ratios.returnOnAssets * 100).toFixed(1)}% ROA)`);
    }

    // Growth
    if (company.growth.revenueGrowthYoY > 0.10) {
      strengths.push(`Revenue growth of ${(company.growth.revenueGrowthYoY * 100).toFixed(1)}% YoY`);
    } else if (company.growth.revenueGrowthYoY < 0) {
      concerns.push(`Revenue decline of ${(company.growth.revenueGrowthYoY * 100).toFixed(1)}% YoY`);
    }

    // Cash position
    if (company.financials.cashAndEquivalents > company.financials.totalDebt * 0.5) {
      strengths.push("Strong cash reserves relative to debt");
    }

    // Free cash flow
    if (company.financials.freeCashFlow < 0) {
      concerns.push("Negative free cash flow");
    } else if (company.financials.freeCashFlow > company.financials.revenue * 0.1) {
      strengths.push("Healthy free cash flow generation");
    }

    return { strengths: strengths.slice(0, 4), concerns: concerns.slice(0, 4) };
  };

  const { strengths, concerns } = getStrengthsAndConcerns();

  return (
    <section id="analysis" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-6"
          >
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Company Analysis</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-6"
          >
            Explore Any{" "}
            <span className="text-gradient-hero">US Stock</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Search for any stock to get AI-powered risk analysis. Try AAPL, MSFT, TSLA, GOOGL, AMZN, or NVDA.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-3 max-w-xl mx-auto"
          >
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button variant="hero" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </motion.div>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-accent animate-pulse" />
              </div>
              <p className="text-muted-foreground animate-pulse">Gathering real-time market data...</p>
            </motion.div>
          )}
        </div>

        {/* Analysis Results */}
        <AnimatePresence mode="wait">
          {company && riskAnalysis && (
            <motion.div
              key={company.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              {/* Company Header */}
              <Card variant="elevated" className="mb-6">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center">
                        <span className="font-serif font-bold text-xl text-primary-foreground">
                          {company.symbol[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-serif font-semibold text-foreground">
                            {company.name}
                          </h3>
                          {getRiskBadge(riskAnalysis.riskLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {company.symbol} • {company.exchange} • {company.sector}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {company.price > 0 && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">
                            ${company.price.toFixed(2)}
                          </p>
                          <p className={`text-sm font-medium ${(company.changes || 0) >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>
                            {(company.changes || 0) >= 0 ? '+' : ''}{(company.changes || 0).toFixed(2)}
                            ({(company.changesPercentage || 0) >= 0 ? '+' : ''}{(company.changesPercentage || 0).toFixed(2)}%)
                          </p>
                        </div>
                      )}
                      <RiskScoreGauge score={riskAnalysis.riskScore} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{company.description}</p>

                  {/* Key Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                      <p className="text-sm font-semibold text-foreground">
                        ${(company.marketCap / 1e12).toFixed(2)}T
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">P/E Ratio</p>
                      <p className="text-sm font-semibold text-foreground">
                        {company.ratios.peRatio > 0 ? company.ratios.peRatio.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">52W Range</p>
                      <p className="text-sm font-semibold text-foreground">
                        {company.historicalPrices && company.historicalPrices.length > 0
                          ? `$${Math.min(...company.historicalPrices.slice(0, 252).map(p => p.close)).toFixed(0)} - $${Math.max(...company.historicalPrices.slice(0, 252).map(p => p.close)).toFixed(0)}`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Employees</p>
                      <p className="text-sm font-semibold text-foreground">
                        {company.employees > 0 ? company.employees.toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {company.chartUrl && (
                    <a
                      href={company.chartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View on TradingView <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Stock Price Chart */}
              {company.historicalPrices && company.historicalPrices.length > 0 && (
                <StockPriceChart
                  symbol={company.symbol}
                  companyName={company.name}
                  currentPrice={company.price}
                  priceChange={company.changes || 0}
                  historicalPrices={company.historicalPrices}
                />
              )}

              {/* Risk Breakdown */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {isPro ? (
                  <Card variant="premium">
                    <CardHeader>
                      <h4 className="text-lg font-semibold text-foreground font-sans flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-risk-low" />
                        Risk Score Breakdown
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <RiskBreakdown
                        metrics={{
                          profitability: riskAnalysis.components.profitability.score,
                          liquidity: riskAnalysis.components.liquidity.score,
                          solvency: riskAnalysis.components.solvency.score,
                          efficiency: riskAnalysis.components.efficiency.score,
                          growth: riskAnalysis.components.growth.score,
                        }}
                      />
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Capital Safety</span>
                        </div>
                        <p className="text-sm text-foreground">{riskAnalysis.indicators.capitalSafety}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ProLock
                    title="Risk Score Breakdown"
                    description="Upgrade to Pro to see detailed gauges for Profitability, Liquidity, Solvency, and Efficiency."
                  />
                )}

                <div className="space-y-6">
                  {/* Strengths */}
                  <Card variant="premium">
                    <CardHeader className="pb-3">
                      <h4 className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-risk-low" />
                        Potential Strengths
                      </h4>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {strengths.length > 0 ? strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-risk-low flex-shrink-0 mt-0.5" />
                            {strength}
                          </li>
                        )) : (
                          <li className="text-sm text-muted-foreground">No significant strengths detected.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Concerns */}
                  <Card variant="premium">
                    <CardHeader className="pb-3">
                      <h4 className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-risk-moderate" />
                        Potential Concerns
                      </h4>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {concerns.length > 0 ? concerns.map((concern, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-risk-moderate flex-shrink-0 mt-0.5" />
                            {concern}
                          </li>
                        )) : (
                          <li className="text-sm text-muted-foreground">No major concerns identified.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* AI Explanation */}
              <AIExplanationCard
                explanation={aiExplanation}
                isLoading={isLoadingAI}
                onGenerate={generateExplanation}
                isPro={isPro}
              />

              {/* Benefits of Buying */}
              <BenefitsCard
                explanation={aiExplanation}
                isLoading={isLoadingAI}
              />

              {/* Price Projection Section */}
              {isPro ? (
                priceProjection ? (
                  <PriceProjectionChart
                    projection={priceProjection}
                    symbol={company.symbol}
                    currentPrice={company.price}
                  />
                ) : (
                  <Card variant="premium" className="mt-6">
                    <CardContent className="py-8">
                      <div className="text-center">
                        <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          5-Year Scenario Illustration
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                          Generate educational scenario-based projections using historical data and fundamentals.
                          This is NOT investment advice or a prediction.
                        </p>
                        <Button
                          variant="hero"
                          onClick={generateProjection}
                          disabled={isLoadingProjection}
                        >
                          {isLoadingProjection ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Computing Scenarios...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Generate Scenario Illustration
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              ) : (
                <div className="mt-6">
                  <ProLock
                    title="Scenario Simulator"
                    description="Unlock AI-driven price scenario illustrations to visualize potential upside and downside risks over 5 years."
                  />
                </div>
              )}

              {/* Competitors */}
              {company.competitors && company.competitors.length > 0 && (
                <Card variant="premium" className="mt-6">
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-foreground font-sans">Compare Competitors</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {company.competitors.map((symbol) => (
                        <Button
                          key={symbol}
                          variant="calm"
                          size="sm"
                          onClick={() => handleCompetitorClick(symbol)}
                          disabled={isLoading}
                        >
                          {symbol}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-risk-moderate/10 border border-risk-moderate/20 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-risk-moderate flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {riskAnalysis.disclaimer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && !company && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              {error}. Try AAPL, MSFT, TSLA, GOOGL, AMZN, or NVDA.
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!company && !error && searchQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Enter a stock symbol and click "Analyze" to see the risk breakdown.
            </p>
          </motion.div>
        )}
      </div>
    </section >
  );
};

export default CompanyAnalysis;
