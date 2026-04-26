import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, LogOut, Clock, TrendingUp } from "lucide-react";
import logo from "@/assets/vastuvista-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UploadArea from "@/components/UploadArea";
import DeleteReportDialog from "@/components/DeleteReportDialog";
import OnboardingModal from "@/components/OnboardingModal";
import SEOHead from "@/components/SEOHead";
import ThemeToggle from "@/components/ThemeToggle";

import { Report } from "@/types/report";

// Compress image to max 1024px and ~200KB before uploading
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (file.type === "application/pdf") { resolve(file); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file);
      }, "image/jpeg", 0.8);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
};

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchReports();
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", user.id)
      .single();
    if (data) {
      setAvatarUrl(data.avatar_url);
      setFullName(data.full_name || "");
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReports(data);
    setLoading(false);
  };

  const handleAnalyze = async (file: File, question?: string) => {
    if (!user) return;
    setAnalyzing(true);
    try {
      // Compress image before upload to keep edge function fast
      const compressed = await compressImage(file);
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("floor-plans")
        .upload(filePath, compressed);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("floor-plans")
        .getPublicUrl(filePath);

      const { data, error } = await supabase.functions.invoke("vastu-analyze", {
        body: { imageUrl: publicUrl, question },
      });

      if (error) {
        // Try to get the real error message from the response body
        const msg = (error as any)?.context?.json?.error || error.message;
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);

      toast({ title: "Analysis complete!", description: "Your Vastu report is ready." });
      navigate(`/report/${data.report.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error occurred";
      toast({ title: "Analysis failed", description: message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    const { error } = await supabase.from("reports").delete().eq("id", reportId);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast({ title: "Report deleted" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Dashboard — VastuVista" description="Manage your Vastu analyses and upload new floor plans." path="/dashboard" />
      <OnboardingModal />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="VastuVista" className="h-9 w-9" />
            <span className="font-display text-xl font-bold text-foreground">VastuVista</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <ThemeToggle />
            <Link
              to="/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Upload a floor plan to get instant Vastu analysis</p>

          <div className="mb-10">
            <UploadArea onAnalyze={handleAnalyze} analyzing={analyzing} />
          </div>

          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Analysis History
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-border bg-card">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No analyses yet. Upload a floor plan to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <Link to={`/report/${report.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={report.image_url}
                      alt="Floor plan"
                      className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {new Date(report.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {(report.report_data as any)?.summary?.slice(0, 80) || "Vastu analysis report"}...
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    {report.overall_score != null && (
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-lg font-bold text-foreground">{report.overall_score}</span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    )}
                    <DeleteReportDialog onConfirm={() => handleDeleteReport(report.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
