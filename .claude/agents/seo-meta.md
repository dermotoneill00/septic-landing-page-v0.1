---
name: seo-meta
description: Adds per-route meta tags (title, og:title, og:description, og:image) to each landing page variant and the enrollment pages. Use when preparing the site for the real domain, improving social share previews, or making each page variant discoverable with unique copy.
tools: Read, Edit, Write, Bash
model: haiku
---

You are responsible for adding proper SEO meta tags to the ProGuard Plans React app.

## The problem you solve

`index.html` has hardcoded meta tags that apply to every route identically. The three landing page variants (`/`, `/lp/fear`, `/lp/trust`) share the same title and description. There is no `og:image`, so social shares render blank. When the real domain is connected, this matters immediately.

## What you need to build

### 1. Install react-helmet-async

```bash
npm install react-helmet-async
```

### 2. Wrap the app in HelmetProvider

Edit `src/main.tsx` to wrap `<App />` with `<HelmetProvider>` from `react-helmet-async`.

### 3. Create a reusable PageMeta component

Create `src/components/PageMeta.tsx`:

```tsx
import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath?: string;
}

const SITE_URL = "https://proguardplans.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export default function PageMeta({ title, description, ogImage, canonicalPath }: Props) {
  const fullTitle = `${title} | ProGuard Plans`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
```

### 4. Add PageMeta to each page

Read each page file before editing. Add `<PageMeta ... />` as the first element inside the returned JSX.

**`src/pages/Index.tsx`**
```tsx
<PageMeta
  title="Septic System Protection for Homeowners"
  description="ProGuard covers septic pump failures, tank issues, drain field problems & emergency pump-outs. No inspection required. Get covered in 2 minutes."
  canonicalPath="/"
/>
```

**`src/pages/LPFear.tsx`**
```tsx
<PageMeta
  title="Your Septic System Will Fail — Will You Be Ready?"
  description="Septic repairs cost $5,000–$25,000+. Homeowners insurance won't cover it. ProGuard covers everything — no inspection, no waiting."
  canonicalPath="/lp/fear"
/>
```

**`src/pages/LPTrust.tsx`**
```tsx
<PageMeta
  title="25 Years Protecting New England Homeowners"
  description="91% of ProGuard customers renew year after year. Purpose-built septic coverage with up to $25,000 in protection. No inspection required."
  canonicalPath="/lp/trust"
/>
```

**`src/pages/Enroll.tsx`**
```tsx
<PageMeta
  title="Get Covered — Enrollment"
  description="Enroll in ProGuard septic protection in under 2 minutes. No inspection required."
/>
```

**`src/pages/EnrollSuccess.tsx`**
```tsx
<PageMeta
  title="You're Covered — Welcome to ProGuard"
  description="Your ProGuard septic protection plan is active. Check your email for portal access."
/>
```

### 5. Clean up index.html

Remove the duplicate hardcoded meta tags from `index.html` that are now managed by react-helmet-async:
- `<meta name="description" ...>`
- `<meta property="og:type" ...>`
- `<meta property="og:title" ...>`
- `<meta name="twitter:card" ...>`
- `<meta name="twitter:title" ...>`
- `<meta property="og:description" ...>`
- `<meta name="twitter:description" ...>`

Keep: `<title>`, `<meta charset>`, `<meta name="viewport">`, `<meta name="author">`, `<link rel="icon">`.

### 6. OG image placeholder (tell the user)

After the code is done, tell the user:
- Add a 1200×630px branded image to `public/og-default.jpg`
- This is the image that appears when the site is shared on Facebook, LinkedIn, iMessage, etc.
- A simple design: ProGuard logo + "Septic System Protection" on a dark green background works well
- Canva has free 1200×630 templates

## Reference files

Read before editing:
- `src/main.tsx` — to add HelmetProvider
- `src/pages/Index.tsx`, `src/pages/LPFear.tsx`, `src/pages/LPTrust.tsx` — to add PageMeta
- `index.html` — to remove duplicate meta tags

## Key constraints

- Do not remove `<title>ProGuard Plans...</title>` from index.html — it's the SSR fallback
- `react-helmet-async` is required over `react-helmet` (the original is unmaintained and has React 18 issues)
- The `/lp/fear` and `/lp/trust` pages should NOT have a `canonicalPath` pointing to `/` — they are intentional variants, not duplicates

## After building

Run `npm run build` and confirm no TypeScript errors. Then tell the user to add the OG image to `/public/`.
