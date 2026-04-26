import { Scan, Compass, Flame, Wrench, Languages, FileBarChart } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./AnimatedSection";

const features = [
  { icon: Scan, title: "AI Room Detection", description: "Automatically identifies rooms, doors & windows from your floor plan" },
  { icon: Compass, title: "Directional Mapping", description: "Maps every room to compass directions for precise Vastu scoring" },
  { icon: Flame, title: "Five Elements Balance", description: "Analyzes Fire, Water, Earth, Air & Space harmony in your space" },
  { icon: Wrench, title: "Smart Remedies", description: "Actionable fixes prioritized by impact and ease of implementation" },
  { icon: Languages, title: "10 Language Support", description: "Get analysis in English, Hindi, Tamil, Telugu, Kannada & more" },
  { icon: FileBarChart, title: "Detailed Reports", description: "Comprehensive digital reports with scores, charts & recommendations" },
];

const FeaturesGrid = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Everything a Vastu expert does — powered by AI
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Trained on ancient Vastu texts like Mayamatam, Brihat Samhita & modern architectural principles.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
