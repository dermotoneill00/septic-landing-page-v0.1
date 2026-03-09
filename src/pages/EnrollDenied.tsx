import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.png";

export default function EnrollDenied() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reason = params.get("reason");

  const isCesspool = reason === "cesspool";

  return (
    <div className="min-h-screen bg-[#1B5E3B] flex flex-col items-center justify-center px-4 text-center">
      <img src={logoWhite} alt="ProGuard Plans" className="h-10 mb-10" />

      <div className="max-w-md">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-9 h-9 text-[#F5C842]" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {isCesspool
            ? "We're sorry, cesspools aren't covered"
            : "We don't currently serve your area"}
        </h1>

        <p className="text-white/70 leading-relaxed mb-8">
          {isCesspool
            ? "ProGuard Plans covers traditional, ATU, and sand mound septic systems. Unfortunately, cesspools and non-standard systems are not eligible for coverage at this time."
            : "ProGuard Plans currently serves homeowners in MA, CT, NY, NJ, PA, DE, MD, VA, RI, NH, ME, and VT. We're working hard to expand. Check back soon!"}
        </p>

        <Button
          onClick={() => navigate("/")}
          className="bg-[#F5C842] hover:bg-[#e6b93a] text-gray-900 font-bold px-8 h-12 rounded-xl"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
