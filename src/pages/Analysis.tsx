import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyAnalysis from "@/components/sections/CompanyAnalysis";

const Analysis = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                <CompanyAnalysis />
            </main>
            <Footer />
        </div>
    );
};

export default Analysis;
