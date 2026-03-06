import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-home.jpg";
import HeroEnrollCard from "@/components/HeroEnrollCard";

const trustBadges = [
  "No Inspection Required",
  "Coverage Starts Fast",
  "Local Service Pros",
];

const HeroSection = () => {
  const navigate = useNavigate();

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
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-center">

          {/* Left: hero copy */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-6">
              One Septic Failure Can Cost You $25,000.{" "}
              <span className="italic text-accent">Are You Protected?</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 leading-relaxed max-w-xl">
              ProGuard covers septic system repairs, replacement, and emergency
              service — backed by 25+ years of trusted protection and underwritten
              by a nationally recognized carrier.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
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

            {/* Mobile CTA — hidden on lg where the card is visible */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:hidden">
              <Button
                variant="cta"
                size="lg"
                className="h-14 px-10 text-lg rounded-lg"
                onClick={() => navigate("/enroll")}
              >
                Get My Free Quote
              </Button>
              <p className="text-primary-foreground/70 text-sm">
                Up to{" "}
                <span className="text-accent font-semibold text-base">$25,000</span>
                {" "}in coverage · Cancel anytime
              </p>
            </div>
          </div>

          {/* Right: inline enrollment card */}
          <div className="animate-fade-in-up">
            <HeroEnrollCard />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
