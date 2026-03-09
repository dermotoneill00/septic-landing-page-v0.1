import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, GitBranch, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import logoDarkGreen from "@/assets/logo-dark-green.png";
import { ChatWidget } from "@/components/ChatWidget";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",  href: "/portal/dashboard",  icon: LayoutDashboard },
  { label: "Referrals", href: "/portal/referrals",   icon: GitBranch, badge: "Soon" },
  { label: "Admin",     href: "/portal/admin",       icon: ShieldCheck, adminOnly: true },
];

function SidebarNav({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/portal/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Top header ────────────────────────────────────────────────────────── */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-40 h-14">
        <div className="flex items-center gap-3 h-full px-4">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <a href="/" className="flex items-center">
            <img src={logoDarkGreen} alt="ProGuard Plans" className="h-7" />
          </a>

          <span className="hidden md:block text-sm text-muted-foreground ml-1">
            Customer Portal
          </span>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">

        {/* ── Mobile overlay backdrop ────────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-14 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside
          className={`
            fixed top-14 left-0 bottom-0 w-56 bg-background border-r border-border z-30
            transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:shrink-0
          `}
        >
          <SidebarNav isAdmin={isAdmin} onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* ── Page content ──────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}
