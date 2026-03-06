import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePassword() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ newPassword }: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError("Could not update your password. Please try again or contact support.");
      setIsSubmitting(false);
      return;
    }

    if (user) {
      await supabase
        .from("profiles")
        .update({ must_reset_password: false })
        .eq("auth_user_id", user.id);
    }

    queryClient.clear();
    await signOut();
    navigate("/portal/login", { state: { passwordUpdated: true } });
  };

  return (
    <PortalLayout>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-trust-badge flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">Set a new password</h1>
            <p className="text-sm text-muted-foreground">
              Please choose a password for your account before continuing.
            </p>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Create your password</CardTitle>
            <CardDescription>
              Must be at least 8 characters with one uppercase letter and one number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  className={errors.newPassword ? "border-destructive" : ""}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Password and Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
