import { motion } from "framer-motion";

interface RiskBreakdownProps {
  metrics: {
    profitability: number;
    liquidity: number;
    solvency: number;
    efficiency: number;
    growth: number;
  };
}

const RiskBreakdown = ({ metrics }: RiskBreakdownProps) => {
  const items = [
    { label: "Profitability", value: metrics.profitability, weight: "30%", desc: "Earnings consistency & margins" },
    { label: "Liquidity", value: metrics.liquidity, weight: "25%", desc: "Cash position & short-term health" },
    { label: "Solvency", value: metrics.solvency, weight: "20%", desc: "Debt management & long-term stability" },
    { label: "Efficiency", value: metrics.efficiency, weight: "15%", desc: "Performance vs industry peers" },
    { label: "Growth", value: metrics.growth, weight: "10%", desc: "Revenue & earnings stability" },
  ];

  const getBarColor = (value: number) => {
    if (value >= 70) return "bg-risk-low";
    if (value >= 40) return "bg-risk-moderate";
    return "bg-risk-high";
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground">({item.weight})</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getBarColor(item.value)}`}
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default RiskBreakdown;
