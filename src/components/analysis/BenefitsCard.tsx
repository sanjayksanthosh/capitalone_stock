import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Loader2, CheckCircle2, BarChart3, PieChart, Coins, Target } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AIExplanation } from "@/services/api";

interface BenefitsCardProps {
    explanation: AIExplanation | null;
    isLoading: boolean;
}

const BenefitsCard = ({ explanation, isLoading }: BenefitsCardProps) => {
    if (!explanation && !isLoading) return null;

    return (
        <Card className="border-green-500/20 bg-green-500/5 mt-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-foreground font-sans flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Benefits of Buying
                    </h4>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        <span className="ml-2 text-muted-foreground">Analyzing upside potential...</span>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Structured Metrics Grid */}
                        {explanation?.benefits_data && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-background/40 p-3 rounded-lg border border-green-500/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BarChart3 className="w-4 h-4 text-green-400" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Yearly Growth</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{explanation.benefits_data.growth_percentage}</p>
                                </div>

                                <div className="bg-background/40 p-3 rounded-lg border border-green-500/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <PieChart className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">P/E Valuation</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{explanation.benefits_data.pe_valuation}</p>
                                </div>

                                <div className="bg-background/40 p-3 rounded-lg border border-green-500/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Coins className="w-4 h-4 text-yellow-400" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">5Y Dividend</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{explanation.benefits_data.dividend_5y}</p>
                                </div>

                                <div className="bg-background/40 p-3 rounded-lg border border-green-500/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target className="w-4 h-4 text-purple-400" />
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Future Plans</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{explanation.benefits_data.future_plans}</p>
                                </div>
                            </div>
                        )}

                        {/* General Benefits List */}
                        {explanation?.benefits && explanation.benefits.length > 0 ? (
                            <div className="pt-2">
                                <h5 className="text-sm font-medium text-muted-foreground mb-3">Key Strengths</h5>
                                <ul className="space-y-3">
                                    {explanation.benefits.map((benefit, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-foreground/90 text-sm leading-relaxed">{benefit}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        <div className="mt-4 pt-4 border-t border-green-500/10 flex items-center gap-2 text-xs text-green-500/80">
                            <Sparkles className="w-3 h-3" />
                            <span>AI-Generated Upside Analysis</span>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
};

export default BenefitsCard;
