import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-home.jpg";
import HeroEnrollCard from "@/components/HeroEnrollCard";

const stats = [
  { value: "$8,000–$25,000", label: "Average emergency repair cost" },
  { value: "1 in 5",         label: "Homes experience septic failure" },
  { value: "0 days",         label: "Warning before most failures" },
];

const HeroFear = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Home exterior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-center">

          {/* Left: fear copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-400/30 rounded-full px-4 py-1.5 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm font-semibold">Most homeowners have no septic coverage</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Your Septic Will Fail.{" "}
              <span className="italic text-[#F5C842]">The Question Is: Are You Covered?</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
              Septic failures happen without warning and cost thousands. Homeowners insurance
              won't cover it. Generic warranties cap out fast. ProGuard pays up to{" "}
              <span className="text-[#F5C842] font-semibold">$25,000</span>, so one bad day
              doesn't become a financial disaster.
            </p>

            {/* Fear stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-[#F5C842] font-bold text-xl mb-1 leading-tight">{value}</div>
                  <div className="text-white/50 text-xs leading-tight">{label}</div>
                </div>
              ))}
            </div>

            {/* Mobile CTA — hidden on lg where the card is visible */}
            <div className="lg:hidden">
              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/30"
                onClick={() => navigate("/enroll")}
              >
                Protect My Home Now, Before It's Too Late
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

export default HeroFear;
