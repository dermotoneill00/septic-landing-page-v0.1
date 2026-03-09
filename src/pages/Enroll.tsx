import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.png";
import { EnrollmentData, defaultEnrollmentData, COVERED_STATES } from "@/types/enrollment";
import { supabase } from "@/lib/supabase";
import StepPersonal from "@/components/enroll/StepPersonal";
import StepAddress from "@/components/enroll/StepAddress";
import StepSystemAge from "@/components/enroll/StepSystemAge";
import StepSystemType from "@/components/enroll/StepSystemType";
import StepMaintenance from "@/components/enroll/StepMaintenance";
import StepPlan from "@/components/enroll/StepPlan";
import StepPayment from "@/components/enroll/StepPayment";

const TOTAL_STEPS = 7;

function canProceed(step: number, data: EnrollmentData): boolean {
  switch (step) {
    case 1: return !!(data.firstName && data.lastName && data.email && data.phone);
    case 2: return !!(data.street && data.city && data.state && data.zip);
    case 3: return !!data.installedPastYear;
    case 4: return !!data.systemType;
    case 5: return !!(data.maintainsSystem && data.bedrooms && data.occupants);
    default: return true;
  }
}

async function saveLead(data: EnrollmentData, status = "submitted") {
  await supabase.from("leads").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    street: data.street,
    city: data.city,
    state: data.state,
    zip: data.zip,
    installed_past_year: data.installedPastYear,
    system_type: data.systemType,
    maintains_system: data.maintainsSystem,
    maintenance_frequency: data.maintenanceFrequency,
    bedrooms: data.bedrooms,
    occupants: data.occupants,
    promo_code: data.promoCode || null,
    final_price: data.finalPrice,
    referral_code: data.referralCode || null,
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_content: data.utm_content || null,
    status,
  });
}

export default function Enroll() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<EnrollmentData>(defaultEnrollmentData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setData((d) => ({
      ...d,
      referralCode: params.get("ref") || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
    }));
  }, []);

  const handleChange = (fields: Partial<EnrollmentData>) => {
    setData((d) => ({ ...d, ...fields }));
  };

  const handleNext = () => {
    if (step === 2 && !COVERED_STATES.includes(data.state)) {
      saveLead(data, "denied_state");
      navigate("/enroll/denied?reason=state");
      return;
    }
    if (step === 4 && data.systemType === "cesspool") {
      saveLead(data, "denied_cesspool");
      navigate("/enroll/denied?reason=cesspool");
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
  };

  const handleProceed = () => {
    setStep(7);
    window.scrollTo(0, 0);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    await saveLead(data, "submitted");
    await supabase.functions.invoke("invite-user", { body: { email: data.email } });
    setIsSubmitting(false);
    navigate("/enroll/success", { state: { data } });
  };

  const ok = canProceed(step, data);

  return (
    <div className="min-h-screen bg-[#1B5E3B] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center pt-8 pb-4 px-4">
        <img src={logoWhite} alt="ProGuard Plans" className="h-10" />
      </header>

      {/* Referral banner */}
      {data.referralCode && (
        <div className="px-4 max-w-2xl mx-auto w-full">
          <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white/90 text-sm text-center">
            You were referred by a ProGuard member. Welcome!
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-4 pb-2 max-w-2xl mx-auto w-full mt-2">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-[#F5C842]" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="text-white/40 text-xs mt-2 text-right">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Step content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-6 max-w-2xl mx-auto w-full">
        {step === 1 && <StepPersonal data={data} onChange={handleChange} />}
        {step === 2 && <StepAddress data={data} onChange={handleChange} />}
        {step === 3 && <StepSystemAge data={data} onChange={handleChange} />}
        {step === 4 && <StepSystemType data={data} onChange={handleChange} />}
        {step === 5 && <StepMaintenance data={data} onChange={handleChange} />}
        {step === 6 && <StepPlan data={data} onChange={handleChange} onProceed={handleProceed} />}
        {step === 7 && <StepPayment data={data} onComplete={handleComplete} isSubmitting={isSubmitting} />}
      </main>

      {/* Navigation */}
      {step < 6 && (
        <footer className="px-4 pb-10 pt-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-[#F5C842] text-[#F5C842] bg-transparent hover:bg-[#F5C842]/10 font-semibold px-6 h-11"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!ok}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-semibold px-8 h-11 rounded-lg"
            >
              Next
            </Button>
          </div>
        </footer>
      )}

      {step >= 6 && (
        <footer className="px-4 pb-10 pt-4 max-w-2xl mx-auto w-full">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-[#F5C842] text-[#F5C842] bg-transparent hover:bg-[#F5C842]/10 font-semibold px-6 h-11"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </footer>
      )}
    </div>
  );
}
