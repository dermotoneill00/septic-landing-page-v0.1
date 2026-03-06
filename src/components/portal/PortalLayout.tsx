import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoDarkGreen from "@/assets/logo-dark-green.png";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/portal/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src={logoDarkGreen} alt="ProGuard Plans" className="h-7 md:h-8" />
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-muted-foreground">Customer Portal</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
