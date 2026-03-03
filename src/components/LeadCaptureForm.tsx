import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll be in touch shortly with your free quote.");
    setFormData({ firstName: "", lastName: "", address: "", phone: "", email: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="lead-form" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get Your Free Quote
            </h2>
            <p className="text-muted-foreground text-lg">
              Don't wait until something breaks. Lock in protection today.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-8 md:p-10 border border-border shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  className="mt-1.5 h-12"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  className="mt-1.5 h-12"
                />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="address" className="text-foreground font-medium">Address or ZIP Code</Label>
              <Input
                id="address"
                placeholder="123 Main St or 06001"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
                className="mt-1.5 h-12"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div>
                <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                  className="mt-1.5 h-12"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="mt-1.5 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cta"
              className="w-full h-14 text-lg rounded-lg mt-8"
            >
              Protect My Home — Get a Free Quote
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-secondary" /> No commitment
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-secondary" /> No inspection
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary" /> Takes less than 60 seconds
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
