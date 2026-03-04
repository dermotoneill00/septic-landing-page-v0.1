import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UrgencyCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4 max-w-2xl mx-auto">
          Septic failures can cost $5,000 to $25,000+ to repair. Don't wait until something breaks.
        </h2>
        <p className="text-primary-foreground/75 mb-8 max-w-lg mx-auto">
          Most homeowners don't think about their septic system until it fails.
          ProGuard's coverage means one breakdown doesn't become a financial disaster.
        </p>
        <Button
          variant="cta"
          size="lg"
          className="h-14 px-10 text-lg rounded-lg"
          onClick={() => navigate("/enroll")}
        >
          Get Protected Now
        </Button>
      </div>
    </section>
  );
};

export default UrgencyCTA;
