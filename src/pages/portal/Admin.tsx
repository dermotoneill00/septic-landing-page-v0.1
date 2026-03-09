import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, startOfMonth } from "date-fns";
import {
  ShieldCheck, Users, CheckCircle, XCircle, GitBranch, Gift, DollarSign,
  TrendingUp, Download, AlertTriangle, UserCheck, FileText, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  system_type: string | null;
  final_price: number | null;
  promo_code: string | null;
  referral_code: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  status: string;
  created_at: string;
}

interface AdminProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  portal_enabled: boolean;
  created_at: string;
  policies: {
    id: string;
    policy_number: string;
    status: string;
    product_type: string | null;
    product: string | null;
    expiration_date: string | null;
    city: string | null;
    state: string | null;
  }[];
}

interface AdminClaim {
  id: string;
  status: string;
  description: string | null;
  claim_number: string | null;
  internal_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  profile: { first_name: string | null; last_name: string | null; email: string } | null;
  policy: { policy_number: string } | null;
}

interface AdminReferral {
  id: string;
  referee_email: string;
  referral_code: string;
  status: string;
  reward_amount: number;
  created_at: string;
  enrolled_at: string | null;
  rewarded_at: string | null;
  referrer_name: string;
  referrer_email: string;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((k) => escape(r[k])).join(",")),
  ].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: filename,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function leadStatusBadge(status: string) {
  switch (status) {
    case "submitted":
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Submitted</Badge>;
    case "denied_state":
    case "denied_cesspool":
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Denied</Badge>;
    case "in_progress":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">In Progress</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function claimStatusBadge(status: string) {
  switch (status) {
    case "submitted":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Submitted</Badge>;
    case "in_review":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">In Review</Badge>;
    case "resolved":
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Resolved</Badge>;
    case "denied":
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Denied</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function refStatusBadge(status: string) {
  switch (status) {
    case "enrolled":
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Enrolled</Badge>;
    case "rewarded":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">Rewarded</Badge>;
    default:
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Pending</Badge>;
  }
}

function formatDate(str: string | null | undefined) {
  if (!str) return "—";
  try { return format(parseISO(str), "MMM d, yyyy"); } catch { return str; }
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TabButton({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

type AdminTab = "leads" | "customers" | "claims" | "referrals";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<AdminTab>("leads");

  if (!isAdmin) {
    navigate("/portal/dashboard");
    return null;
  }

  // ── Leads ──────────────────────────────────────────────────────────────────
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, first_name, last_name, email, phone, city, state, system_type, final_price, promo_code, referral_code, utm_source, utm_campaign, utm_content, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: isAdmin,
  });

  // ── Customers ──────────────────────────────────────────────────────────────
  const { data: customers = [], isLoading: customersLoading } = useQuery<AdminProfile[]>({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, phone, portal_enabled, created_at, policies(id, policy_number, status, product_type, product, expiration_date, city, state)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminProfile[];
    },
    enabled: isAdmin && tab === "customers",
  });

  // ── Claims ─────────────────────────────────────────────────────────────────
  const { data: claims = [], isLoading: claimsLoading, error: claimsError } = useQuery<AdminClaim[]>({
    queryKey: ["admin-claims"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("id, status, description, claim_number, internal_notes, created_at, resolved_at, profile:profiles(first_name, last_name, email), policy:policies(policy_number)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminClaim[];
    },
    enabled: isAdmin && tab === "claims",
    retry: false,
  });

  // ── Referrals ──────────────────────────────────────────────────────────────
  const { data: referrals = [], isLoading: referralsLoading } = useQuery<AdminReferral[]>({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("id, referee_email, referral_code, status, reward_amount, created_at, enrolled_at, rewarded_at, referrer:profiles!referrer_profile_id(first_name, last_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        ...r,
        referrer_name: [r.referrer?.first_name, r.referrer?.last_name].filter(Boolean).join(" ") || "—",
        referrer_email: r.referrer?.email || "—",
        referrer: undefined,
      }));
    },
    enabled: isAdmin,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const updateClaimStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("claims")
        .update({ status, ...(status === "resolved" ? { resolved_at: new Date().toISOString() } : {}) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-claims"] }),
  });

  const markRewarded = useMutation({
    mutationFn: async (referralId: string) => {
      const { error } = await supabase
        .from("referrals")
        .update({ status: "rewarded", rewarded_at: new Date().toISOString() })
        .eq("id", referralId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-referrals"] }),
  });

  // ── Derived stats ──────────────────────────────────────────────────────────
  const submitted   = leads.filter((l) => l.status === "submitted");
  const denied      = leads.filter((l) => l.status.startsWith("denied"));
  const referred    = leads.filter((l) => l.referral_code);
  const thisMonth   = leads.filter((l) => l.created_at >= startOfMonth(new Date()).toISOString());
  const estimatedARR = submitted.reduce((sum, l) => sum + (l.final_price ?? 0), 0);
  const conversionRate = leads.length ? Math.round((submitted.length / leads.length) * 100) : 0;

  const activeCustCount = customers.filter(
    (c) => c.policies?.some((p) => p.status?.toLowerCase() === "active")
  ).length;
  const portalEnabledCount = customers.filter((c) => c.portal_enabled).length;
  const noPolicyCount = customers.filter((c) => !c.policies?.length).length;

  const refEnrolled  = referrals.filter((r) => r.status === "enrolled").length;
  const refRewarded  = referrals.filter((r) => r.status === "rewarded").length;
  const refTotalPaid = referrals
    .filter((r) => r.status === "rewarded")
    .reduce((sum, r) => sum + Number(r.reward_amount), 0);

  // A/B breakdown by utm_content
  const abGroups = leads.reduce((acc, l) => {
    const key = l.utm_content?.trim() || "(no variant)";
    if (!acc[key]) acc[key] = { total: 0, submitted: 0 };
    acc[key].total++;
    if (l.status === "submitted") acc[key].submitted++;
    return acc;
  }, {} as Record<string, { total: number; submitted: number }>);
  const hasABData = Object.keys(abGroups).length > 1 || Object.keys(abGroups).some((k) => k !== "(no variant)");

  return (
    <PortalLayout>

      {/* Page heading */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">Customers, leads, claims, and referrals</p>
        </div>
      </div>

      {/* ── Revenue strip ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard
          label="Active Customers" value={activeCustCount}
          icon={UserCheck} color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Est. MRR" value={`$${Math.round(estimatedARR / 12).toLocaleString()}`}
          icon={DollarSign} color="bg-emerald-50 text-emerald-600"
          sub={`$${estimatedARR.toLocaleString()} ARR`}
        />
        <StatCard
          label="Total Leads" value={leads.length}
          icon={Users} color="bg-blue-50 text-blue-600"
          sub={`${thisMonth.length} this month`}
        />
        <StatCard
          label="Conversion Rate" value={`${conversionRate}%`}
          icon={TrendingUp} color="bg-indigo-50 text-indigo-600"
          sub={`${submitted.length} submitted`}
        />
        <StatCard
          label="Referrals Paid Out" value={`$${refTotalPaid}`}
          icon={Gift} color="bg-purple-50 text-purple-600"
          sub={`${refRewarded} rewarded`}
        />
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-lg p-1 w-fit">
        <TabButton label="Leads"     active={tab === "leads"}     onClick={() => setTab("leads")} />
        <TabButton label="Customers" active={tab === "customers"} onClick={() => setTab("customers")} />
        <TabButton label="Claims"    active={tab === "claims"}    onClick={() => setTab("claims")} />
        <TabButton label="Referrals" active={tab === "referrals"} onClick={() => setTab("referrals")} />
      </div>

      {/* ════════════════════════════ LEADS ════════════════════════════════════ */}
      {tab === "leads" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total"     value={leads.length}       icon={Users}       color="bg-blue-50 text-blue-600" />
            <StatCard label="Submitted" value={submitted.length}   icon={CheckCircle} color="bg-green-50 text-green-600" />
            <StatCard label="Denied"    value={denied.length}      icon={XCircle}     color="bg-red-50 text-red-600" />
            <StatCard label="Referred"  value={referred.length}    icon={GitBranch}   color="bg-purple-50 text-purple-600" />
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">All Leads</CardTitle>
                <Button
                  size="sm" variant="outline" className="gap-1.5 text-xs h-8"
                  onClick={() => downloadCSV(
                    leads.map((l) => ({
                      name: [l.first_name, l.last_name].filter(Boolean).join(" "),
                      email: l.email, phone: l.phone ?? "",
                      city: l.city ?? "", state: l.state ?? "",
                      system_type: l.system_type ?? "", price: l.final_price ?? "",
                      promo_code: l.promo_code ?? "", referral_code: l.referral_code ?? "",
                      utm_source: l.utm_source ?? "", utm_campaign: l.utm_campaign ?? "",
                      utm_content: l.utm_content ?? "", status: l.status, date: l.created_at,
                    })),
                    `leads-${format(new Date(), "yyyy-MM-dd")}.csv`
                  )}
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {leadsLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">Name</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Email</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Location</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">System</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Price</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden xl:table-cell">Source / Variant</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-10 text-sm">
                            No leads yet.
                          </TableCell>
                        </TableRow>
                      ) : leads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-muted/30">
                          <TableCell className="pl-6 font-medium text-sm">
                            {[lead.first_name, lead.last_name].filter(Boolean).join(" ") || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                            {lead.email}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden lg:table-cell capitalize">
                            {lead.system_type?.replace(/_/g, " ") || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                            {lead.final_price != null ? (
                              <span>
                                ${lead.final_price}
                                {lead.promo_code && (
                                  <span className="ml-1 text-xs text-green-600">({lead.promo_code})</span>
                                )}
                              </span>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden xl:table-cell">
                            {lead.utm_content ? (
                              <span className="text-indigo-600 font-mono text-xs bg-indigo-50 px-1.5 py-0.5 rounded">
                                {lead.utm_content}
                              </span>
                            ) : lead.utm_source || lead.utm_campaign
                              ? [lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ")
                              : lead.referral_code
                                ? <span className="text-purple-600 font-mono text-xs">ref:{lead.referral_code}</span>
                                : "—"}
                          </TableCell>
                          <TableCell>{leadStatusBadge(lead.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {formatDate(lead.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* A/B variant breakdown */}
          {hasABData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">A/B Variant Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">Variant (utm_content)</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Leads</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Submitted</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(abGroups)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([variant, stats]) => (
                        <TableRow key={variant} className="hover:bg-muted/30">
                          <TableCell className="pl-6 font-mono text-sm">{variant}</TableCell>
                          <TableCell className="text-sm">{stats.total}</TableCell>
                          <TableCell className="text-sm">{stats.submitted}</TableCell>
                          <TableCell className="text-sm font-medium">
                            {stats.total ? `${Math.round((stats.submitted / stats.total) * 100)}%` : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ════════════════════════════ CUSTOMERS ════════════════════════════════ */}
      {tab === "customers" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Customers"   value={customers.length}     icon={Users}         color="bg-blue-50 text-blue-600" />
            <StatCard label="Active Policy"      value={activeCustCount}      icon={CheckCircle}   color="bg-green-50 text-green-600" />
            <StatCard label="Portal Enabled"     value={portalEnabledCount}   icon={UserCheck}     color="bg-indigo-50 text-indigo-600" />
            <StatCard label="No Policy on File"  value={noPolicyCount}        icon={AlertTriangle} color="bg-amber-50 text-amber-600" />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">All Customers</CardTitle>
                <Button
                  size="sm" variant="outline" className="gap-1.5 text-xs h-8"
                  onClick={() => downloadCSV(
                    customers.map((c) => {
                      const p = c.policies?.find((p) => p.status?.toLowerCase() === "active") ?? c.policies?.[0];
                      return {
                        name: [c.first_name, c.last_name].filter(Boolean).join(" "),
                        email: c.email, phone: c.phone ?? "",
                        city: p?.city ?? "", state: p?.state ?? "",
                        plan: p?.product_type ?? p?.product ?? "",
                        policy_number: p?.policy_number ?? "",
                        policy_status: p?.status ?? "no policy",
                        portal_enabled: c.portal_enabled,
                        joined: c.created_at,
                      };
                    }),
                    `customers-${format(new Date(), "yyyy-MM-dd")}.csv`
                  )}
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {customersLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">Name</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Email</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Location</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Plan</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Policy Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Portal</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-10 text-sm">
                            No customers yet.
                          </TableCell>
                        </TableRow>
                      ) : customers.map((c) => {
                        const activePolicy = c.policies?.find((p) => p.status?.toLowerCase() === "active") ?? c.policies?.[0];
                        return (
                          <TableRow key={c.id} className="hover:bg-muted/30">
                            <TableCell className="pl-6 font-medium text-sm">
                              {[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                              {c.email}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                              {[activePolicy?.city, activePolicy?.state].filter(Boolean).join(", ") || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {activePolicy?.product_type ?? activePolicy?.product ?? "—"}
                            </TableCell>
                            <TableCell>
                              {activePolicy ? (
                                <Badge className={
                                  activePolicy.status?.toLowerCase() === "active"
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                    : "bg-muted text-muted-foreground border-border hover:bg-muted"
                                }>
                                  {activePolicy.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-700 border-amber-300">
                                  No Policy
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={`text-xs font-medium ${c.portal_enabled ? "text-green-700" : "text-muted-foreground"}`}>
                                {c.portal_enabled ? "Enabled" : "Disabled"}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                              {formatDate(c.created_at)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ════════════════════════════ CLAIMS ═══════════════════════════════════ */}
      {tab === "claims" && (
        <>
          {claimsError ? (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Claims table not set up</p>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                      Run the following SQL in your Supabase SQL Editor to enable claim tracking.
                    </p>
                  </div>
                  <pre className="text-xs bg-white border border-amber-200 rounded-lg p-4 text-left w-full max-w-lg text-amber-900 overflow-x-auto">
{`CREATE TABLE claims (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  policy_id   UUID REFERENCES policies(id) ON DELETE SET NULL,
  claim_number TEXT UNIQUE,
  status      TEXT NOT NULL DEFAULT 'submitted',
  description TEXT,
  internal_notes TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access"
  ON claims FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Claims" value={claims.length}                                            icon={FileText}    color="bg-blue-50 text-blue-600" />
                <StatCard label="Submitted"    value={claims.filter((c) => c.status === "submitted").length}   icon={CheckCircle} color="bg-amber-50 text-amber-600" />
                <StatCard label="In Review"    value={claims.filter((c) => c.status === "in_review").length}   icon={RefreshCw}   color="bg-indigo-50 text-indigo-600" />
                <StatCard label="Resolved"     value={claims.filter((c) => c.status === "resolved").length}    icon={CheckCircle} color="bg-green-50 text-green-600" />
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">All Claims</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {claimsLoading ? (
                    <div className="p-6 space-y-3">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                  ) : claims.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                      No claims on file yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">Claim #</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">Customer</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Filed</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">Update Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {claims.map((claim) => (
                            <TableRow key={claim.id} className="hover:bg-muted/30">
                              <TableCell className="pl-6 font-mono text-sm">
                                {claim.claim_number || "—"}
                              </TableCell>
                              <TableCell>
                                <p className="text-sm font-medium">
                                  {[claim.profile?.first_name, claim.profile?.last_name].filter(Boolean).join(" ") || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">{claim.profile?.email ?? "—"}</p>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                                {claim.description || "—"}
                              </TableCell>
                              <TableCell>{claimStatusBadge(claim.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                                {formatDate(claim.created_at)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={claim.status}
                                  onValueChange={(val) => updateClaimStatus.mutate({ id: claim.id, status: val })}
                                >
                                  <SelectTrigger className="h-7 w-28 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="in_review">In Review</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="denied">Denied</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* ════════════════════════════ REFERRALS ════════════════════════════════ */}
      {tab === "referrals" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total"    value={referrals.length}  icon={GitBranch}   color="bg-blue-50 text-blue-600" />
            <StatCard label="Enrolled" value={refEnrolled}        icon={CheckCircle} color="bg-green-50 text-green-600" />
            <StatCard label="Rewarded" value={refRewarded}        icon={Gift}        color="bg-purple-50 text-purple-600" />
            <StatCard label="Paid Out" value={`$${refTotalPaid}`} icon={DollarSign}  color="bg-amber-50 text-amber-600" />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">All Referrals</CardTitle>
                <Button
                  size="sm" variant="outline" className="gap-1.5 text-xs h-8"
                  onClick={() => downloadCSV(
                    referrals.map((r) => ({
                      referrer_name: r.referrer_name, referrer_email: r.referrer_email,
                      referee_email: r.referee_email, code: r.referral_code,
                      status: r.status, reward: r.reward_amount,
                      enrolled_at: r.enrolled_at ?? "", rewarded_at: r.rewarded_at ?? "",
                    })),
                    `referrals-${format(new Date(), "yyyy-MM-dd")}.csv`
                  )}
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {referralsLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">Referrer</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Referee</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Code</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Reward</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-10 text-sm">
                            No referrals yet.
                          </TableCell>
                        </TableRow>
                      ) : referrals.map((ref) => (
                        <TableRow key={ref.id} className="hover:bg-muted/30">
                          <TableCell className="pl-6">
                            <p className="text-sm font-medium">{ref.referrer_name}</p>
                            <p className="text-xs text-muted-foreground">{ref.referrer_email}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                            {ref.referee_email}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                            {ref.referral_code}
                          </TableCell>
                          <TableCell>{refStatusBadge(ref.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            ${ref.reward_amount}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {formatDate(ref.enrolled_at || ref.created_at)}
                          </TableCell>
                          <TableCell>
                            {ref.status === "enrolled" ? (
                              <Button
                                size="sm" variant="outline" className="text-xs h-7 px-2"
                                disabled={markRewarded.isPending}
                                onClick={() => markRewarded.mutate(ref.id)}
                              >
                                Mark Rewarded
                              </Button>
                            ) : ref.status === "rewarded" ? (
                              <span className="text-xs text-green-700">
                                Paid {ref.rewarded_at ? formatDate(ref.rewarded_at) : ""}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

    </PortalLayout>
  );
}
