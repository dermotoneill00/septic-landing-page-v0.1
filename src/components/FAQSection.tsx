import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does a ProGuard plan cost?",
    answer: "Plans start at an affordable monthly rate that's a fraction of what a single repair would cost. The exact price depends on your coverage level and property details. Fill out the quote form above to get your personalized pricing — it takes less than 60 seconds.",
  },
  {
    question: "What exactly is covered under the plan?",
    answer: "ProGuard covers the major components of your septic system including pump failures, tank structural issues, drain field problems, emergency pump-outs, and all associated labor and parts. We cover real-world breakdowns — not cosmetic issues or pre-existing damage you already know about.",
  },
  {
    question: "How do I file a claim if something goes wrong?",
    answer: "Just call our 24/7 service line. We'll confirm your coverage, dispatch a qualified local technician, and handle the paperwork. Most claims are resolved quickly with minimal hassle on your end.",
  },
  {
    question: "Do I need a septic inspection to sign up?",
    answer: "No. Unlike many warranty providers, ProGuard does not require an upfront inspection to enroll. We believe protection should be accessible, not gated behind expensive inspections.",
  },
  {
    question: "What states do you serve?",
    answer: "ProGuard currently serves homeowners across the Northeast United States, including Connecticut, Massachusetts, New York, New Jersey, Pennsylvania, Vermont, New Hampshire, Maine, and Rhode Island. We're expanding — check with us if your state isn't listed.",
  },
  {
    question: "Is there a waiting period before coverage kicks in?",
    answer: "There is a short waiting period after enrollment for certain types of claims, which is standard in the industry. However, emergency services are available much sooner. Your specific coverage timeline will be outlined clearly when you sign up.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">
            Common Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border border-border px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
