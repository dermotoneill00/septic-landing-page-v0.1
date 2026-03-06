import { useState } from "react";
import { createPortal } from "react-dom";
import { EnrollmentData } from "@/types/enrollment";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
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
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const lightboxPrev = () =>
    setLightboxIdx((i) => ((i ?? 0) - 1 + DIAGRAMS.length) % DIAGRAMS.length);
  const lightboxNext = () =>
    setLightboxIdx((i) => ((i ?? 0) + 1) % DIAGRAMS.length);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white mb-1">
          What type of septic system do you have?
        </h1>
        <p className="text-white/60 text-xs max-w-lg mx-auto">
          Don't know? No worries — click any image to enlarge.
        </p>
      </div>

      {/* All 3 images side by side — click to enlarge */}
      <div className="flex gap-2">
        {DIAGRAMS.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setLightboxIdx(i)}
            className="flex-1 rounded-lg overflow-hidden border border-white/20 group relative"
          >
            <img
              src={d.src}
              alt={d.label}
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {/* Zoom hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-white/70 text-xs text-center py-1.5 bg-white/5">{d.label}</p>
          </button>
        ))}
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

      {/* Lightbox */}
      {lightboxIdx !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <div
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={DIAGRAMS[lightboxIdx].src}
                alt={DIAGRAMS[lightboxIdx].label}
                className="w-full rounded-xl shadow-2xl"
              />
              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 rounded-b-xl">
                <p className="text-white font-semibold text-base">{DIAGRAMS[lightboxIdx].label} Septic System</p>
              </div>
              {/* Close */}
              <button
                onClick={() => setLightboxIdx(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              {/* Prev */}
              <button
                onClick={lightboxPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              {/* Next */}
              <button
                onClick={lightboxNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              {/* Dot indicators */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {DIAGRAMS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === lightboxIdx ? "bg-[#F5C842]" : "bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={DIAGRAMS[i].label}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
