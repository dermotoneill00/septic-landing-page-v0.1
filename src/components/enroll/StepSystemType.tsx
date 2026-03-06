import { useState } from "react";
import { EnrollmentData } from "@/types/enrollment";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import traditionalImg from "@/assets/system-traditional.jpg";
import atuImg from "@/assets/system-atu.jpg";
import sandMoundImg from "@/assets/system-sandmound.jpg";

interface Props {
  data: EnrollmentData;
  onChange: (fields: Partial<EnrollmentData>) => void;
}

const DIAGRAMS = [
  { src: traditionalImg, label: "Traditional" },
  { src: atuImg,         label: "ATU" },
  { src: sandMoundImg,   label: "Sand Mound" },
];

const SYSTEM_TYPES = [
  {
    id: "eligible",
    label: "Yes — my septic system is a 'Traditional', 'ATU' or 'Sand Mound'",
  },
  {
    id: "cesspool",
    label: "No — my septic system is a cesspool or other non-standard system",
  },
];

export default function StepSystemType({ data, onChange }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i - 1 + DIAGRAMS.length) % DIAGRAMS.length);
  const next = () => setActiveIdx((i) => (i + 1) % DIAGRAMS.length);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-1">
          What type of septic system do you have?
        </h1>
        <p className="text-white/60 text-xs max-w-lg mx-auto">
          Don't know? No worries — ProGuard covers all common types shown below.
        </p>
      </div>

      {/* Image carousel */}
      <div className="relative rounded-xl overflow-hidden border border-white/20">
        <img
          src={DIAGRAMS[activeIdx].src}
          alt={DIAGRAMS[activeIdx].label}
          className="w-full h-44 object-cover transition-all duration-300"
        />
        {/* Label overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <p className="text-white font-semibold text-sm">{DIAGRAMS[activeIdx].label}</p>
        </div>
        {/* Prev arrow */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        {/* Next arrow */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
        {/* Dot indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {DIAGRAMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === activeIdx ? "bg-[#F5C842]" : "bg-white/40 hover:bg-white/70"
              )}
              aria-label={DIAGRAMS[i].label}
            />
          ))}
        </div>
      </div>

      {/* Selection */}
      <div className="flex flex-col gap-3">
        {SYSTEM_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange({ systemType: type.id as "eligible" | "cesspool" })}
            className={cn(
              "flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 text-left transition-all",
              data.systemType === type.id
                ? "border-[#F5C842] bg-[#F5C842]/10"
                : "border-white/30 bg-white/5 hover:border-white/60"
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                data.systemType === type.id ? "border-[#F5C842]" : "border-white/50"
              )}
            >
              {data.systemType === type.id && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5C842]" />
              )}
            </span>
            <span className="text-white text-sm leading-snug">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
