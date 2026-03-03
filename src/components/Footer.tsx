import { Shield, Phone } from "lucide-react";

const serviceStates = [
  "Connecticut", "Massachusetts", "New York", "New Jersey",
  "Pennsylvania", "Vermont", "New Hampshire", "Maine", "Rhode Island",
];

const Footer = () => {
  return (
    <footer className="bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-accent" />
              <span className="font-display text-xl font-bold text-primary-foreground">
                ProGuard Plans
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Affordable septic system protection for homeowners across the
              Northeast. No inspections. No hassle. Just peace of mind.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-base">Contact</h4>
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
              <Phone className="h-4 w-4" />
              <span>(888) 555-GUARD</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              Mon–Fri 8am–6pm EST<br />
              24/7 Emergency Service Line
            </p>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-base">Service Area</h4>
            <div className="flex flex-wrap gap-2">
              {serviceStates.map((state) => (
                <span
                  key={state}
                  className="text-xs bg-primary-foreground/10 text-primary-foreground/80 rounded-full px-3 py-1"
                >
                  {state}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} ProGuard Plans. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
