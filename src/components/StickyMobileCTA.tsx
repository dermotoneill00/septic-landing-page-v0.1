import { Button } from "@/components/ui/button";

const StickyMobileCTA = () => {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <Button
        variant="cta"
        className="w-full h-12 text-base rounded-lg"
        onClick={scrollToForm}
      >
        Get My Free Quote
      </Button>
    </div>
  );
};

export default StickyMobileCTA;
