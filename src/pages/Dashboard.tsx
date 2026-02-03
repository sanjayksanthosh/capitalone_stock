import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { getTrendingStocks, getUserHistory, TrendingStock } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Dashboard = () => {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState<string[]>([]);
    const [trending, setTrending] = useState<TrendingStock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in (double check, though Header handles access usually)
        if (!authLoading && !user) navigate("/login");

        const fetchData = async () => {
            setLoading(true);
            try {
                const [historyData, trendingData] = await Promise.all([
                    getUserHistory(),
                    getTrendingStocks()
                ]);
                setHistory(historyData);
                setTrending(trendingData);
            } catch (e) {
                console.error("Dashboard fetch error", e);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, authLoading, navigate]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-foreground">
                                Welcome back, <span className="text-gradient-hero">{user?.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Here is your personal market overview.
                            </p>
                        </div>
                        <Card className="bg-secondary/30 border-primary/20 p-4 flex items-center gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Plan</p>
                                <p className="text-lg font-bold text-foreground capitalize flex items-center gap-2">
                                    {(user?.plan || 'Free')} Plan
                                    {user?.plan === 'pro' && <Sparkles className="w-4 h-4 text-accent" />}
                                </p>
                            </div>
                            {(!user?.plan || user?.plan === 'free') && (
                                <Button size="sm" variant="hero" onClick={() => navigate('/#pricing')}>
                                    Upgrade
                                </Button>
                            )}
                        </Card>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Col: History */}
                        <motion.section
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1 space-y-6"
                        >
                            <Card variant="elevated" className="h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Recent Analysis
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {history.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            No recent searches.
                                            <br />
                                            <Link to="/analysis" className="text-primary hover:underline mt-2 inline-block">Start analyzing</Link>
                                        </div>
                                    ) : (
                                        <ul className="space-y-3">
                                            {history.map((symbol, i) => (
                                                <li key={i}>
                                                    <Link to="/analysis" state={{ symbol }} className="block group">
                                                        <div className="p-3 rounded-lg bg-secondary/30 group-hover:bg-secondary transition-colors flex items-center justify-between">
                                                            <span className="font-bold text-foreground">{symbol}</span>
                                                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/analysis')}>
                                        New Analysis
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Right Col: AI Trending */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <Card variant="premium" className="h-full border-primary/20 bg-gradient-to-br from-card to-secondary/10">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                                        AI Market Pulse
                                    </div>
                                    <p className="text-xs text-muted-foreground">Generated by Gemini • Live Insights</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {trending.map((stock) => (
                                            <Link key={stock.symbol} to="/analysis" state={{ symbol: stock.symbol }} className="block group">
                                                <div className="p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-all hover:shadow-lg group-hover:-translate-y-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-foreground">{stock.symbol}</h3>
                                                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-mono text-foreground">${stock.price}</div>
                                                            <div className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-white/5">
                                                        <p className="text-sm text-muted-foreground italic leading-snug">
                                                            "{stock.reason}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
