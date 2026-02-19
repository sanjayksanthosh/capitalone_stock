import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/sections/Pricing";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-20"> {/* Added padding to avoid header overlap */}
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;
