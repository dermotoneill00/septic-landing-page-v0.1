import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import SocialProofStrip from "@/components/SocialProofStrip";
import HowItWorks from "@/components/HowItWorks";
import CoverageHighlights from "@/components/CoverageHighlights";
import PricingSection from "@/components/PricingSection";
import UrgencyCTA from "@/components/UrgencyCTA";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import InsuranceComparison from "@/components/InsuranceComparison";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ChatWidget } from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <SocialProofStrip />
      <HowItWorks />
      <InsuranceComparison />
      <CoverageHighlights />
      <PricingSection />
      <UrgencyCTA />
      <LeadCaptureForm />
      <FAQSection />
      <Footer />
      <StickyMobileCTA />
      {/* Bottom padding on mobile for sticky CTA */}
      <div className="h-16 md:hidden" />
      <ChatWidget />
    </div>
  );
};

export default Index;
