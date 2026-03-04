import { FileText, Shield, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Get a Quote in 60 Seconds",
    description: "Fill out our simple form — no inspections, no hassle. We'll tailor a plan to your home.",
  },
  {
    icon: Shield,
    number: "02",
    title: "Choose Your Coverage Level",
    description: "Pick the plan that fits your needs and budget. Coverage starts quickly with no waiting period for most services.",
  },
  {
    icon: Phone,
    number: "03",
    title: "You're Protected",
    description: "When something goes wrong, one call is all it takes. We dispatch a local pro and cover the bill.",
  },
];

const HowItWorks = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div ref={ref} className="text-center mb-16">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">
            Simple & Straightforward
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How ProGuard Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                <step.icon className="h-7 w-7 text-secondary" />
              </div>
              <span className="text-xs font-bold text-secondary tracking-widest uppercase">
                Step {step.number}
              </span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
