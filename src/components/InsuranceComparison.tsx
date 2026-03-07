import { X, Check, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Status = "yes" | "no" | "partial";

interface Row {
  feature: string;
  proguard: { status: Status; text: string };
  homeowners: { status: Status; text: string };
  competitors: { status: Status; text: string };
}

const rows: Row[] = [
  {
    feature: "Septic system coverage",
    proguard:    { status: "yes",     text: "Purpose-built for septic" },
    homeowners:  { status: "no",      text: "Typically excluded" },
    competitors: { status: "partial", text: "Limited or capped" },
  },
  {
    feature: "Leach field coverage",
    proguard:    { status: "yes",     text: "Full leach field coverage" },
    homeowners:  { status: "no",      text: "Not covered" },
    competitors: { status: "no",      text: "Rarely included" },
  },
  {
    feature: "Wear & tear / system failure",
    proguard:    { status: "yes",     text: "Covers wear, tear & failure" },
    homeowners:  { status: "no",      text: "Sudden events only" },
    competitors: { status: "partial", text: "Sometimes covered" },
  },
  {
    feature: "Septic specialist network",
    proguard:    { status: "yes",     text: "Vetted septic pros only" },
    homeowners:  { status: "no",      text: "No septic expertise" },
    competitors: { status: "no",      text: "General contractors" },
  },
  {
    feature: "Coverage limit",
    proguard:    { status: "yes",     text: "Up to $25,000" },
    homeowners:  { status: "no",      text: "Zero septic coverage" },
    competitors: { status: "partial", text: "$500–$2,000 caps typical" },
  },
  {
    feature: "No inspection required",
    proguard:    { status: "yes",     text: "Sign up in minutes" },
    homeowners:  { status: "partial", text: "N/A" },
    competitors: { status: "no",      text: "Inspection often required" },
  },
];

function Cell({ status, text }: { status: Status; text: string }) {
  const icon =
    status === "yes" ? (
      <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
    ) : status === "no" ? (
      <X className="h-4 w-4 text-destructive/60 shrink-0 mt-0.5" />
    ) : (
      <Minus className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
    );

  return (
    <div className="flex items-start gap-2 px-4 py-3">
      {icon}
      <span className="text-xs sm:text-sm leading-snug">{text}</span>
    </div>
  );
}

const InsuranceComparison = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">
            Did You Know?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto mb-3">
            Most Homeowners Have Zero Septic Protection
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Homeowners insurance won't cover it. Generic warranties cap out fast.
            ProGuard is the only plan built from the ground up for septic systems.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-2 mb-2 px-2 min-w-[560px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 pl-2">
              Feature
            </div>
            <div className="text-center bg-green-50 rounded-t-xl pt-3 pb-2 border border-b-0 border-green-200">
              <span className="text-sm font-bold uppercase tracking-wider text-secondary">
                ProGuard
              </span>
            </div>
            <div className="text-center bg-red-50 rounded-t-xl pt-3 pb-2 border border-b-0 border-red-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Homeowners Ins.
              </span>
            </div>
            <div className="text-center bg-red-50 rounded-t-xl pt-3 pb-2 border border-b-0 border-red-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Other Warranties
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-1.5 min-w-[560px]">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden border border-border"
              >
                {/* Feature label */}
                <div className="flex items-center px-4 py-3 bg-muted/20">
                  <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                    {row.feature}
                  </span>
                </div>
                {/* ProGuard */}
                <div className="bg-green-50 border-l-2 border-green-300 font-medium text-foreground">
                  <Cell status={row.proguard.status} text={row.proguard.text} />
                </div>
                {/* Homeowners */}
                <div className="bg-red-50/60 text-muted-foreground">
                  <Cell status={row.homeowners.status} text={row.homeowners.text} />
                </div>
                {/* Competitors */}
                <div className="bg-red-50/60 text-muted-foreground">
                  <Cell status={row.competitors.status} text={row.competitors.text} />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-5 px-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-secondary" /> Covered
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="h-3.5 w-3.5 text-amber-500" /> Partial / limited
            </span>
            <span className="flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-destructive/60" /> Not covered
            </span>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            variant="cta"
            size="lg"
            className="h-13 px-10 text-base rounded-lg"
            onClick={() => navigate("/enroll")}
          >
            Get ProGuard Coverage Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsuranceComparison;
