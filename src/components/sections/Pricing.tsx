import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, Crown, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { upgradePlan } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    id: "essential",
    name: "Essential Clarity",
    price: 6,
    description: "For $6, I avoid costly mistakes.",
    icon: Shield,
    badge: null,
    features: [
      "Core AI risk analysis",
      "Basic Risk Score (0-100)",
      "Plain-English explanations",
      "Capital safety indicator",
      "Market context (non-hype)",
      "15 analyses per day",
      "US stocks & ETFs",
      "Beginner learning modules",
      "Strong disclaimers included",
    ],
    cta: "Start Essential",
    variant: "calm" as const,
  },
  {
    id: "pro",
    name: "Pro Insight",
    price: 19,
    description: "This feels like a personal risk analyst.",
    icon: Crown,
    badge: "Most Popular",
    features: [
      "Everything in Essential, plus:",
      "Full Risk Score breakdown",
      "Scenario simulator (If-Then)",
      "Downside stress indicators",
      "Market mood tracking",
      "Saved risk profile",
      "Time-horizon optimization",
      "Sector-level risk comparison",
      "Earnings & macro sensitivity",
      "Analysis memory",
      "Unlimited analyses",
      "Priority response speed",
      "Weekly calm risk digest",
    ],
    cta: "Start Pro Trial",
    variant: "hero" as const,
  },
];

const Pricing = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (user.plan === planId) return;

    setLoadingPlan(planId);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await upgradePlan(planId);
      if (result && result.success) {
        updateUser(result.user);
        toast({
          title: "Upgrade Successful!",
          description: `You are now on the ${planId} plan.`,
        });
      } else {
        throw new Error("Upgrade failed");
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 mb-6"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Simple Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-6"
          >
            Premium Clarity,{" "}
            <span className="text-gradient-hero">Affordable Price</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            No hidden fees. No upsells. Just honest risk analysis that helps you make better decisions.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="accent" className="shadow-soft px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <Card
                variant={plan.badge ? "elevated" : "premium"}
                className={`h-full ${plan.badge ? "border-primary/30 shadow-glow" : ""}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${plan.badge ? "bg-gradient-hero" : "bg-secondary"} flex items-center justify-center`}>
                      <plan.icon className={`w-5 h-5 ${plan.badge ? "text-primary-foreground" : "text-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-foreground">{plan.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-foreground font-sans">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{plan.description}"</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.badge ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm ${i === 0 && plan.badge ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loadingPlan !== null || user?.plan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : user?.plan === plan.id ? (
                      "Current Plan"
                    ) : (
                      plan.cta
                    )}
                  </Button>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-12 max-w-xl mx-auto"
        >
          All plans include strong disclaimers. CapitalCare AI is for educational purposes only and does not provide financial advice.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
