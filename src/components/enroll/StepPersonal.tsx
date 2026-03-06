import { EnrollmentData } from "@/types/enrollment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Star, Zap } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

interface Props {
  data: EnrollmentData;
  onChange: (fields: Partial<EnrollmentData>) => void;
  compact?: boolean;
}

const trustBadges = [
  { icon: ShieldCheck, text: "Up to $25,000 coverage" },
  { icon: Star,        text: "91% renewal rate" },
  { icon: Zap,         text: "No inspection required" },
];

export default function StepPersonal({ data, onChange, compact = false }: Props) {
  return (
    <div className="space-y-6">
      {!compact && (
        <>
          {/* Hero image strip with overlay */}
          <div className="relative rounded-2xl overflow-hidden h-36 sm:h-44 mb-6 -mx-1">
            <img
              src={heroImage}
              alt="Protected New England home"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E3B]/95 via-[#1B5E3B]/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-snug">
                Septic system failures are{" "}
                <span className="text-[#F5C842]">disruptive and costly</span>
              </h1>
              <p className="text-white/70 italic text-sm">Let's get you covered in minutes</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-2">
            {trustBadges.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5"
              >
                <Icon className="h-3.5 w-3.5 text-[#F5C842]" />
                <span className="text-white/80 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {compact && (
        <div className="mb-2">
          <p className="text-white/60 text-sm">Start with your contact details</p>
        </div>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm font-medium">First Name</Label>
          <Input
            placeholder="First Name"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm font-medium">Last Name</Label>
          <Input
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm font-medium">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm font-medium">Phone</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg bg-white/90 text-gray-500 text-sm border-r border-gray-200 h-12">
              +1
            </span>
            <Input
              type="tel"
              placeholder="Phone"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-12 rounded-l-none rounded-r-lg flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
