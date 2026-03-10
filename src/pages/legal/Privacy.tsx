import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

interface Section {
  heading: string;
  body: string | string[];
}

const sections: Section[] = [
  {
    heading: "About This Policy",
    body: "This Privacy Policy describes how Powderhorn Acquisition Company, LLC (d.b.a. ProGuard) collects, uses, and protects personal information obtained through www.ProGuardPlans.com. By using this site, you consent to the practices described here. If you do not agree with any part of this policy, please discontinue use of the site.",
  },
  {
    heading: "Information We Collect",
    body: [
      "We collect personal information through three primary channels:",
      "Voluntary submission — When you complete an application, request a quote, or submit a form, you may provide details such as your first and last name, telephone number, email address, mailing address, and payment information.",
      "Third-party sources — We may receive information about you from other individuals, such as builders, brokers, or agents who refer you to our services.",
      "Automatic collection — When you visit our site, we automatically collect technical information including IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits. On mobile devices we may also collect device identifiers and mobile network information.",
    ],
  },
  {
    heading: "Cookies and Tracking Technologies",
    body: [
      "We use cookies and similar tracking technologies (including web beacons and pixel tags) to recognise you when you return to our site, personalise your experience, and compile aggregate data about site traffic and interaction.",
      "Third-party analytics tools we use include Google Analytics and Microsoft Clarity, which may collect behavioural metrics and heatmap data. These services are governed by their own privacy policies.",
      "You may decline cookies through your browser settings; however, doing so may affect certain site functionality.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "We use the information we collect to:",
      "• Present and improve website content and functionality.",
      "• Process transactions and manage your service plan.",
      "• Provide customer support and respond to enquiries.",
      "• Send administrative communications such as confirmations and renewal notices.",
      "• Deliver marketing communications where you have consented or where permitted by law.",
      "• Compile analytics and conduct research to improve our products and services.",
    ],
  },
  {
    heading: "How We Share Your Information",
    body: [
      "We do not sell, rent, or otherwise disclose your mailing list information without your express written permission.",
      "We may share your information with:",
      "• Our subsidiaries and affiliates in connection with services we provide.",
      "• Third-party service providers engaged for claims processing, contract management, payment processing, or IT support, who are contractually bound to keep your information confidential.",
      "• Third parties for advertising preparation and placement, subject to applicable law.",
      "• Law enforcement authorities, regulatory agencies, or courts when required by law or legal process.",
      "• A buyer or successor entity in the event of a merger, acquisition, or sale of all or part of our assets, in which case we will notify users via email or a prominent notice on our site.",
    ],
  },
  {
    heading: "Your Choices",
    body: [
      "You may opt out of marketing communications at any time by:",
      "• Clicking the 'unsubscribe' link in any marketing email we send.",
      "• Emailing info@ProGuardPlans.com with your request.",
      "• Writing to us at PO Box 872, Brookfield, CT 06804.",
      "Note that even if you opt out of marketing emails, we may still send you transactional or service-related communications necessary for the administration of your account or plan.",
    ],
  },
  {
    heading: "Data Security",
    body: "We implement administrative, technical, and physical safeguards designed to protect your personal information against accidental loss and unauthorized access, use, alteration, or disclosure. However, the transmission of information via the internet is not completely secure. While we do our best to protect your information, we cannot guarantee the security of data transmitted to our site. Any transmission is at your own risk.",
  },
  {
    heading: "Data Retention",
    body: "We retain personal information for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. In many cases this means we retain records for the duration of your plan and for a reasonable period afterward to maintain accurate communication records.",
  },
  {
    heading: "Dispute Resolution",
    body: "By using this website, you agree that any dispute arising from or relating to this Privacy Policy or your use of the site shall be resolved by binding arbitration under the rules of the American Arbitration Association, governed by the laws of the State of Connecticut. Awards shall be limited to actual monetary damages.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background font-geist">
      <NavBar />

      {/* Page header */}
      <div className="bg-primary pt-28 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/60 text-sm">
            Last modified: October 1, 2025 &nbsp;·&nbsp; Powderhorn Acquisition Company, LLC d.b.a. ProGuard
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">
                {s.heading}
              </h2>
              {Array.isArray(s.body) ? (
                <div className="space-y-2">
                  {s.body.map((para, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
              )}
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">
              Contact Us
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              If you have questions about this Privacy Policy or wish to exercise any of your rights, please contact us using the details below.
            </p>
            <div className="bg-muted/40 rounded-xl p-6 text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Powderhorn Acquisition Company, LLC d.b.a. ProGuard</p>
              <p>PO Box 872, Brookfield, CT 06804</p>
              <p>
                Email:{" "}
                <a href="mailto:info@ProGuardPlans.com" className="text-primary underline-offset-2 hover:underline">
                  info@ProGuardPlans.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:8883540677" className="text-primary underline-offset-2 hover:underline">
                  (888) 354-0677
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
