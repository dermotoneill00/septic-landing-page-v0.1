import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder until claim submissions are stored in the database.
// When you add a `claims` table, swap the empty state for a real data table.

export default function History() {
  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">Service History</h1>
          <p className="text-muted-foreground mt-1">
            A record of your past claims and technician visits.
          </p>
        </div>

        {/* Empty state */}
        <Card className="border-border">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">No service history yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Claims you file and technician visits will appear here once we log them to your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coming soon callout */}
        <Card className="border-border mt-5 bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Full claim tracking coming soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;re building a complete service history log so you can track every claim
              from submission through to repair completion, with technician details and
              visit notes, all in one place.
            </p>
            <p className="text-sm text-muted-foreground">
              In the meantime, need a record of a past claim? Call us at{" "}
              <span className="font-medium text-foreground">1-800-PRO-GUARD</span> or email{" "}
              <a
                href="mailto:support@proguardplans.com"
                className="text-[#1B5E3B] font-medium hover:underline"
              >
                support@proguardplans.com
              </a>{" "}
              and we&apos;ll pull the records for you.
            </p>
          </CardContent>
        </Card>

        {/* File a new claim CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-[#1B5E3B]/20 bg-[#1B5E3B]/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#1B5E3B] flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Need to file a claim now?</p>
              <p className="text-xs text-muted-foreground">Our team is available 24 / 7.</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-[#1B5E3B] hover:bg-[#164d31] text-white flex-shrink-0">
            <a href="/portal/claim">Go to File a Claim</a>
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
