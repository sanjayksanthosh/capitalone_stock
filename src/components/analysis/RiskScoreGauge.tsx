import { motion } from "framer-motion";

interface RiskScoreGaugeProps {
  score: number;
}

const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-risk-low";
    if (score >= 40) return "text-risk-moderate";
    return "text-risk-high";
  };

  const getLabel = (score: number) => {
    if (score >= 70) return "Lower Risk";
    if (score >= 40) return "Moderate Risk";
    return "Higher Risk";
  };

  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-secondary"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
              <stop offset="50%" stopColor="hsl(222, 70%, 45%)" />
              <stop offset="100%" stopColor="hsl(43, 96%, 56%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`text-2xl font-bold font-sans ${getScoreColor(score)}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
        </div>
      </div>
      <span className={`mt-2 text-xs font-medium ${getScoreColor(score)}`}>
        {getLabel(score)}
      </span>
    </div>
  );
};

export default RiskScoreGauge;
