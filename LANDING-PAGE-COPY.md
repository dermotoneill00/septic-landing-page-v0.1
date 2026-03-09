# ProGuard Landing Page — Copy & Structure Reference

> Use this document to rebuild the landing page in any context (WordPress/Elementor, new session, etc.)
> All copy, section order, and content structure is captured below.

---

## Page Structure (Section Order)

1. NavBar (sticky header)
2. Hero Section (3 variants)
3. Social Proof Strip (testimonials)
4. How It Works (3 steps)
5. Insurance Comparison Table
6. Coverage Highlights (covered / not covered)
7. Pricing Section
8. Urgency CTA
9. Lead Capture Form
10. FAQ Accordion
11. Footer
12. Sticky Mobile CTA (mobile only, fixed bottom)
13. Chat Widget (floating bottom-right)

---

## 1. NavBar

- **Logo**: ProGuard Plans (white on transparent background, dark green when scrolled)
- **CTA Button** (appears on scroll): "Get a Free Quote" → links to `/enroll`
- Behavior: transparent at top, white background with backdrop blur on scroll

---

## 2. Hero Section

### Variant A — Default (Index page `/`)

- **Headline**: One Septic Failure Can Cost You $25,000. *Are You Protected?*
- **Subheadline**: ProGuard covers septic system repairs, replacement, and emergency service — backed by 25+ years of trusted protection and underwritten by a nationally recognized carrier.
- **Trust Badges** (3 pill badges):
  - No Inspection Required
  - Coverage Starts Fast
  - Local Service Pros
- **Mobile CTA Button**: "Get My Free Quote"
- **Sub-CTA text**: Up to $25,000 in coverage · Cancel anytime
- **Desktop**: Inline enrollment card (right side) — see "Hero Enrollment Card" section below
- **Background**: Hero home image with green gradient overlay

### Variant B — Fear-focused (`/lp/fear`)

- **Alert Badge**: "Most homeowners have no septic coverage" (red, with warning icon)
- **Headline**: Your Septic Will Fail. *The Question Is — Are You Covered?*
- **Subheadline**: Septic failures happen without warning and cost thousands. Homeowners insurance won't cover it. Generic warranties cap out fast. ProGuard pays up to $25,000 — so one bad day doesn't become a financial disaster.
- **Stat Cards** (3 cards):
  - $8,000–$25,000 — Average emergency repair cost
  - 1 in 5 — Homes experience septic failure
  - 0 days — Warning before most failures
- **Mobile CTA Button**: "Protect My Home Now — Before It's Too Late" (red button)

### Variant C — Trust-focused (`/lp/trust`)

- **Accent Text**: New England's Most Trusted Septic Plan
- **Headline**: 25 Years Protecting Homeowners. *One Less Thing to Worry About.*
- **Subheadline**: ProGuard is underwritten by a nationally recognized carrier and renewed by 91% of our customers year after year — because when something breaks, we handle it. Up to $25,000 in coverage. No inspection required.
- **Trust Points** (3 with icons):
  - 25+ Years of Proven Protection (shield icon)
  - 91% of Customers Renew Every Year (star icon)
  - Nationally Underwritten. Locally Serviced. (refresh icon)
- **Mobile CTA Button**: "Get Covered Today"

### Hero Enrollment Card (shown on desktop, all variants)

- **Badge**: Free Quote — No Inspection Required
- **Heading**: Get covered in 2 minutes
- **Progress bar**: Step X of 7
- **Step labels**: Your Details → Property Address → System Age → System Type → Maintenance → Select Plan → Payment
- **Validation**: Checks state coverage and cesspool denial
- **On complete**: Saves lead to Supabase, invokes invite-user edge function, redirects to success page

---

## 3. Social Proof Strip

- **Section Label**: Trusted by Homeowners
- **Heading**: 25+ Years Protecting Homeowners Across the Northeast
- **Subheading**: 91% of our customers renew their plans year after year.
- **Background**: Dark green (brand primary)

### Testimonials (4 cards, all 5-star)

1. **Karen M. — Connecticut**
   "Our septic pump failed on a holiday weekend. ProGuard had someone out the next morning — no charge."

2. **Dave R. — Massachusetts**
   "I sleep better knowing I won't get a surprise $8,000 bill. Best investment we've made for our home."

3. **Linda S. — New York**
   "The signup was simple and fast. When we needed service, they delivered. Highly recommend."

4. **Tom W. — New Jersey**
   "After our neighbor's septic disaster cost them $12K, we signed up immediately. Worth every penny."

> ⚠️ TODO: Replace with verified testimonials from proguardplans.com

---

## 4. How It Works

- **Section Label**: Simple & Straightforward
- **Heading**: How ProGuard Works

### Steps

| Step | Title | Description |
|------|-------|-------------|
| 01 | Get a Quote in 60 Seconds | Fill out our simple form — no inspections, no hassle. We'll tailor a plan to your home. |
| 02 | Choose Your Coverage Level | Pick the plan that fits your needs and budget. Coverage starts quickly with no waiting period for most services. |
| 03 | You're Protected | When something goes wrong, one call is all it takes. We dispatch a local pro and cover the bill. |

---

## 5. Insurance Comparison Table

- **Section Label**: Did You Know?
- **Heading**: Most Homeowners Have Zero Septic Protection
- **Subheading**: Homeowners insurance won't cover it. Generic warranties cap out fast. ProGuard is the only plan built from the ground up for septic systems.

### Comparison Grid

| Feature | ProGuard | Homeowners Ins. | Other Warranties |
|---------|----------|-----------------|------------------|
| Septic system coverage | ✅ Purpose-built for septic | ❌ Typically excluded | ⚠️ Limited or capped |
| Leach field coverage | ✅ Full leach field coverage | ❌ Not covered | ❌ Rarely included |
| Wear & tear / system failure | ✅ Covers wear, tear & failure | ❌ Sudden events only | ⚠️ Sometimes covered |
| Septic specialist network | ✅ Vetted septic pros only | ❌ No septic expertise | ❌ General contractors |
| Coverage limit | ✅ Up to $25,000 | ❌ Zero septic coverage | ⚠️ $500–$2,000 caps typical |
| No inspection required | ✅ Sign up in minutes | ⚠️ N/A | ❌ Inspection often required |

- **Legend**: ✅ Covered | ⚠️ Partial / limited | ❌ Not covered
- **CTA Button**: "Get ProGuard Coverage Today"

---

## 6. Coverage Highlights

- **Section Label**: Comprehensive Protection
- **Heading**: What's Covered Under ProGuard
- **Subheading**: No guesswork. No surprises. Here's exactly what your plan includes.

### What's Covered ✅

- Tank & Distribution Box Repair/Replacement
- Leach Field Repair & Replacement
- Associated Labor Costs
- Emergency Main Line / Wastewater Pipe Pump
- New Parts, Pipes & Components
- Transferable to New Homeowner

### What's Not Covered ❌

- Pre-existing known damage
- Cosmetic landscaping restoration
- Code violation upgrades
- Intentional misuse or neglect
- Cesspools & non-standard systems

**Footer note**: Questions about coverage? Call us — we're happy to walk you through everything.

**CTA Button**: "Protect My Home Today"

---

## 7. Pricing Section

- **Section Label**: Comprehensive Protection
- **Heading**: Up to $25,000 in Septic System Coverage
- **Body**: Plans designed to fit your budget. No inspections required, no long forms, and coverage starts quickly for most services. Fully underwritten by a nationally recognized carrier.
- **CTA Button**: "See Plans & Get Your Quote"

---

## 8. Urgency CTA

- **Background**: Aerial neighborhood image with dark green overlay
- **Icon**: Warning triangle
- **Heading**: Septic failures can cost $5,000 to $25,000+ to repair. Don't wait until something breaks.
- **Body**: Most homeowners don't think about their septic system until it fails. ProGuard's coverage means one breakdown doesn't become a financial disaster.
- **CTA Button**: "Get Protected Now"

---

## 9. Lead Capture Form

- **Icon**: Shield
- **Heading**: Get Your Free Quote
- **Subheading**: Don't wait until something breaks. Lock in protection today.

### Form Fields

| Field | Type | Placeholder |
|-------|------|-------------|
| First Name | text | John |
| Last Name | text | Smith |
| Street Address | text | 123 Main St |
| ZIP Code | text | 06001 |
| Phone Number | tel | (555) 123-4567 |
| Email | email | john@example.com |

**Hidden fields**: utm_source, utm_medium, utm_campaign, utm_content, lead_type ("Campaign"), page_url

**Submit Button**: "Protect My Home — Get a Free Quote"

**Trust badges below form**:
- ✅ No commitment
- ✅ No inspection
- 🕐 Takes less than 60 seconds

---

## 10. FAQ Section

- **Section Label**: Common Questions
- **Heading**: Frequently Asked Questions

### Q&A

**Q: How much does a ProGuard plan cost?**
A: Plans start at an affordable annual rate — a fraction of what a single repair would cost. Fill out the quote form above to get your personalized pricing in under 60 seconds.

**Q: What exactly is covered under the plan?**
A: ProGuard covers tank & distribution box repair/replacement, leach field repair & replacement, associated labor costs, emergency main line/wastewater pipe pump, new parts/pipes/components, and the plan is transferable to a new homeowner. We cover real-world breakdowns — not cosmetic issues, cesspools, or pre-existing damage you already know about.

**Q: How do I file a claim if something goes wrong?**
A: Just call our 24/7 service line. We'll confirm your coverage, dispatch a qualified local technician, and handle the paperwork. Most claims are resolved quickly with minimal hassle on your end.

**Q: Do I need a septic inspection to sign up?**
A: No. Unlike many warranty providers, ProGuard does not require an upfront inspection to enroll. We believe protection should be accessible, not gated behind expensive inspections.

**Q: What states do you serve?**
A: ProGuard currently serves homeowners across the Northeast United States, including Connecticut, Massachusetts, New York, New Jersey, Pennsylvania, Vermont, New Hampshire, Maine, and Rhode Island. We're expanding — check with us if your state isn't listed.

**Q: Is there a waiting period before coverage kicks in?**
A: There is a short waiting period after enrollment for certain types of claims, which is standard in the industry. However, emergency services are available much sooner. Your specific coverage timeline will be outlined clearly when you sign up.

---

## 11. Footer

- **Background**: Dark green (brand primary)

### 3 Columns

**Brand Column**:
- Logo (white)
- "Affordable septic system protection for homeowners across the Northeast. No inspections. No hassle. Just peace of mind."

**Contact Column**:
- Phone: (888) 555-GUARD ⚠️ TODO: Replace with real trackable number
- Hours: Mon–Fri 8am–6pm EST
- 24/7 Emergency Service Line

**Service Area Column**:
- State badges: Connecticut, Massachusetts, New York, New Jersey, Pennsylvania, Vermont, New Hampshire, Maine, Rhode Island
- ⚠️ TODO: Verify state coverage with team before launch

**Bottom bar**:
- © 2026 ProGuard Plans. All rights reserved.
- Privacy Policy link
- Terms of Service link

---

## 12. Sticky Mobile CTA

- **Visibility**: Mobile only (hidden on md+ screens)
- **Position**: Fixed bottom of screen
- **Button text**: "Get My Free Quote"
- **Style**: Full-width, backdrop blur, semi-transparent background

---

## 13. Chat Widget

- **Position**: Fixed bottom-right corner
- **Bubble tooltip**: "Questions? Ask us anything."
- **Welcome message**: "Hi! I'm the ProGuard assistant. How can I help you today?"
- **Brand color**: #1B5E3B (dark green)

### Quick Replies & Answers

**"What does ProGuard cover?"**
→ ProGuard covers septic pump failures, tank structural issues, drain field problems, distribution box failures, baffle repairs, and up to 2 emergency pump-outs per year. No inspection required to enroll.
  - Follow-up: "What's NOT covered?"
    → ProGuard does not cover cesspools, systems installed less than 12 months ago, damage from neglect or misuse, or pre-existing conditions known at enrollment.
  - Follow-up: "How do I file a claim?"
    → Call our claims line at 1-800-PRO-GUARD (available 24/7). Have your policy number ready. A licensed technician will be dispatched within 48 hours — we pay them directly so there's nothing out of pocket for you.

**"How do I file a claim?"**
→ Call 1-800-PRO-GUARD anytime — we're available 24/7. Have your policy number handy. We dispatch a licensed technician within 48 hours and pay them directly. You pay nothing out of pocket.
  - Follow-up: "What info do I need?"
    → Just your policy number and a description of the problem — we handle the rest. You'll find your policy number at the top of your portal dashboard.

**"How much does it cost?"**
→ ProGuard is $499/year — less than the average cost of a single septic pump replacement ($600–$2,500). No deductibles, no surprise bills. One flat annual rate.
  - Follow-up: "How do I enroll?"
    → Click "Get Protected" on the homepage and complete the 3-minute enrollment form. You'll receive a portal invite by email within minutes.

**"When does coverage start?"**
→ Coverage begins immediately upon enrollment for systems installed more than 12 months ago. There's no waiting period for qualified systems.

**"Talk to a real person"**
→ We'd love to help! Call us at 1-800-PRO-GUARD or email support@proguardplans.com. Our team is available Monday–Friday 8am–6pm ET, with emergency claims support 24/7.

**Free-text fallback**:
→ Thanks for your message! Our support team will follow up via email within a few hours. For urgent issues, call 1-800-PRO-GUARD — we're available 24/7.

---

## Enrollment Flow (7 steps)

The enrollment form appears both inline in the hero (desktop) and as a full page at `/enroll`.

| Step | Label | Fields |
|------|-------|--------|
| 1 | Your Details | First name, Last name, Email, Phone |
| 2 | Property Address | Street, City, State (dropdown), ZIP |
| 3 | System Age | Installed in the past year? (Yes/No) |
| 4 | System Type | Conventional, ATU, Sand Mound, Cesspool (denied) |
| 5 | Maintenance | Maintains system?, Frequency, Bedrooms, Occupants |
| 6 | Select Plan | Plan cards with pricing |
| 7 | Payment | Payment form |

**Denial flows**:
- State not covered → `/enroll/denied?reason=state`
- Cesspool selected → `/enroll/denied?reason=cesspool`

**On success**: Lead saved to Supabase `leads` table, `invite-user` edge function called, redirect to `/enroll/success`

---

## Brand & Design Notes

### Colors
- **Primary (dark green)**: #1B5E3B
- **Accent (gold/yellow)**: #F5C842
- **Background**: White / light gray alternating sections
- **Destructive/red**: Used for "not covered" items and fear variant

### Typography
- Headings: Bold, large (text-3xl to text-5xl)
- Section labels: Uppercase, tracking-wider, semibold, small, colored (secondary/accent)
- Body: text-base to text-lg, muted foreground color

### Images (in `/src/assets/`)
- `hero-home.jpg` — Hero background (home exterior)
- `urgency-bg.jpg` — Urgency CTA section background (aerial neighborhood)
- `logo-white.png` — White logo for dark backgrounds
- `logo-dark-green.png` — Dark green logo for light backgrounds
- `system-traditional.jpg` — Conventional system image
- `system-atu.jpg` — ATU system image
- `system-sandmound.jpg` — Sand mound system image

### Key Constants
- Coverage amount: $25,000
- Plan price referenced: $499/year
- Phone: (888) 555-GUARD / 1-800-PRO-GUARD ⚠️ placeholder
- Email: support@proguardplans.com / claims@proguardplans.com
- Service states: CT, MA, NY, NJ, PA, VT, NH, ME, RI
- Renewal rate: 91%
- Years in business: 25+

---

## Pending TODOs

- [ ] Replace phone numbers with real trackable numbers
- [ ] Replace testimonials with verified ones from website
- [ ] Verify state coverage list with team
- [ ] Replace `GOOGLE_REVIEW_URL` placeholder in Dashboard.tsx
- [ ] Run Supabase migration (`20260309_referrals.sql`)
- [ ] Deploy edge functions (invite-user, provision-customer)
- [ ] Set up webhook (auth.users INSERT → provision-customer)
- [ ] Set up subdomain DNS (portal.proguardplans.com → Vercel)
