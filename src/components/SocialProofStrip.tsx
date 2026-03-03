import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Our septic pump failed on a holiday weekend. ProGuard had someone out the next morning — no charge.",
    name: "Karen M.",
    state: "Connecticut",
    rating: 5,
  },
  {
    quote: "I sleep better knowing I won't get a surprise $8,000 bill. Best investment we've made for our home.",
    name: "Dave R.",
    state: "Massachusetts",
    rating: 5,
  },
  {
    quote: "The signup was simple and fast. When we needed service, they delivered. Highly recommend.",
    name: "Linda S.",
    state: "New York",
    rating: 5,
  },
  {
    quote: "After our neighbor's septic disaster cost them $12K, we signed up immediately. Worth every penny.",
    name: "Tom W.",
    state: "New Jersey",
    rating: 5,
  },
];

const SocialProofStrip = () => {
  return (
    <section className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold uppercase tracking-wider text-sm mb-2">
            Trusted by Homeowners
          </p>
          <p className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            Protecting 10,000+ homeowners across the Northeast
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-star text-gold-star" />
                ))}
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4 italic">
                "{t.quote}"
              </p>
              <p className="text-accent font-semibold text-sm">
                {t.name} — {t.state}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofStrip;
