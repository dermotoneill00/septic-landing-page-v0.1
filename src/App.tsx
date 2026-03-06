import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/portal/ProtectedRoute";
import Index from "./pages/Index";
import Enroll from "./pages/Enroll";
import EnrollDenied from "./pages/EnrollDenied";
import EnrollSuccess from "./pages/EnrollSuccess";
import LPTrust from "./pages/LPTrust";
import LPFear from "./pages/LPFear";
import NotFound from "./pages/NotFound";

// Portal pages loaded lazily so Vite transforms them on first navigation,
// not at app boot — avoids module-not-ready race on initial page load.
const Login = lazy(() => import("./pages/portal/Login"));
const Dashboard = lazy(() => import("./pages/portal/Dashboard"));
const ChangePassword = lazy(() => import("./pages/portal/ChangePassword"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            }
          >
            <Routes>
              {/* ── Marketing / landing pages ── */}
              <Route path="/" element={<Index />} />
              <Route path="/enroll" element={<Enroll />} />
              <Route path="/enroll/denied" element={<EnrollDenied />} />
              <Route path="/enroll/success" element={<EnrollSuccess />} />
              <Route path="/lp/trust" element={<LPTrust />} />
              <Route path="/lp/fear" element={<LPFear />} />

              {/* ── Customer portal ── */}
              <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
              <Route path="/portal/login" element={<Login />} />
              <Route
                path="/portal/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
