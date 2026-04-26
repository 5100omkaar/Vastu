import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, BarChart3, MessageSquare, X, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Floor Plan",
    description: "Simply drag & drop or select your floor plan image. We support all common image formats.",
  },
  {
    icon: BarChart3,
    title: "Get Instant Analysis",
    description: "Our AI analyzes your floor plan for Vastu compliance and gives you a detailed score with room-by-room breakdown.",
  },
  {
    icon: MessageSquare,
    title: "Ask the AI Assistant",
    description: "Have questions about Vastu? Chat with our AI assistant for personalized guidance and image generation.",
  },
];

const OnboardingModal = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("vastuvista_onboarded");
    if (!seen) setShow(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("vastuvista_onboarded", "true");
    setShow(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-foreground/50 flex items-center justify-center px-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl border border-border p-8 max-w-md w-full relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {current.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">{current.description}</p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step ? "w-6 bg-primary" : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {step < steps.length - 1 ? "Next" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
