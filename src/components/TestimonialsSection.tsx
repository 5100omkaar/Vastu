import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./AnimatedSection";

const testimonials = [
  { quote: "Was about to spend ₹25,000 on a Vastu consultant. Got the same insights in 30 seconds for free. The AI even caught issues my previous consultant missed.", name: "Rajesh Kumar", role: "Homeowner • Mumbai", initial: "R" },
  { quote: "I use this for every client project now. Saves me hours of manual analysis and my clients love the detailed reports. Complete game-changer for my practice.", name: "Priya Sharma", role: "Interior Designer • Bangalore", initial: "P" },
  { quote: "We've analyzed 200+ properties with VastuVista. The accuracy matches what our in-house expert recommends, at a fraction of the cost and time.", name: "Amit Patel", role: "Real Estate Developer • Delhi", initial: "A" },
  { quote: "Finding a Vastu expert who speaks Tamil was impossible in my area. This AI supports my language and gave me exactly what I needed. Brilliant!", name: "Sunita Menon", role: "Homeowner • Chennai", initial: "S" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Trusted by 10,000+ homeowners across India
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            See why people are switching from traditional consultants to AI
          </p>
        </AnimatedSection>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={staggerItem} className="p-6 rounded-xl border border-border bg-card">
              <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
