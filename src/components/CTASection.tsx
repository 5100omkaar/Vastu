import { Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            JOIN 10,000+ HOMEOWNERS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Stop overpaying for Vastu advice
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Traditional consultants charge ₹5,000–₹50,000 for what our AI does in 30 seconds — for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-good" /> Save ₹50,000+</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-good" /> Results in 30 seconds</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-good" /> No signup needed</span>
          </div>
          <button
            onClick={scrollToTop}
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Upload Your Floor Plan →
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
