import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const UrgencyCTA = () => {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4 max-w-2xl mx-auto">
          The average septic repair costs $3,000–$7,000. Don't wait until something breaks.
        </h2>
        <p className="text-primary-foreground/75 mb-8 max-w-lg mx-auto">
          Most homeowners don't think about their septic system until it fails.
          ProGuard gives you peace of mind for pennies a day.
        </p>
        <Button
          variant="cta"
          size="lg"
          className="h-14 px-10 text-lg rounded-lg"
          onClick={scrollToForm}
        >
          Get Protected Now
        </Button>
      </div>
    </section>
  );
};

export default UrgencyCTA;
