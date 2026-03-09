import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/types/portal";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  readOnly,
  hint,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors
          focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]
          ${disabled || readOnly ? "opacity-60 cursor-not-allowed bg-muted" : ""}
        `}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Account() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const { data: profile, isLoading } = useQuery<Profile | null>({
    queryKey: ["portal-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setPhone(data.phone ?? "");
      }
    },
  });

  const update = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("No profile");
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          phone: phone.trim() || null,
        })
        .eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-profile"] });
      setDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    },
  });

  const handleChange =
    (setter: (v: string) => void) => (v: string) => {
      setter(v);
      setDirty(true);
      setSaveStatus("idle");
    };

  return (
    <PortalLayout>
      <div className="max-w-xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Update your contact information.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Contact info card */}
            <Card className="border-border mb-5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First Name"
                    value={firstName}
                    onChange={handleChange(setFirstName)}
                    placeholder="Jane"
                  />
                  <Field
                    label="Last Name"
                    value={lastName}
                    onChange={handleChange(setLastName)}
                    placeholder="Smith"
                  />
                </div>
                <Field
                  label="Phone"
                  value={phone}
                  onChange={handleChange(setPhone)}
                  type="tel"
                  placeholder="(555) 000-0000"
                />
                <Field
                  label="Email Address"
                  value={profile?.email ?? ""}
                  readOnly
                  hint="Email is managed by your login credentials and cannot be changed here."
                />

                {/* Save row */}
                <div className="flex items-center justify-between pt-2">
                  {saveStatus === "saved" && (
                    <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Changes saved
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Save failed — please try again
                    </span>
                  )}
                  {saveStatus === "idle" && <span />}

                  <Button
                    onClick={() => update.mutate()}
                    disabled={!dirty || update.isPending}
                    className="bg-[#1B5E3B] hover:bg-[#164d31] text-white ml-auto"
                    size="sm"
                  >
                    {update.isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security card */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last changed: unknown
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/portal/change-password">Change Password</a>
                  </Button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{profile?.email}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help note */}
            <p className="text-xs text-muted-foreground text-center mt-8">
              Need to update your covered property address?{" "}
              <a
                href="mailto:support@proguardplans.com"
                className="text-[#1B5E3B] font-medium hover:underline"
              >
                Contact support
              </a>{" "}
              and we&apos;ll update it within one business day.
            </p>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
