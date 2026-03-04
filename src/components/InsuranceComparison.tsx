import { X, Check } from "lucide-react";
import coverageImage from "@/assets/coverage-home.jpg";

const rows = [
  {
    insurance: "Typically excludes septic systems",
    proguard: "Purpose-built for septic coverage",
  },
  {
    insurance: "Covers sudden events only",
    proguard: "Covers wear, tear, and system failure",
  },
  {
    insurance: "High deductibles on claims",
    proguard: "Affordable annual plans",
  },
  {
    insurance: "No septic expertise on staff",
    proguard: "Vetted network of septic pros",
  },
  {
    insurance: "Won't cover aging infrastructure",
    proguard: "Up to $25,000 in protection",
  },
];

const InsuranceComparison = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">
            Did You Know?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto">
            Your Homeowners Insurance Probably Doesn't Cover Your Septic System
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto items-center">
          {/* Comparison Table */}
          <div className="lg:col-span-3">
            {/* Column headers */}
            <div className="grid grid-cols-2 gap-4 mb-4 px-4">
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Homeowners Insurance
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
                  ProGuard
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-4 rounded-xl overflow-hidden border border-border"
                >
                  <div className="flex items-start gap-3 bg-muted/40 px-5 py-4">
                    <X className="h-4 w-4 text-destructive/60 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{row.insurance}</span>
                  </div>
                  <div className="flex items-start gap-3 bg-secondary/5 px-5 py-4">
                    <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground font-medium">{row.proguard}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Image */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={coverageImage}
                alt="Well-maintained New England home"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceComparison;
