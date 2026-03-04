import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import pricingImage from "@/assets/pricing-home.jpg";

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={pricingImage}
          alt="Charming New England farmhouse at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-4">
          Comprehensive Protection
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-2xl mx-auto">
          Up to $25,000 in Septic System Coverage
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Plans designed to fit your budget. No inspections required, no long
          forms, and coverage starts quickly for most services. Fully underwritten
          by a nationally recognized carrier.
        </p>
        <Button
          variant="cta"
          size="lg"
          className="h-14 px-10 text-lg rounded-lg"
          onClick={() => navigate("/enroll")}
        >
          See Plans &amp; Get Your Quote
        </Button>
      </div>
    </section>
  );
};

export default PricingSection;
