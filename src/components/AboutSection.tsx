import { Mail } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 bg-card border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            About the Creator
          </h2>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="font-display text-2xl font-bold text-primary">VV</span>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            VastuVista was born from a simple observation: millions of people care about Vastu 
            but lack access to affordable, reliable analysis. We built this to bridge that gap — 
            combining ancient wisdom with modern AI to help people create harmonious living spaces.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We believe in building things that genuinely help people and make lives better.
          </p>
          <a
            href="mailto:hello@vastuvista.com"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 transition-opacity"
          >
            <Mail className="h-4 w-4" />
            hello@vastuvista.com
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutSection;
