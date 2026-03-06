import { useState } from "react";
import { CheckCircle2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrollmentData } from "@/types/enrollment";

const PROMO_CODES: Record<string, { label: string; discount: number }> = {
  WELCOME10: { label: "10% welcome discount", discount: 49.9 },
  SAVE50:    { label: "$50 off your first year", discount: 50 },
  NEIGHBOR:  { label: "Neighbor referral — $30 off", discount: 30 },
};

const BASE_PRICE = 499;

const FEATURES = [
  "Up to $25,000 in coverage",
  "$500 deductible",
  "1 year of coverage",
  "Annual renewal option",
];

interface Props {
  data: EnrollmentData;
  onChange: (fields: Partial<EnrollmentData>) => void;
  onProceed: () => void;
}

export default function StepPlan({ data, onChange, onProceed }: Props) {
  const [promoInput, setPromoInput] = useState(data?.promoCode || "");
  const [promoError, setPromoError] = useState("");

  const applied = data?.promoCode ? PROMO_CODES[data.promoCode] ?? null : null;
  const finalPrice = data?.finalPrice ?? 499;

  const handleApply = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      onChange({ promoCode: code, finalPrice: BASE_PRICE - PROMO_CODES[code].discount });
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Please try again.");
    }
  };

  const handleRemovePromo = () => {
    onChange({ promoCode: "", finalPrice: BASE_PRICE });
    setPromoInput("");
    setPromoError("");
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-0.5">Your ProGuard Plan</h1>
        <p className="text-white/50 text-xs">Review your coverage, then proceed to payment.</p>
      </div>

      {/* Plan card */}
      <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E7D52] to-[#1B5E3B] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.678z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">1 Year Plan</p>
              <p className="text-white/60 text-xs mt-0.5">Most popular coverage</p>
            </div>
          </div>
          <div className="text-right">
            {applied && (
              <p className="text-white/50 text-xs line-through">${BASE_PRICE}/yr</p>
            )}
            <p className="text-[#F5C842] font-bold text-lg leading-none">
              ${finalPrice.toFixed(applied ? 2 : 0)}
              <span className="text-xs font-normal text-white/60">/yr</span>
            </p>
          </div>
        </div>

        {/* Features + promo */}
        <div className="bg-white px-5 py-4 space-y-2.5">
          {FEATURES.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#1B5E3B] flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">{item}</span>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-3 mt-1">
            {applied ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-700 text-xs font-semibold">{data.promoCode} applied</p>
                    <p className="text-green-600 text-xs">{applied.label}</p>
                  </div>
                </div>
                <button onClick={handleRemovePromo} className="text-green-500 hover:text-green-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 mb-3">
                <p className="text-gray-500 text-xs font-medium">Have a promo code?</p>
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    placeholder="Enter code"
                    className="h-9 text-sm uppercase flex-1"
                  />
                  <button
                    onClick={handleApply}
                    disabled={!promoInput.trim()}
                    className="px-3 h-9 rounded-md bg-[#1B5E3B] text-white text-xs font-semibold hover:bg-[#2E7D52] disabled:opacity-40 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs">{promoError}</p>}
              </div>
            )}

            <div className="flex items-end justify-between">
              <p className="text-gray-400 text-xs">Total due today</p>
              <div className="text-right">
                {applied && (
                  <p className="text-gray-400 text-xs line-through">${BASE_PRICE}.00</p>
                )}
                <p className="text-3xl font-bold text-gray-900">
                  ${finalPrice.toFixed(applied ? 2 : 0)}
                  <span className="text-gray-400 text-sm font-normal ml-1">/year</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onProceed}
        className="w-full h-12 bg-[#F5C842] hover:bg-[#e6b93a] text-gray-900 font-bold text-base rounded-xl"
      >
        Continue to Payment →
      </Button>
    </div>
  );
}
