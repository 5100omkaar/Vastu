import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./AnimatedSection";

const stats = [
  { value: "10,000+", label: "Blueprints Analyzed" },
  { value: "₹2Cr+", label: "Saved vs Consultants" },
  { value: "30s", label: "Avg Analysis Time" },
  { value: "4.8★", label: "User Rating" },
];

const StatsBar = () => {
  return (
    <section className="border-y border-border bg-card py-10">
      <motion.div
        className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} className="text-center" variants={staggerItem}>
            <div className="font-display text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsBar;
