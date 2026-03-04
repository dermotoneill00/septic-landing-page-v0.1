import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import coverageImage from "@/assets/coverage-home.jpg";
import technicianImage from "@/assets/technician-work.jpg";

const covered = [
  "Tank & Distribution Box Repair/Replacement",
  "Leach Field Repair & Replacement",
  "Associated Labor Costs",
  "Emergency Main Line / Wastewater Pipe Pump",
  "New Parts, Pipes & Components",
  "Transferable to New Homeowner",
];

const notCovered = [
  "Pre-existing known damage",
  "Cosmetic landscaping restoration",
  "Code violation upgrades",
  "Intentional misuse or neglect",
  "Cesspools & non-standard systems",
];

const CoverageHighlights = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28 bg-section-alt">
      <div className="container mx-auto px-4">
        <div ref={ref} className="text-center mb-16">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">
            Comprehensive Protection
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What's Covered Under ProGuard
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            No guesswork. No surprises. Here's exactly what your plan includes.
          </p>
        </div>

        {/* Image banner */}
        <div className="max-w-5xl mx-auto mb-12 grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={coverageImage}
            alt="Beautiful New England colonial home with autumn foliage"
            className="w-full h-64 md:h-72 object-cover"
          />
          <img
            src={technicianImage}
            alt="Service technician inspecting septic equipment"
            className="w-full h-64 md:h-72 object-cover"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Covered */}
          <div className="bg-background rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center">
                <Check className="h-4 w-4 text-secondary" />
              </span>
              What's Covered
            </h3>
            <ul className="space-y-4">
              {covered.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Covered */}
          <div className="bg-background rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
                <X className="h-4 w-4 text-destructive" />
              </span>
              What's Not Covered
            </h3>
            <ul className="space-y-4">
              {notCovered.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="h-5 w-5 text-destructive/60 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Questions about coverage? Call us — we're happy to walk you through everything.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="cta" size="lg" className="h-14 px-10 text-lg rounded-lg" onClick={scrollToForm}>
            Protect My Home Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoverageHighlights;
