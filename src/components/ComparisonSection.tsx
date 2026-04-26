import { Check, X } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const ComparisonSection = () => {
  const rows = [
    { label: "Cost", traditional: "₹5,000 – ₹50,000", ai: "Free / ₹199" },
    { label: "Wait Time", traditional: "2–3 weeks", ai: "30 seconds" },
    { label: "Availability", traditional: "Business hours", ai: "24/7, always on" },
    { label: "Report", traditional: "Verbal / handwritten", ai: "Digital + PDF export" },
    { label: "Languages", traditional: "1–2 max", ai: "10 languages" },
    { label: "Follow-up", traditional: "Extra charges", ai: "Unlimited AI chat" },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Why pay ₹50,000 when AI does it better?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Traditional Vastu consultants charge a fortune and take weeks. Our AI delivers the same expertise — instantly.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-6 h-full">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Traditional Consultant</h3>
              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 text-bad" />
                      {row.traditional}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 relative h-full">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                RECOMMENDED
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">VastuVista AI</h3>
              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-good" />
                      {row.ai}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3}>
          <p className="text-center text-sm text-primary font-semibold mt-8">
            95%+ savings compared to traditional consultations
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ComparisonSection;
