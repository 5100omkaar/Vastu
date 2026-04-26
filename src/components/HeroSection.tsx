import { Upload, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/vastuvista-logo.png";
import UploadArea from "./UploadArea";
import QuestionInput from "./QuestionInput";

const HeroSection = () => {
  return (
    <section id="home" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.img
          src={logo}
          alt="VastuVista"
          className="h-24 w-24 mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h1
          className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Upload your floor plan.
        </motion.h1>
        <motion.h1
          className="font-display text-4xl md:text-6xl font-bold text-gradient leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get instant Vastu insights.
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Why spend ₹50,000 on a Vastu consultant and wait weeks? Get the same expert
          analysis in <span className="font-semibold text-foreground">30 seconds — free.</span>
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span>Save ₹50,000+</span>
          <span className="text-border">·</span>
          <span>30 second results</span>
          <span className="text-border">·</span>
          <span>No signup needed</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <UploadArea />
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <QuestionInput />
        </motion.div>

        {/* Steps */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <span>Upload</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span>AI Analyzes</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span>Get Report</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
