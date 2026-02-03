import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProLockProps {
    title: string;
    description: string;
}

const ProLock = ({ title, description }: ProLockProps) => {
    const navigate = useNavigate();

    return (
        <Card className="relative overflow-hidden border border-primary/20 bg-secondary/10">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-2 max-w-sm">
                    <h3 className="text-xl font-serif font-semibold text-foreground flex items-center justify-center gap-2">
                        <Crown className="w-5 h-5 text-accent" />
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <Button
                    variant="hero"
                    onClick={() => navigate('/#pricing')}
                    className="mt-4"
                >
                    Upgrade to Pro
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProLock;
