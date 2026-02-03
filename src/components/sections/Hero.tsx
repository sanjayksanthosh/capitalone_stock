import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">CapitalCare AI</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
            >
              Know the Truth <br />
              <span className="text-muted-foreground">Behind Every Company</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
            >
              AI driven financial analysis and predictive risk detection for informed investing.
              Stop guessing, start knowing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/signup">
                <Button
                  size="xl"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-lg font-semibold h-14"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/analysis">
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-full px-8 text-lg h-14 border-border/50 hover:bg-secondary/50"
                >
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="card-premium p-6 rounded-3xl border border-white/10 backdrop-blur-xl relative z-10">
              {/* Fake Header */}
              <div className="flex items-center justify-between mb-8 opacity-50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="h-2 w-24 bg-white/10 rounded-full" />
              </div>

              {/* Chart Area */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-2 space-y-4">
                  <div className="h-4 w-32 bg-white/10 rounded-full" />
                  <div className="h-[180px] w-full bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-white/5 relative overflow-hidden">
                    {/* Fake Line Chart */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,80 C20,70 40,90 60,40 S80,20 100,10" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                      <path d="M0,80 C20,70 40,90 60,40 S80,20 100,10 L100,100 L0,100 Z" fill="url(#gradient)" opacity="0.2" />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="aspect-square rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                    <span className="text-3xl font-bold text-white">8.7</span>
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46%" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="100 200" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-card border border-white/10 shadow-xl z-20 w-48"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                  <div className="font-bold text-white">Low (12%)</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
