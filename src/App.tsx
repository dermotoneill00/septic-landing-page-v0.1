import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/portal/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { GeoProvider } from "@/contexts/GeoContext";
import Index from "./pages/Index";
import Enroll from "./pages/Enroll";
import EnrollDenied from "./pages/EnrollDenied";
import EnrollSuccess from "./pages/EnrollSuccess";
import LPTrust from "./pages/LPTrust";
import LPTrustB from "./pages/LPTrustB";
import LPFear from "./pages/LPFear";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import NotFound from "./pages/NotFound";

// Portal pages loaded lazily so Vite transforms them on first navigation,
// not at app boot — avoids module-not-ready race on initial page load.
const Login = lazy(() => import("./pages/portal/Login"));
const Dashboard = lazy(() => import("./pages/portal/Dashboard"));
const ChangePassword = lazy(() => import("./pages/portal/ChangePassword"));
const Referrals = lazy(() => import("./pages/portal/Referrals"));
const Claim = lazy(() => import("./pages/portal/Claim"));
const Documents = lazy(() => import("./pages/portal/Documents"));
const History = lazy(() => import("./pages/portal/History"));
const Account = lazy(() => import("./pages/portal/Account"));
const Admin = lazy(() => import("./pages/portal/Admin"));

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
        <ScrollToTop />
        <GeoProvider>
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
              <Route path="/lp/trust-b" element={<LPTrustB />} />
              <Route path="/lp/fear" element={<LPFear />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />

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
              <Route
                path="/portal/claim"
                element={
                  <ProtectedRoute>
                    <Claim />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/referrals"
                element={
                  <ProtectedRoute>
                    <Referrals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
        </GeoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
