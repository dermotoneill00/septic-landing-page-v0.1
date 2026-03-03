import HeroSection from "@/components/HeroSection";
import SocialProofStrip from "@/components/SocialProofStrip";
import HowItWorks from "@/components/HowItWorks";
import CoverageHighlights from "@/components/CoverageHighlights";
import UrgencyCTA from "@/components/UrgenyCTA";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SocialProofStrip />
      <HowItWorks />
      <CoverageHighlights />
      <UrgencyCTA />
      <LeadCaptureForm />
      <FAQSection />
      <Footer />
      <StickyMobileCTA />
      {/* Bottom padding on mobile for sticky CTA */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
