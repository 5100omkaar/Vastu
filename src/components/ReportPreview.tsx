import { Check, AlertTriangle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const scores = [
  { label: "Entrance", score: "9/10", status: "Excellent", good: true },
  { label: "Kitchen", score: "8/10", status: "Good", good: true },
  { label: "Bedroom", score: "6/10", status: "Needs fix", good: false },
  { label: "Elements", score: "4/5", status: "Good", good: true },
];

const ReportPreview = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            See what you get — in 30 seconds
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            A preview of your comprehensive Vastu analysis report
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-md mx-auto bg-background rounded-2xl border border-border p-6 shadow-lg">
            <div className="text-xs text-muted-foreground mb-4">vastuvista.com/report</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">Overall Vastu Score</h3>
            <div className="flex items-end gap-3 mb-1">
              <span className="font-display text-5xl font-bold text-primary">72</span>
              <span className="text-2xl text-muted-foreground font-display">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Good — Minor adjustments recommended</p>
            <div className="w-full h-2.5 rounded-full bg-secondary mb-8">
              <div className="h-2.5 rounded-full bg-primary" style={{ width: "72%" }} />
            </div>
            <div className="space-y-3">
              {scores.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{s.score}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${s.good ? "text-good" : "text-primary"}`}>
                      {s.good ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              Upload to see your full report →
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ReportPreview;
