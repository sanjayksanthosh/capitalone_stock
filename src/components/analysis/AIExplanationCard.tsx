import { motion } from "framer-motion";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AIExplanation } from "@/services/api";
import ReactMarkdown from "react-markdown";

interface AIExplanationCardProps {
  explanation: AIExplanation | null;
  isLoading: boolean;
  onGenerate: () => void;
  isPro: boolean;
}

const AIExplanationCard = ({ explanation, isLoading, onGenerate, isPro }: AIExplanationCardProps) => {
  return (
    <Card variant="premium" className="border-primary/20 mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground font-sans flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Risk Pharmacist
          </h4>
        </div>
      </CardHeader>
      <CardContent>
        {!explanation && !isLoading ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-4">
              Get a detailed, plain-English explanation of this company's risk profile.
            </p>
            <Button variant="hero" size="sm" onClick={onGenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Explanation
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Generating AI explanation...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Summary Section - Visible to All */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h5 className="font-semibold text-foreground mb-1">Summary</h5>
              <p className="text-muted-foreground">{explanation?.summary}</p>
            </div>

            {/* Deep Dive Section - Gated */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Deep Dive Details
                {!isPro && <Lock className="w-3 h-3 text-muted-foreground" />}
              </h5>

              {isPro ? (
                <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
                  <ReactMarkdown>{explanation?.details || ""}</ReactMarkdown>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg bg-secondary/10 border border-white/5 p-6 text-center">
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50 flex items-center justify-center z-10">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                      Upgrade to Unlock Details
                    </Button>
                  </div>
                  <div className="opacity-30 blur-sm select-none pointer-events-none" aria-hidden="true">
                    <p>Detailed analysis of balance sheet ratios involves...</p>
                    <p>Market sentiment suggests a bullish trend but caution is advised due to...</p>
                    <p>Competitive landscape evaluation shows leading position but appearing cracks in...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={onGenerate} className="text-xs text-muted-foreground hover:text-foreground">
                <Sparkles className="w-3 h-3 mr-2" />
                Regenerate
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIExplanationCard;
