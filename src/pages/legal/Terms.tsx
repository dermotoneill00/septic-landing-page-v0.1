import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

interface Section {
  heading: string;
  body: string | string[];
}

const sections: Section[] = [
  {
    heading: "Acceptance of the Terms of Use",
    body: "Welcome to Powderhorn Agency, LLC (d.b.a. ProGuard). The site at www.ProGuardPlans.com operates under these terms. By accessing or using this website you confirm that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with either document you may not use this site.",
  },
  {
    heading: "Changes to the Terms of Use",
    body: "ProGuard reserves the right to revise these terms at any time at its sole discretion. Changes take effect immediately upon posting. Your continued use of the site after any revision constitutes your acceptance of the updated terms. We encourage you to check this page periodically for updates.",
  },
  {
    heading: "Accessing the Website and Account Security",
    body: [
      "ProGuard reserves the right to withdraw or amend this website, and any service or material provided on it, at our sole discretion without notice.",
      "You are responsible for arranging internet access to this site and for ensuring that anyone who accesses the site through your connection complies with these Terms of Use.",
      "Permitted uses include temporary RAM storage, browser caching for display purposes, and printing a single copy of any page for personal, non-commercial use.",
    ],
  },
  {
    heading: "Intellectual Property Rights",
    body: "All content on this website — including text, images, video, audio, software, design, and arrangement — is owned by ProGuard, its licensors, or other content providers and is protected by U.S. and international copyright, trademark, patent, and trade secret law. You may use the site for personal, non-commercial purposes only. You may not reproduce, distribute, modify, create derivative works from, publicly display, republish, download, store, or transmit any materials except as expressly permitted by these Terms.",
  },
  {
    heading: "Prohibited Uses",
    body: [
      "You may use the website only for lawful purposes and in accordance with these Terms. You agree not to:",
      "• Modify copies of any materials from this site or delete any copyright, trademark, or proprietary rights notices.",
      "• Exploit minors in any way.",
      "• Send unsolicited advertising or promotional material (spam).",
      "• Impersonate any person, or misrepresent your affiliation with any person or organization.",
      "• Interfere with or disrupt the integrity or performance of the website or its data.",
      "• Use any automated tool (bot, scraper, spider, etc.) to access or index the site.",
      "• Introduce viruses, trojans, worms, or other malicious or harmful code.",
      "• Attempt to gain unauthorized access to any part of the site or its related systems.",
      "• Engage in denial-of-service attacks or similar conduct.",
    ],
  },
  {
    heading: "Monitoring and Enforcement; Termination",
    body: "ProGuard has the right to take appropriate legal action for any illegal or unauthorized use of this website. The company will cooperate fully with law enforcement authorities or court orders requesting disclosure of the identity of anyone posting materials in violation of these Terms. You waive and hold harmless ProGuard from any claims resulting from such investigative actions.",
  },
  {
    heading: "Reliance on Information Posted",
    body: "The information presented on this website is made available for general informational purposes only. ProGuard makes no warranty of any kind, express or implied, as to the accuracy, completeness, or fitness for a particular purpose of any content. Any reliance you place on such information is strictly at your own risk. ProGuard disclaims all liability for third-party content and is not responsible for the accuracy of or opinions expressed in material provided by third parties.",
  },
  {
    heading: "Changes to the Website",
    body: "We may update the content on this website from time to time, but its content is not necessarily complete or up to date. We are under no obligation to update materials, and any materials may be out of date at any given time.",
  },
  {
    heading: "Information About You and Your Visits",
    body: "All information we collect on this website is subject to our Privacy Policy. By using the website you consent to all actions taken by us with respect to your information in compliance with that policy.",
  },
  {
    heading: "Linking to the Website and Social Media Features",
    body: "You may link to our homepage provided you do so in a way that is fair, legal, and does not damage our reputation or suggest any form of association, approval, or endorsement by ProGuard without our express written consent. We reserve the right to withdraw linking permission at any time without notice. Social media features on this site may be disabled by us at any time.",
  },
  {
    heading: "Links from the Website",
    body: "Links to third-party websites are provided for your convenience only. ProGuard has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.",
  },
  {
    heading: "Geographic Restrictions",
    body: "ProGuard is based in the State of Connecticut and provides this website for use by persons located in the United States. We make no claims that the website or any of its content is accessible or appropriate outside of the United States. Access from other countries is at your own risk and you are responsible for compliance with local laws.",
  },
  {
    heading: "Disclaimer of Warranties",
    body: "YOU UNDERSTAND THAT WE CANNOT AND DO NOT GUARANTEE OR WARRANT THAT FILES AVAILABLE FOR DOWNLOADING FROM THE INTERNET OR THE WEBSITE WILL BE FREE OF VIRUSES OR OTHER DESTRUCTIVE CODE. THE WEBSITE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.",
  },
  {
    heading: "Limitation of Liability",
    body: "IN NO EVENT WILL PROGUARD, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOST PROFITS, REVENUE, BUSINESS, GOODWILL, OR DATA — ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THIS WEBSITE OR ANY CONTENT OBTAINED THROUGH IT. THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.",
  },
  {
    heading: "Indemnification",
    body: "You agree to defend, indemnify, and hold harmless ProGuard, its affiliates, licensors, service providers, officers, directors, employees, agents, and successors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Use or your use of the website.",
  },
  {
    heading: "Governing Law and Jurisdiction",
    body: "All matters relating to this website and these Terms of Use shall be governed by and construed in accordance with the laws of the State of Connecticut, without giving effect to any choice or conflict of law provision. Any legal suit, action, or proceeding arising out of, or related to, these Terms shall be instituted exclusively in the federal courts of the United States or the courts of the State of Connecticut, in each case located in Fairfield County. ProGuard retains the right to bring any suit in the country of your residence. You waive any and all objections to the exercise of jurisdiction by such courts.",
  },
  {
    heading: "Waiver and Severability",
    body: "No waiver by ProGuard of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or any other term. If any provision of these Terms is held invalid or unenforceable, such provision shall be eliminated to the minimum extent necessary and the remaining provisions shall continue in full force and effect.",
  },
  {
    heading: "Entire Agreement",
    body: "These Terms of Use and our Privacy Policy constitute the sole and entire agreement between you and ProGuard regarding the website and supersede all prior and contemporaneous understandings, agreements, representations, and warranties with respect to the website.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background font-geist">
      <NavBar />

      {/* Page header */}
      <div className="bg-primary pt-28 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
            Terms of Use
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
              Contact Information
            </h2>
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

export default Terms;
