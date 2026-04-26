import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/vastuvista-logo.png";
import { Menu, X, LayoutDashboard, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2">
          <img src={logo} alt="VastuVista Logo" className="h-9 w-9" />
          <span className="font-display text-xl font-bold text-foreground">VastuVista</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/assistant"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                <Bot className="h-4 w-4" />
                AI Assistant
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block font-body text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <Link to="/assistant" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>
                AI Assistant
              </Link>
              <Link to="/dashboard" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            </>
          ) : (
            <Link to="/login" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
