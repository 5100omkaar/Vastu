import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/vastuvista-logo.png";
import SEOHead from "@/components/SEOHead";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Terms of Service — VastuVista" description="Read VastuVista's terms of service and usage policies." path="/terms" />
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="VastuVista" className="h-9 w-9" />
          <span className="font-display text-xl font-bold text-foreground">VastuVista</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
      </div>
    </nav>
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
        <h2 className="font-display text-lg font-semibold text-foreground">1. Acceptance</h2>
        <p>By using VastuVista, you agree to these terms. If you disagree, please discontinue use.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">2. Service Description</h2>
        <p>VastuVista provides AI-powered Vastu Shastra analysis of floor plans. Results are for informational purposes and should not replace professional consultation.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">4. Acceptable Use</h2>
        <p>You agree not to misuse the service, upload harmful content, or attempt to reverse-engineer our AI models.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
        <p>VastuVista is provided "as is" without warranties. We are not liable for decisions made based on AI analysis.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">6. Changes</h2>
        <p>We may update these terms. Continued use constitutes acceptance of changes.</p>
      </div>
    </div>
  </div>
);

export default Terms;
