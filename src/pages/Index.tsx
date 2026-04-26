import Navbar from "@/components/Navbar";
import TestimonialTicker from "@/components/TestimonialTicker";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import ComparisonSection from "@/components/ComparisonSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReportPreview from "@/components/ReportPreview";
import CTASection from "@/components/CTASection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VastuVista",
  applicationCategory: "LifestyleApplication",
  description: "AI-powered Vastu Shastra analysis for floor plans. Upload your floor plan and get instant analysis in 30 seconds.",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="VastuVista — AI-Powered Vastu Analysis in 30 Seconds"
        description="Upload your floor plan and get instant Vastu Shastra analysis powered by AI. Save thousands compared to traditional consultants."
        path="/"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <TestimonialTicker />
      <HeroSection />
      <StatsBar />
      <ComparisonSection />
      <FeaturesGrid />
      <TestimonialsSection />
      <ReportPreview />
      <CTASection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
