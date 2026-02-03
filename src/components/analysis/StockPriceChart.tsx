import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PricePoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface StockPriceChartProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  historicalPrices: PricePoint[];
}

type TimeFrame = "1M" | "3M" | "6M" | "1Y" | "5Y";

const timeFrameConfig: Record<TimeFrame, { days: number; label: string }> = {
  "1M": { days: 30, label: "1 Month" },
  "3M": { days: 90, label: "3 Months" },
  "6M": { days: 180, label: "6 Months" },
  "1Y": { days: 365, label: "1 Year" },
  "5Y": { days: 1825, label: "5 Years" },
};

const StockPriceChart = ({
  symbol,
  companyName,
  currentPrice,
  priceChange,
  historicalPrices,
}: StockPriceChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1Y");

  const chartData = useMemo(() => {
    if (!historicalPrices || historicalPrices.length === 0) return [];

    const daysToShow = timeFrameConfig[timeFrame].days;
    const filteredData = historicalPrices
      .slice(0, daysToShow)
      .reverse()
      .map((p) => ({
        date: p.date,
        price: p.close,
        displayDate: new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: timeFrame === "5Y" ? "2-digit" : undefined,
        }),
      }));

    return filteredData;
  }, [historicalPrices, timeFrame]);

  const priceStats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0, change: 0, changePercent: 0 };

    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const startPrice = chartData[0]?.price || 0;
    const endPrice = chartData[chartData.length - 1]?.price || 0;
    const change = endPrice - startPrice;
    const changePercent = startPrice > 0 ? (change / startPrice) * 100 : 0;

    return { min, max, change, changePercent };
  }, [chartData]);

  const isPositive = priceStats.change >= 0;
  const chartColor = isPositive ? "hsl(var(--risk-low))" : "hsl(var(--risk-high))";

  if (!historicalPrices || historicalPrices.length === 0) {
    return (
      <Card variant="premium">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Historical price data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="premium">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-lg font-semibold text-foreground font-sans">
                {symbol} Stock Price
              </h4>
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-risk-low' : 'text-risk-high'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{priceStats.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${currentPrice.toFixed(2)}
              <span className={`text-sm font-normal ml-2 ${priceChange >= 0 ? 'text-risk-low' : 'text-risk-high'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} today
              </span>
            </p>
          </div>

          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {(Object.keys(timeFrameConfig) as TimeFrame[]).map((tf) => (
              <Button
                key={tf}
                variant={timeFrame === tf ? "default" : "ghost"}
                size="sm"
                className="px-3 py-1 h-8"
                onClick={() => setTimeFrame(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          key={timeFrame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={[priceStats.min * 0.95, priceStats.max * 1.05]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: chartColor,
                  stroke: "hsl(var(--card))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{timeFrameConfig[timeFrame].label}</span>
            {" "}range: ${priceStats.min.toFixed(2)} - ${priceStats.max.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-risk-low' : 'text-risk-high'}`}>
            {isPositive ? '+' : ''}{priceStats.change.toFixed(2)} ({priceStats.changePercent.toFixed(2)}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPriceChart;
