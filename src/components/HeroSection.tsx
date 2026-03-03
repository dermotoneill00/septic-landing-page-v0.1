import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const trustBadges = [
  "No Inspection Required",
  "Coverage Starts Fast",
  "Local Service Pros",
];

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful New England home with lush green yard"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-accent font-semibold tracking-wide uppercase text-sm">
              ProGuard Plans
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            One Unexpected Repair Shouldn't Cost You{" "}
            <span className="italic text-accent">Thousands</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 leading-relaxed max-w-xl">
            ProGuard's Septic Protection Plan covers parts, labor, and pump-outs
            — so you never get blindsided.
          </p>

          <Button
            variant="cta"
            size="lg"
            className="h-14 px-10 text-lg rounded-lg"
            onClick={scrollToForm}
          >
            Get My Free Quote
          </Button>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 bg-trust-badge/20 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-primary-foreground/90 font-medium">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
