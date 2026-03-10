import { useState } from "react";
import { ChevronDown } from "lucide-react";
import NavBar from "@/components/NavBar";
import HeroTrust from "@/components/HeroTrust";
import SocialProofStrip from "@/components/SocialProofStrip";
import InsuranceComparison from "@/components/InsuranceComparison";
import HowItWorks from "@/components/HowItWorks";
import CoverageHighlights from "@/components/CoverageHighlights";
import PricingSection from "@/components/PricingSection";
import UrgencyCTA from "@/components/UrgencyCTA";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

// A/B variant: yellow enrollment card
const LPTrustB = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroTrust variant="yellow" />

      {/* Toggle button */}
      <div className="flex justify-center py-3 bg-background">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-lg font-semibold text-primary/70 hover:text-primary tracking-wide transition-colors duration-200"
        >
          <span>{expanded ? "Show less" : "Click Here to Read More"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out [&_section]:py-12 [&_section]:lg:py-16 ${
          expanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <InsuranceComparison />
        <HowItWorks />
        <CoverageHighlights />
        <PricingSection />
        <UrgencyCTA />
        <LeadCaptureForm />
        <SocialProofStrip />
        <FAQSection />
      </div>

      <Footer />
      <StickyMobileCTA />
      <div className="h-24 md:hidden" />
    </div>
  );
};

export default LPTrustB;
