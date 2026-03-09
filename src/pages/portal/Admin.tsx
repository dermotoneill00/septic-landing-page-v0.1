import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ShieldCheck, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";

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
  utm_source: string | null;
  utm_campaign: string | null;
  status: string;
  created_at: string;
}

function statusBadge(status: string) {
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

function formatDate(str: string) {
  try { return format(parseISO(str), "MMM d, yyyy"); } catch { return str; }
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ElementType; color: string;
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

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, first_name, last_name, email, phone, city, state, system_type, final_price, promo_code, utm_source, utm_campaign, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: isAdmin,
  });

  // Redirect non-admins
  if (!isAdmin) {
    navigate("/portal/dashboard");
    return null;
  }

  const submitted   = leads.filter((l) => l.status === "submitted").length;
  const denied      = leads.filter((l) => l.status.startsWith("denied")).length;
  const inProgress  = leads.filter((l) => l.status === "in_progress").length;

  return (
    <PortalLayout>
      <div className="mb-8 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">Lead overview and enrollment activity</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads"   value={leads.length} icon={Users}       color="bg-blue-50 text-blue-600" />
        <StatCard label="Submitted"     value={submitted}    icon={CheckCircle}  color="bg-green-50 text-green-600" />
        <StatCard label="Denied"        value={denied}       icon={XCircle}      color="bg-red-50 text-red-600" />
        <StatCard label="In Progress"   value={inProgress}   icon={Clock}        color="bg-amber-50 text-amber-600" />
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
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
                    <TableHead className="text-xs font-semibold uppercase tracking-wide hidden xl:table-cell">Source</TableHead>
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
                  ) : (
                    leads.map((lead) => (
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
                          {lead.utm_source || lead.utm_campaign
                            ? [lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ")
                            : "—"}
                        </TableCell>
                        <TableCell>{statusBadge(lead.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {formatDate(lead.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
