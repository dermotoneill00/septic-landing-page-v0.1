import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoDarkGreen from "@/assets/logo-dark-green.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordUpdated = (location.state as { passwordUpdated?: boolean } | null)?.passwordUpdated ?? false;
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setIsSubmitting(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError(
        "We couldn't sign you in. Please check your email and password and try again. If you believe you have a policy with us, contact ProGuard support."
      );
      setIsSubmitting(false);
      return;
    }

    navigate("/portal/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to ProGuard Plans
          </a>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img src={logoDarkGreen} alt="ProGuard Plans" className="h-9" />
          </div>

          <Card className="border-border shadow-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-display">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                Sign in to view your policy information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordUpdated && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Your password has been updated. Please sign in with your new password.</AlertDescription>
                </Alert>
              )}

              {authError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  className="w-full rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <Link
                    to="/"
                    className="text-accent underline-offset-4 hover:underline font-medium"
                  >
                    Contact ProGuard support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Portal access is available to active policyholders only.
          </p>
        </div>
      </div>
    </div>
  );
}
