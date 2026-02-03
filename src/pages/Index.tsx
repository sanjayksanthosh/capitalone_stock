import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import CompanyAnalysis from "@/components/sections/CompanyAnalysis";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CompanyAnalysis />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
