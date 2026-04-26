import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import logo from "@/assets/vastuvista-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import FloorPlan3D from "@/components/FloorPlan3D";

import { VastuReportData, Report as ReportType } from "@/types/report";

const ELEMENT_COLORS = ["hsl(25, 90%, 48%)", "hsl(200, 70%, 50%)", "hsl(145, 60%, 40%)", "hsl(45, 90%, 50%)", "hsl(270, 50%, 55%)"];

const statusIcon = (s: string) => {
  if (s === "good") return <CheckCircle className="h-4 w-4 text-good" />;
  if (s === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  return <AlertCircle className="h-4 w-4 text-bad" />;
};

const priorityColor = (p: string) => {
  if (p === "high") return "bg-destructive/10 text-destructive";
  if (p === "medium") return "bg-yellow-500/10 text-yellow-600";
  return "bg-primary/10 text-primary";
};

const ReportSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
    <div className="flex flex-col md:flex-row gap-6">
      <Skeleton className="w-full md:w-64 h-48 rounded-xl" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
    <div className="grid sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  </div>
);

const handleDownloadPDF = (report: ReportType, data: VastuReportData) => {
  // Build a printable HTML document
  const roomRows = (data.room_scores || [])
    .map((r) => `<tr><td>${r.room}</td><td>${r.direction}</td><td>${r.element}</td><td>${r.score}/100</td><td>${r.status}</td></tr>`)
    .join("");
  const recRows = (data.recommendations || [])
    .map((r) => `<tr><td><span style="text-transform:uppercase;font-size:11px;font-weight:600">${r.priority}</span></td><td>${r.title}</td><td>${r.description}</td></tr>`)
    .join("");
  const elements = data.element_harmony
    ? Object.entries(data.element_harmony).map(([k, v]) => `<li>${k}: ${v}/100</li>`).join("")
    : "";

  const html = `<!DOCTYPE html><html><head><title>VastuVista Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;color:#222}
h1{color:#c2410c}table{width:100%;border-collapse:collapse;margin:16px 0}
th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
th{background:#f5f5f5}.score{font-size:48px;font-weight:700;color:#c2410c}</style></head>
<body><h1>VastuVista Analysis Report</h1>
<p>Date: ${new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
<p class="score">${data.overall_score}/100</p>
<p>${data.summary}</p>
<h2>Room-wise Analysis</h2><table><tr><th>Room</th><th>Direction</th><th>Element</th><th>Score</th><th>Status</th></tr>${roomRows}</table>
<h2>Element Harmony</h2><ul>${elements}</ul>
<h2>Recommendations</h2><table><tr><th>Priority</th><th>Title</th><th>Description</th></tr>${recRows}</table>
<script>window.onload=()=>window.print()</script></body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `vastuvista-report-${report.id.slice(0, 8)}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

const Report = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/login"); return; }
    if (user && id) fetchReport();
  }, [user, authLoading, id]);

  const fetchReport = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) setReport(data);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="VastuVista" className="h-9 w-9" />
              <span className="font-display text-xl font-bold text-foreground">VastuVista</span>
            </Link>
          </div>
        </nav>
        <ReportSkeleton />
      </div>
    );
  }

  if (!report) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Report not found.</p></div>;
  }

  const data = report.report_data as VastuReportData;
  const elementData = data.element_harmony
    ? Object.entries(data.element_harmony).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`Vastu Report — ${data.overall_score}/100`} description={data.summary?.slice(0, 150)} path={`/report/${id}`} />
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="VastuVista" className="h-9 w-9" />
            <span className="font-display text-xl font-bold text-foreground">VastuVista</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownloadPDF(report, data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Score header */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <img src={report.image_url} alt="Floor plan" className="w-full md:w-64 h-48 object-cover rounded-xl border border-border bg-muted" />
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Vastu Analysis Report</h1>
              <p className="text-muted-foreground text-sm mb-4">
                {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold text-foreground">{data.overall_score}</span>
                <span className="text-lg text-muted-foreground mb-1">/100</span>
              </div>
              <p className="text-muted-foreground">{data.summary}</p>
            </div>
          </div>

          {/* Element Harmony Chart */}
          {elementData.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Element Harmony</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={elementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                      {elementData.map((_, i) => <Cell key={i} fill={ELEMENT_COLORS[i % ELEMENT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Room Scores</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.room_scores || []}>
                    <XAxis dataKey="room" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(25, 90%, 48%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 3D Floor Plan Visualization */}
          {data.room_scores && data.room_scores.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">3D Vastu Layout</h2>
              <FloorPlan3D rooms={data.room_scores} />
            </div>
          )}

          {/* Room Details */}
          {data.room_scores && data.room_scores.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Room-wise Analysis</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.room_scores.map((room, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    {statusIcon(room.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{room.room}</p>
                      <p className="text-xs text-muted-foreground">{room.direction} · {room.element}</p>
                    </div>
                    <span className="text-lg font-bold text-foreground">{room.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recommendations</h2>
              <div className="space-y-3">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      {rec.room && <span className="text-xs text-muted-foreground">· {rec.room}</span>}
                    </div>
                    <p className="font-medium text-foreground text-sm">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
