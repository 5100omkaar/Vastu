import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/vastuvista-logo.png";
import SEOHead from "@/components/SEOHead";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Privacy Policy — VastuVista" description="Learn how VastuVista protects your data and privacy." path="/privacy" />
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
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
        <h2 className="font-display text-lg font-semibold text-foreground">1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email, phone number, and uploaded floor plan images for Vastu analysis.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">2. How We Use Your Data</h2>
        <p>Your data is used solely to provide Vastu analysis services, improve our AI models, and communicate with you about your account.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
        <p>All data is stored securely using Supabase with row-level security policies. Floor plan images are stored in encrypted cloud storage.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">4. Data Sharing</h2>
        <p>We do not sell or share your personal information with third parties except as required by law.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">5. Your Rights</h2>
        <p>You can delete your account and all associated data at any time from your profile settings.</p>
        <h2 className="font-display text-lg font-semibold text-foreground">6. Contact</h2>
        <p>For privacy-related questions, contact us at privacy@vastuvista.com.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
