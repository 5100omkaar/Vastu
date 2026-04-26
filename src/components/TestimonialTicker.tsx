const testimonials = [
  { text: "Saved ₹30,000 — got detailed insights in under a minute", author: "Rajesh K." },
  { text: "I recommend this to every client. Absolute game-changer!", author: "Priya S." },
  { text: "Analyzed 150+ properties — accuracy is remarkable", author: "Amit P." },
  { text: "Finally got Vastu analysis in my language. Brilliant!", author: "Sunita M." },
  { text: "Better than any consultant I've worked with. And it's free!", author: "Vikram R." },
  { text: "Instant results vs weeks of waiting. No comparison.", author: "Meera J." },
];

const TestimonialTicker = () => {
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="bg-card border-b border-border overflow-hidden py-3">
      <div className="animate-ticker flex whitespace-nowrap">
        {doubled.map((t, i) => (
          <div key={i} className="inline-flex items-center gap-2 mx-8 shrink-0">
            <div className="flex text-primary text-xs">★★★★★</div>
            <span className="text-sm text-muted-foreground">
              "{t.text}" — <span className="font-semibold text-foreground">{t.author}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialTicker;
