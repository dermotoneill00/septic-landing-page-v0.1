import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-home.jpg";
import HeroEnrollCard from "@/components/HeroEnrollCard";

const trustPoints = [
  { icon: ShieldCheck, text: "25+ Years of Proven Protection" },
  { icon: Star,        text: "91% of Customers Renew Every Year" },
  { icon: RefreshCw,   text: "Nationally Underwritten. Locally Serviced." },
];

const HeroTrust = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="New England home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-center">

          {/* Left: trust copy */}
          <div className="animate-fade-in-up">
            <p className="text-accent font-semibold uppercase tracking-wider text-sm mb-4">
              New England's Most Trusted Septic Plan
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-6">
              25 Years Protecting Homeowners.{" "}
              <span className="italic text-accent">One Less Thing to Worry About.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 leading-relaxed max-w-xl">
              ProGuard is underwritten by a nationally recognized carrier and renewed by 91% of
              our customers year after year — because when something breaks, we handle it.
              Up to $25,000 in coverage. No inspection required.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-8">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-primary-foreground/80 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Mobile CTA — hidden on lg where the card is visible */}
            <div className="lg:hidden">
              <Button
                variant="cta"
                size="lg"
                className="h-14 px-10 text-lg rounded-lg"
                onClick={() => navigate("/enroll")}
              >
                Get Covered Today
              </Button>
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

export default HeroTrust;
