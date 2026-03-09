import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  GitBranch, Copy, CheckCircle2, Gift, Users, DollarSign, Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/types/portal";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const REWARD_PER_REFERRAL = 20;
const FREE_POLICY_THRESHOLD = 10;

interface Referral {
  id: string;
  referee_email: string;
  status: string;
  reward_amount: number;
  created_at: string;
  enrolled_at: string | null;
  rewarded_at: string | null;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 2))}@${domain}`;
}

function formatDate(str: string | null): string {
  if (!str) return "—";
  try {
    return format(parseISO(str), "MMM d, yyyy");
  } catch {
    return str;
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "enrolled":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          Enrolled
        </Badge>
      );
    case "rewarded":
      return (
        <Badge className="bg-[#1B5E3B]/10 text-[#1B5E3B] border-[#1B5E3B]/20 hover:bg-[#1B5E3B]/10">
          Rewarded
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
          Pending
        </Badge>
      );
  }
}

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: string | number; icon: React.ElementType; color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Fetch profile (to get referral_code)
  const { data: profile, isLoading: profileLoading } = useQuery<Profile | null>({
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

  // Fetch referrals for this user
  const { data: referrals = [], isLoading: referralsLoading } = useQuery<Referral[]>({
    queryKey: ["portal-referrals", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("id, referee_email, status, reward_amount, created_at, enrolled_at, rewarded_at")
        .eq("referrer_profile_id", profile.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!profile?.id,
  });

  const isLoading = profileLoading || referralsLoading;
  const referralCode = profile?.referral_code ?? "";
  const shareUrl = `${window.location.origin}/enroll?ref=${referralCode}`;

  const enrolled = referrals.filter((r) => r.status === "enrolled" || r.status === "rewarded").length;
  const rewarded = referrals.filter((r) => r.status === "rewarded").length;
  const totalEarned = referrals
    .filter((r) => r.status === "rewarded")
    .reduce((sum, r) => sum + Number(r.reward_amount), 0);
  const progressToFree = Math.min(enrolled, FREE_POLICY_THRESHOLD);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback — select text for manual copy
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">Referrals</h1>
          <p className="text-muted-foreground mt-1">
            Earn <span className="font-semibold text-foreground">${REWARD_PER_REFERRAL}</span> for
            every neighbour you refer. Reach {FREE_POLICY_THRESHOLD} and your next policy year is free.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <>
            {/* ── Share link card ─────────────────────────────────────────────── */}
            <Card className="border-[#1B5E3B]/30 bg-[#1B5E3B]/5 mb-6">
              <CardContent className="py-5">
                <p className="text-xs font-semibold text-[#1B5E3B] uppercase tracking-wide mb-2">
                  Your referral link
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-foreground truncate select-all">
                    {shareUrl}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 gap-1.5 h-[42px] px-4"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this link with friends and neighbours. When they enroll, you earn ${REWARD_PER_REFERRAL}.
                </p>
              </CardContent>
            </Card>

            {/* ── Stats ──────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Referred"
                value={referrals.length}
                icon={Users}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                label="Enrolled"
                value={enrolled}
                icon={CheckCircle2}
                color="bg-green-50 text-green-600"
              />
              <StatCard
                label="Rewarded"
                value={rewarded}
                icon={Gift}
                color="bg-purple-50 text-purple-600"
              />
              <StatCard
                label="Earned"
                value={`$${totalEarned}`}
                icon={DollarSign}
                color="bg-amber-50 text-amber-600"
              />
            </div>

            {/* ── Progress to free policy ─────────────────────────────────────── */}
            <Card className="border-border mb-6">
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#F5C842]" />
                    <p className="text-sm font-semibold text-foreground">Free Policy Progress</p>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">
                    {progressToFree} / {FREE_POLICY_THRESHOLD}
                  </p>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1B5E3B] to-[#2d8a5e] rounded-full transition-all duration-500"
                    style={{ width: `${(progressToFree / FREE_POLICY_THRESHOLD) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {progressToFree >= FREE_POLICY_THRESHOLD
                    ? "Congratulations! You've earned a free policy renewal. Our team will apply it at your next renewal date."
                    : `Refer ${FREE_POLICY_THRESHOLD - progressToFree} more ${FREE_POLICY_THRESHOLD - progressToFree === 1 ? "neighbour" : "neighbours"} to earn a free policy renewal next year.`}
                </p>
              </CardContent>
            </Card>

            {/* ── Referral table ──────────────────────────────────────────────── */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Your Referrals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {referrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <GitBranch className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">No referrals yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Share your link above and you&apos;ll see your referrals appear here as people enroll.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wide">
                            Referred
                          </TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wide">
                            Status
                          </TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">
                            Reward
                          </TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((ref) => (
                          <TableRow key={ref.id} className="hover:bg-muted/30">
                            <TableCell className="pl-6 text-sm font-medium">
                              {maskEmail(ref.referee_email)}
                            </TableCell>
                            <TableCell>{statusBadge(ref.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                              {ref.status === "rewarded"
                                ? <span className="text-green-700 font-medium">${ref.reward_amount}</span>
                                : <span className="text-muted-foreground">${ref.reward_amount}</span>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                              {formatDate(ref.enrolled_at || ref.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── How it works ───────────────────────────────────────────────── */}
            <Card className="border-border mt-6 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">How the referral program works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Share your unique referral link with friends and neighbours</li>
                  <li>They enroll through your link — it takes about 3 minutes</li>
                  <li>You earn <span className="font-semibold text-foreground">${REWARD_PER_REFERRAL}</span> for each successful enrollment</li>
                  <li>Reach <span className="font-semibold text-foreground">{FREE_POLICY_THRESHOLD} referrals</span> and your next policy year is on us</li>
                </ol>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
