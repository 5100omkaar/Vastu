import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UploadAreaProps {
  onAnalyze?: (file: File, question?: string) => void;
  analyzing?: boolean;
}

const UploadArea = ({ onAnalyze, analyzing }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload PNG, JPG or PDF", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB", variant: "destructive" });
      return;
    }
    setFileName(file.name);
    setSelectedFile(file);
    if (!onAnalyze) {
      toast({ title: "Floor plan uploaded!", description: `${file.name} is ready for analysis.` });
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile && onAnalyze) {
      onAnalyze(selectedFile, question || undefined);
    } else if (selectedFile && !onAnalyze) {
      // Homepage — redirect to dashboard to login and analyze
      toast({ title: "Sign in required", description: "Please sign in to analyze your floor plan." });
      navigate("/login");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative max-w-2xl mx-auto border-2 border-dashed rounded-xl p-10 transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold text-foreground text-lg">
            {fileName ? fileName : "Drag & drop your floor plan"}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary font-medium">click to upload</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">PNG</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">JPG</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">PDF</span>
            <span>• Max 5MB</span>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="max-w-2xl mx-auto space-y-3">
          {onAnalyze && (
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Any specific Vastu question? (optional)"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <button
            onClick={handleAnalyzeClick}
            disabled={analyzing}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              "Analyze Floor Plan"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
