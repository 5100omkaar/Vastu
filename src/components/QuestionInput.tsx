import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const suggestions = [
  "What is Vastu Shastra?",
  "Best direction for kitchen?",
  "How to improve home energy?",
];

const QuestionInput = () => {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleAsk = () => {
    if (!question.trim()) return;
    // Pass question to AI assistant via URL param
    navigate("/assistant?q=" + encodeURIComponent(question.trim()));
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <MessageCircle className="h-4 w-4" />
        <span>Have a question about Vastu? Ask without uploading.</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about Vastu Shastra..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button
          onClick={handleAsk}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Ask
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setQuestion(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionInput;
