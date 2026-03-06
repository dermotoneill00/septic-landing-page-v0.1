import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const STEP_LABELS = [
  "Your Details",
  "Property Address",
  "System Age",
  "System Type",
  "Maintenance",
  "Select Plan",
  "Payment",
];

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
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_content: data.utm_content || null,
    status,
  });
}

export default function HeroEnrollCard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<EnrollmentData>(defaultEnrollmentData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setData((d) => ({
      ...d,
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
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleProceed = () => setStep(7);

  const handleComplete = async () => {
    setIsSubmitting(true);
    await saveLead(data, "submitted");
    await supabase.functions.invoke("invite-user", { body: { email: data.email } });
    setIsSubmitting(false);
    navigate("/enroll/success", { state: { data } });
  };

  const ok = canProceed(step, data);

  return (
    <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-md bg-gradient-to-b from-[#1B5E3B]/85 to-[#0d3320]/90">
      {/* Card heading */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10">
        <p className="text-[#F5C842] text-xs font-semibold uppercase tracking-widest mb-0.5">Free Quote — No Inspection Required</p>
        <h2 className="text-white text-lg font-bold leading-snug">Get covered in 2 minutes</h2>
      </div>

      {/* Progress header */}
      <div className="px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 font-medium text-sm">{STEP_LABELS[step - 1]}</span>
          <span className="text-white/40 text-xs">Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-[#F5C842]" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-2 overflow-y-auto max-h-[480px]">
        {step === 1 && <StepPersonal data={data} onChange={handleChange} compact />}
        {step === 2 && <StepAddress data={data} onChange={handleChange} />}
        {step === 3 && <StepSystemAge data={data} onChange={handleChange} />}
        {step === 4 && <StepSystemType data={data} onChange={handleChange} />}
        {step === 5 && <StepMaintenance data={data} onChange={handleChange} />}
        {step === 6 && <StepPlan data={data} onChange={handleChange} onProceed={handleProceed} />}
        {step === 7 && <StepPayment data={data} onComplete={handleComplete} isSubmitting={isSubmitting} />}
      </div>

      {/* Navigation — steps 1–5 only */}
      {step < 6 && (
        <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-[#F5C842] hover:text-[#F5C842] hover:bg-[#F5C842]/10 font-semibold disabled:opacity-0 px-3"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!ok}
            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-semibold px-6 h-10 rounded-lg"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Back only for steps 6–7 */}
      {step >= 6 && (
        <div className="px-5 pb-5 pt-3 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-[#F5C842] hover:text-[#F5C842] hover:bg-[#F5C842]/10 font-semibold px-3"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
