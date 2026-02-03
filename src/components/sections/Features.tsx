import { motion } from "framer-motion";
import { 
  Search, 
  Shield, 
  TrendingDown, 
  Users, 
  Brain, 
  BarChart3,
  MessageCircle,
  Lightbulb
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Company Research",
    description: "Search any US stock and get an instant risk overview with plain-English explanations.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Financial Risk Score",
    description: "Our proprietary 0-100 score combines profitability, liquidity, solvency, and growth metrics.",
    color: "text-risk-low",
    bgColor: "bg-risk-low/10",
  },
  {
    icon: TrendingDown,
    title: "Downside Analysis",
    description: "Understand what could go wrong and why — without the hype or fear-mongering.",
    color: "text-risk-moderate",
    bgColor: "bg-risk-moderate/10",
  },
  {
    icon: Users,
    title: "Competitor Comparison",
    description: "See how a company's risk profile compares to its industry peers and competitors.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Our AI explains complex financial data in clear, jargon-free language anyone can understand.",
    color: "text-risk-low",
    bgColor: "bg-risk-low/10",
  },
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "TradingView-powered charts for 1Y and 5Y price history with clean, minimal interface.",
    color: "text-risk-moderate",
    bgColor: "bg-risk-moderate/10",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-6"
          >
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">How It Works</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-6"
          >
            Risk Analysis That{" "}
            <span className="text-gradient-hero">Makes Sense</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            No complex jargon. No confusing metrics. Just clear explanations of what you need to know before investing.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="premium" className="h-full hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <Card variant="elevated" className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground font-sans">
                How We Calculate Risk Scores
              </h3>
            </div>
            <div className="grid sm:grid-cols-5 gap-6 text-center">
              {[
                { weight: "30%", label: "Profitability", desc: "Earnings consistency" },
                { weight: "25%", label: "Liquidity", desc: "Cash position" },
                { weight: "20%", label: "Solvency", desc: "Debt management" },
                { weight: "15%", label: "Efficiency", desc: "Vs. industry peers" },
                { weight: "10%", label: "Growth", desc: "Revenue stability" },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="text-2xl font-bold text-gradient-score mb-1">{item.weight}</div>
                  <div className="text-sm font-medium text-foreground mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground text-center border-t border-border pt-6">
              Scores include bonuses for consistency and stability, with penalties for red flags like high debt volatility or sudden revenue drops.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
