import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StickyMobileCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pt-3 pb-4 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <Button
        variant="cta"
        className="w-full h-12 text-base rounded-lg"
        onClick={() => navigate("/enroll")}
      >
        Get My Free Quote
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Or call{" "}
        <a href="tel:8883540677" className="font-semibold text-primary underline-offset-2 hover:underline">
          (888) 354-0677
        </a>
        {" "}· Mon–Fri 8am–6pm EST
      </p>
    </div>
  );
};

export default StickyMobileCTA;
