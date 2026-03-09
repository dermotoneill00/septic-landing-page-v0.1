import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, CheckCircle2, Clock, CreditCard, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CLAIMS_PHONE = "1-800-PRO-GUARD";
const CLAIMS_EMAIL = "claims@proguardplans.com";

function ClaimStepCard({
  step,
  icon: Icon,
  title,
  body,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border bg-background">
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-[#1B5E3B]/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-[#1B5E3B]" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
          Step {step}
        </p>
        <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function Claim() {
  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">File a Claim</h1>
          <p className="text-muted-foreground mt-1">
            We&apos;re here 24/7. Get help fast with your septic system.
          </p>
        </div>

        {/* Primary CTA */}
        <Card className="border-[#1B5E3B]/30 bg-[#1B5E3B]/5 mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-[#1B5E3B] flex items-center justify-center shadow-md">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-xs font-semibold text-[#1B5E3B] uppercase tracking-wide mb-0.5">
                  Claims Hotline · Available 24 / 7
                </p>
                <p className="text-2xl font-bold text-foreground tracking-tight">{CLAIMS_PHONE}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  A licensed technician will be dispatched within 48 hours.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-[#1B5E3B] hover:bg-[#164d31] text-white flex-shrink-0"
              >
                <a href={`tel:${CLAIMS_PHONE.replace(/-/g, "")}`}>Call Now</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="border-border mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">How the claims process works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ClaimStepCard
              step={1}
              icon={Phone}
              title="Call our claims line"
              body={`Dial ${CLAIMS_PHONE} any time of day or night. Have your policy number handy. You'll find it on your dashboard overview.`}
            />
            <ClaimStepCard
              step={2}
              icon={FileText}
              title="Describe the problem"
              body="Tell us what's happening with your septic system. Our team will ask a few quick questions to assess the situation and dispatch the right technician."
            />
            <ClaimStepCard
              step={3}
              icon={Clock}
              title="Technician dispatched within 48 hours"
              body="A licensed, vetted septic professional will be sent to your property. For emergencies, we prioritize same-day or next-day service where possible."
            />
            <ClaimStepCard
              step={4}
              icon={CreditCard}
              title="We pay the technician directly"
              body="No out-of-pocket costs. ProGuard pays the service provider on your behalf. You never see a bill for covered repairs."
            />
          </CardContent>
        </Card>

        {/* What to have ready */}
        <Card className="border-border mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1B5E3B]" />
              What to have ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Your ProGuard policy number (on the Overview page)",
                "Property address where the system is installed",
                "Brief description of the issue (symptoms, when it started)",
                "Contact number for the technician to call when on the way",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#1B5E3B]/10 flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-[#1B5E3B]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Not an emergency? */}
        <Card className="border-border bg-muted/30">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">Non-urgent enquiries</p>
              <p className="text-sm text-muted-foreground">
                Prefer email? Reach our support team at{" "}
                <a
                  href={`mailto:${CLAIMS_EMAIL}`}
                  className="text-[#1B5E3B] font-medium hover:underline"
                >
                  {CLAIMS_EMAIL}
                </a>
                . We respond within one business day for non-emergency requests.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Online filing coming soon notice */}
        <p className="text-xs text-muted-foreground text-center mt-8">
          Online claim submission is coming soon. Our claims team is standing by 24/7 by phone.
        </p>
      </div>
    </PortalLayout>
  );
}
