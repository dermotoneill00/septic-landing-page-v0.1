import { useState } from "react";
import { CreditCard, Lock, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EnrollmentData } from "@/types/enrollment";

interface Props {
  data: EnrollmentData;
  onComplete: () => void;
  isSubmitting?: boolean;
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function StepPayment({ data, onComplete, isSubmitting }: Props) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingZip, setBillingZip] = useState(data.zip || "");

  const canSubmit = cardName.trim() && cardNumber.replace(/\s/g, "").length === 16
    && expiry.length === 5 && cvv.length >= 3 && billingZip.length === 5;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-0.5">Payment Details</h1>
        <p className="text-white/50 text-xs">Your information is encrypted and secure.</p>
      </div>

      {/* Test mode banner */}
      <div className="flex items-center gap-2.5 bg-amber-400/15 border border-amber-400/40 rounded-xl px-4 py-2.5">
        <FlaskConical className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-amber-300 text-xs font-semibold">Test mode. No real charges.</p>
          <p className="text-amber-300/70 text-xs">Use card: 4242 4242 4242 4242 · Any future date · Any CVV</p>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">ProGuard 1-Year Plan</p>
          <p className="text-white/50 text-xs">{data.street}, {data.city} {data.state}</p>
        </div>
        <div className="text-right">
          {data.promoCode && (
            <p className="text-white/40 text-xs line-through">$499.00</p>
          )}
          <p className="text-[#F5C842] font-bold text-base">
            ${data.finalPrice.toFixed(data.promoCode ? 2 : 0)}/yr
          </p>
        </div>
      </div>

      {/* Payment form */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-white/70 text-xs font-medium">Cardholder Name</Label>
          <Input
            placeholder="Name on card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-11"
            autoComplete="cc-name"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/70 text-xs font-medium">Card Number</Label>
          <div className="relative">
            <Input
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-11 pr-10"
              autoComplete="cc-number"
              inputMode="numeric"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Expiry</Label>
            <Input
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-11"
              autoComplete="cc-exp"
              inputMode="numeric"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">CVV</Label>
            <Input
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-11"
              autoComplete="cc-csc"
              inputMode="numeric"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Billing ZIP</Label>
            <Input
              placeholder="ZIP"
              value={billingZip}
              onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-11"
              autoComplete="postal-code"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onComplete}
        disabled={!canSubmit || isSubmitting}
        className="w-full h-12 bg-[#F5C842] hover:bg-[#e6b93a] text-gray-900 font-bold text-base rounded-xl disabled:opacity-40"
      >
        <Lock className="w-4 h-4 mr-2" />
        {isSubmitting ? "Submitting..." : `Complete Enrollment · $${data.finalPrice.toFixed(data.promoCode ? 2 : 0)}`}
      </Button>

      <p className="text-center text-white/30 text-xs flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        256-bit SSL encryption · Stripe integration coming soon
      </p>
    </div>
  );
}
