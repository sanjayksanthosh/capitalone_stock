import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

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

interface PriceProjectionChartProps {
  projection: PriceProjection;
  symbol: string;
  currentPrice: number;
}

const PriceProjectionChart = ({ projection, symbol, currentPrice }: PriceProjectionChartProps) => {
  // Prepare chart data
  // Prepare chart data with safe checks
  const currentYear = new Date().getFullYear();
  const baseScenarios = projection?.scenarios?.base || [];
  const conservativeScenarios = projection?.scenarios?.conservative || [];
  const optimisticScenarios = projection?.scenarios?.optimistic || [];

  // Safety defaults for missing backend data
  const methodology = projection?.methodology || {
    priceCAGR: 0,
    revenueCAGR: 0,
    profitCAGR: 0,
    roeStability: 0,
    fcfTrend: 0,
    fsm: 0,
    adjustedTrend: 0
  };
  const modelType = projection?.model_type || "AI Projection";
  const confidenceLevel = projection?.confidence_level || "Medium";
  const explanation = projection?.explanation || "No explanation provided.";
  const importantNote = projection?.important_note || "Projections are based on historical trends.";
  const disclaimer = projection?.disclaimer || "Investment involves risk.";

  const chartData = [
    {
      year: `${currentYear} (Now)`,
      conservative: currentPrice,
      base: currentPrice,
      optimistic: currentPrice,
    },
    ...baseScenarios.map((_, index) => ({
      year: `${currentYear + index + 1}`,
      conservative: conservativeScenarios[index] || currentPrice,
      base: baseScenarios[index] || currentPrice,
      optimistic: optimisticScenarios[index] || currentPrice,
    })),
  ];

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  // Calculate growth percentages for display
  // Calculate growth percentages for display
  const finalBasePrice = baseScenarios[4] || currentPrice;
  const finalConservativePrice = conservativeScenarios[4] || currentPrice;
  const finalOptimisticPrice = optimisticScenarios[4] || currentPrice;

  const baseGrowth = ((finalBasePrice / currentPrice - 1) * 100).toFixed(1);
  const conservativeGrowth = ((finalConservativePrice / currentPrice - 1) * 100).toFixed(1);
  const optimisticGrowth = ((finalOptimisticPrice / currentPrice - 1) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="premium" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground font-sans">
                5-Year Scenario Illustration
              </h4>
              <Badge variant="secondary" className="text-xs">
                Educational Only
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {confidenceLevel} Confidence
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {modelType} based on historical data and fundamentals
          </p>
        </CardHeader>
        <CardContent>
          {/* Chart */}
          <div className="h-[300px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--risk-low))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--risk-low))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conservativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--risk-moderate))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--risk-moderate))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="year"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={formatPrice}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatPrice(value),
                    name.charAt(0).toUpperCase() + name.slice(1) + ' Scenario'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>
                      {value.charAt(0).toUpperCase() + value.slice(1)} Scenario
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stroke="transparent"
                  fill="url(#optimisticGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="optimistic"
                  stroke="hsl(var(--risk-low))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--risk-low))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="base"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="conservative"
                  stroke="hsl(var(--risk-moderate))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--risk-moderate))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-risk-moderate/10 border border-risk-moderate/20">
              <p className="text-xs text-muted-foreground mb-1">Conservative (Year 5)</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(finalConservativePrice)}</p>
              <p className={`text-sm ${Number(conservativeGrowth) >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>
                {Number(conservativeGrowth) >= 0 ? '+' : ''}{conservativeGrowth}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Base Scenario (Year 5)</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(finalBasePrice)}</p>
              <p className={`text-sm ${Number(baseGrowth) >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>
                {Number(baseGrowth) >= 0 ? '+' : ''}{baseGrowth}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-risk-low/10 border border-risk-low/20">
              <p className="text-xs text-muted-foreground mb-1">Optimistic (Year 5)</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(finalOptimisticPrice)}</p>
              <p className={`text-sm ${Number(optimisticGrowth) >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>
                {Number(optimisticGrowth) >= 0 ? '+' : ''}{optimisticGrowth}%
              </p>
            </div>
          </div>

          {/* Methodology Summary */}
          <div className="p-4 bg-secondary/30 rounded-xl mb-6">
            <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Methodology Summary
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Price CAGR (Historical)</p>
                <p className="font-medium text-foreground">{methodology.priceCAGR}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue CAGR</p>
                <p className="font-medium text-foreground">{methodology.revenueCAGR}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fundamental Multiplier</p>
                <p className="font-medium text-foreground">{methodology.fsm}x</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adjusted Trend</p>
                <p className="font-medium text-foreground">{methodology.adjustedTrend}%</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-foreground mb-2">Understanding This Analysis</h5>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl mb-4">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{importantNote}</span>
            </p>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-risk-high/10 border border-risk-high/20 rounded-xl">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-risk-high flex-shrink-0 mt-0.5" />
              <span>{disclaimer}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PriceProjectionChart;
