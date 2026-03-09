import { GitBranch } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function Referrals() {
  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Referrals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Earn rewards by referring friends and neighbors.
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-5">
            <GitBranch className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            The referral program is under development. Check back soon — you'll be able to
            share your unique link and earn rewards for every homeowner you refer to ProGuard.
          </p>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
