import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile, Policy } from "@/types/portal";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, MapPin, Phone, Mail, AlertCircle, FileDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

// TODO: Replace with your real Google Business review link
// Find yours at: https://business.google.com → Get more reviews → copy the link
const GOOGLE_REVIEW_URL = "https://g.page/r/YOUR_GOOGLE_PLACE_ID/review";

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

function statusStyles(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    default:
      return "bg-muted text-muted-foreground border-border hover:bg-muted";
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function downloadServiceAgreement(profile: Profile, policy: Policy) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const green = [27, 94, 59] as [number, number, number];
  const gray = [100, 100, 100] as [number, number, number];
  const black = [30, 30, 30] as [number, number, number];
  const pageW = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(...green);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ProGuard Plans", 50, 38);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Septic System Service Agreement", 50, 56);

  // Policy number badge
  doc.setFontSize(10);
  doc.text(`Policy #${policy.policy_number}`, pageW - 50, 44, { align: "right" });
  doc.text(
    `Effective: ${formatDate(policy.coverage_effective_date || policy.start_date)}`,
    pageW - 50, 58, { align: "right" }
  );

  let y = 100;

  // Section: Customer Info
  const section = (title: string) => {
    doc.setFillColor(245, 247, 245);
    doc.rect(40, y - 14, pageW - 80, 20, "F");
    doc.setTextColor(...green);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), 50, y);
    y += 20;
    doc.setTextColor(...black);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const row = (label: string, value: string) => {
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "bold");
    doc.text(label, 50, y);
    doc.setTextColor(...black);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", 200, y);
    y += 18;
  };

  section("Policyholder");
  row("Name:", [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—");
  row("Email:", profile.email || "—");
  row("Phone:", profile.phone || "—");
  y += 10;

  section("Covered Property");
  const addr = policy.full_address ||
    [policy.street, policy.city, policy.state, policy.zip].filter(Boolean).join(", ");
  row("Address:", addr || "—");
  row("Coverage Type:", policy.product_type || policy.product || "Septic System Protection");
  row("Status:", policy.status || "—");
  row("Effective Date:", formatDate(policy.coverage_effective_date || policy.start_date));
  row("Renewal Date:", formatDate(policy.expiration_date));
  y += 10;

  section("What Your Plan Covers");
  const coverageItems = [
    "Septic pump failures & motor burnout",
    "Tank structural failures",
    "Drain field / leach field issues",
    "Emergency pump-outs (up to 2 per year)",
    "Distribution box failures",
    "Baffle repairs & replacements",
    "Inspection & diagnostic visits",
  ];
  coverageItems.forEach((item) => {
    doc.setTextColor(...green);
    doc.text("✓", 50, y);
    doc.setTextColor(...black);
    doc.text(item, 68, y);
    y += 17;
  });
  y += 10;

  section("What Is Not Covered");
  const exclusions = [
    "Damage caused by misuse or neglect",
    "Cesspools or systems installed < 12 months ago",
    "Pre-existing conditions known at time of enrollment",
    "Cosmetic damage or landscaping restoration",
  ];
  exclusions.forEach((item) => {
    doc.setTextColor(200, 50, 50);
    doc.text("✕", 50, y);
    doc.setTextColor(...black);
    doc.text(item, 68, y);
    y += 17;
  });
  y += 10;

  section("How to File a Claim");
  doc.setTextColor(...black);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const claimText = [
    "1. Call ProGuard Claims: 1-800-PRO-GUARD (available 24/7)",
    "2. Provide your policy number and describe the issue",
    "3. A licensed technician will be dispatched within 48 hours",
    "4. ProGuard pays the service provider directly — $0 out of pocket",
  ];
  claimText.forEach((line) => {
    doc.text(line, 50, y);
    y += 17;
  });
  y += 10;

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(40, y, pageW - 40, y);
  y += 14;
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.text(
    "This document is for reference only. Your full service agreement terms are on file with ProGuard Plans.",
    50, y
  );
  y += 12;
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}  •  proguardplans.com`,
    50, y
  );

  doc.save(`ProGuard-ServiceAgreement-${policy.policy_number}.pdf`);
}

function ProfileCard({ profile, activePolicies }: { profile: Profile; activePolicies: Policy[] }) {
  const activePolicy = activePolicies[0] ?? null;
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—";

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Name</p>
            <p className="text-sm font-medium text-foreground">{fullName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </p>
            <p className="text-sm font-medium text-foreground break-all">{profile.email}</p>
          </div>
          {(profile.phone || activePolicy?.home_phone || activePolicy?.cell) && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </p>
              <p className="text-sm font-medium text-foreground">
                {profile.phone || activePolicy?.home_phone || activePolicy?.cell || "—"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {activePolicy && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Covered Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePolicy.full_address ? (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
                <p className="text-sm font-medium text-foreground">{activePolicy.full_address}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
                <p className="text-sm font-medium text-foreground">
                  {[activePolicy.street, activePolicy.city, activePolicy.state, activePolicy.zip]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-sm font-medium"
                onClick={() => downloadServiceAgreement(profile, activePolicy)}
              >
                <FileDown className="h-4 w-4" />
                Download Service Agreement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivePolicySummary({ policy }: { policy: Policy }) {
  return (
    <Card className="border-l-4 border-l-green-500 border-border mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-semibold">Your Policy Overview</CardTitle>
          <Badge className={statusStyles(policy.status)}>{policy.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Policy Number</p>
            <p className="text-sm font-semibold text-foreground font-mono">{policy.policy_number}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Coverage Type</p>
            <p className="text-sm font-medium text-foreground">{policy.product_type || policy.product || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Effective Date</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(policy.coverage_effective_date || policy.start_date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Renewal Date</p>
            <p className="text-sm font-medium text-foreground">{formatDate(policy.expiration_date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PolicyHistoryTable({ policies }: { policies: Policy[] }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Policy History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold uppercase tracking-wide pl-6">
                  Policy Number
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide hidden md:table-cell">
                  Coverage Type
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">
                  Start Date
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Expiration
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm pl-6">{policy.policy_number}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusStyles(policy.status)}`}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {policy.product_type || policy.product || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                    {formatDate(policy.start_date)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(policy.expiration_date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<Profile | null>({
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
  });

  const {
    data: policies,
    isLoading: policiesLoading,
    error: policiesError,
  } = useQuery<Policy[]>({
    queryKey: ["portal-policies", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("profile_id", profile.id)
        .order("policy_sort_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!profile?.id,
  });

  useEffect(() => {
    if (profile && profile.must_reset_password) {
      navigate("/portal/change-password");
    }
  }, [profile, navigate]);

  const isLoading = profileLoading || policiesLoading;
  const hasError = profileError || policiesError;
  const activePolicies = (policies ?? []).filter(
    (p) => p.status.toLowerCase() === "active"
  );

  const firstName = profile?.first_name || "there";

  return (
    <PortalLayout>
      {isLoading && <DashboardSkeleton />}

      {!isLoading && hasError && (
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Unable to load your account</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We had trouble retrieving your policy information. Please try refreshing the page or contact
            ProGuard support if the issue continues.
          </p>
        </div>
      )}

      {!isLoading && !hasError && profile && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Welcome back, {firstName}.
            </h1>
            <p className="text-muted-foreground mt-1">
              Here is your current policy information.
            </p>
          </div>

          <ProfileCard profile={profile} activePolicies={activePolicies} />

          {activePolicies.length > 0 ? (
            <ActivePolicySummary policy={activePolicies[0]} />
          ) : (
            <Card className="border-amber-200 bg-amber-50 mb-8">
              <CardContent className="py-5">
                <p className="text-sm text-amber-800 font-medium">
                  No active policy found. If you believe this is an error, please contact ProGuard support.
                </p>
              </CardContent>
            </Card>
          )}

          {policies && policies.length > 0 && (
            <PolicyHistoryTable policies={policies} />
          )}

          {/* Google Review card — only shown when customer has an active policy */}
          {activePolicies.length > 0 && (
            <Card className="border-amber-200 bg-amber-50 mt-8">
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-semibold text-foreground">
                      Happy with your ProGuard coverage?
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      A quick review helps your neighbours find reliable septic protection.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-amber-400 text-amber-800 hover:bg-amber-100 flex-shrink-0 gap-2"
                  >
                    <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      Leave a Google Review
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="/" className="text-accent font-medium underline-offset-4 hover:underline">
                Contact ProGuard support
              </a>
            </p>
          </div>
        </>
      )}

      {!isLoading && !hasError && !profile && (
        <div className="max-w-lg mx-auto text-center py-16">
          <h2 className="text-lg font-semibold text-foreground mb-2">No account found</h2>
          <p className="text-sm text-muted-foreground">
            We could not find a portal account linked to your email address. Please contact ProGuard support for assistance.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}
