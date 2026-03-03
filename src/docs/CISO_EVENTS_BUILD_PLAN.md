# CISO Events — Claude Code Build Plan
**Project:** CISOevents.com Full Redesign & Rebrand  
**Developer:** Blue Sprout Agency LLC (Nermeen)  
**Client:** Charles Payne — Neptune Media / CISOevents  
**Deadline:** Before March 23, 2026 (next live event)  
**Stack:** React + Vercel (staging) → migrate to Namecheap cPanel + PostgreSQL  

---

## ✅ APPROVED DECISIONS (from March 02 meetings)

| Decision | Details |
|---|---|
| Color Theme | **Navy + Electric Blue** with **neon green accent** (Option B approved) |
| Event Registration | Luma embed script (no API — requires paid plan) |
| Past Events | Manually added, linked to Luma pages |
| Chatbot | Tawk.to — script tag already obtained |
| Contact Form | Resend API — domain already verified on Namecheap DNS |
| Admin Login | Google Auth — **whitelist Charles's email only** |
| Database | PostgreSQL on Namecheap (migrate at delivery) — use own DB for now |
| Thumbnails | Do NOT migrate old ones — outdated branding |
| Analytics | GA4 tag — Charles to send (not blocking launch) |
| Privacy Policy | Draft with AI, Charles to review |
| FAQ Page | Add to footer |
| Footer | Updated with all call-to-action links, phone, copyright |

---

## 🚀 IMMEDIATE ACTION ITEMS — VSCode / Claude Code

### 1. THEME — Remove Options A & C, Lock in Navy + Electric Blue

**File:** `src/styles/theme.js` or wherever your color tokens live

```
Primary Background: #0A1628  (deep navy)
Secondary Background: #0D1F3C
Primary Accent: #1E90FF      (electric blue)
Neon Accent: #39FF14         (neon green — for CTAs, highlights)
Text Primary: #FFFFFF
Text Secondary: #A0AEC0
Card Background: #112240
Border: #1E3A5F
```

- Remove all references to the other two theme options
- Apply navy theme site-wide — navbar, hero, cards, footer
- Ensure neon green is used for: primary CTA buttons, hover states, active nav links

---

### 2. BRANDING — CISOevents (no space, no caps on "events")

- Replace ALL instances of "Horizon Summit" → **CISOevents**
- Replace all instances of "CISO Events" → **CISOevents** (company branding, not English)
- Update `<title>`, meta tags, Open Graph tags
- Update logo alt text and aria labels

---

### 3. LUMA EVENT REGISTRATION — Embed Script

Charles confirmed the event ID. Use the Luma embed script from their GitHub repo.

**Action:**
```jsx
// In your upcoming event section / hero CTA button:
// Replace EVENT_ID placeholder with: IUUTTA274
// Script tag from Luma GitHub repo already in your notes
// Embed on Homepage hero section as primary CTA
```

- Add "Register Now" button on homepage hero → links to `lu.ma/cisoevents`
- For specific event: `lu.ma/IUUTTA274` (March 23 event)
- Subscribe to calendar button: use the iCal link Charles provided

**Research still needed:** Feasibility of scraping iCal feed for auto-updating events — report back to Charles once tested.

---

### 4. PAST EVENTS SECTION

- Create a `PastEvents` component
- Manually add past events from Charles's Luma page (`lu.ma/cisoevents` → past events tab)
- Each card: Event title, date, location, → link to Luma past event page
- No old thumbnails — use a clean card design with neon green accent border

---

### 5. CONTACT FORM — Resend API

- Domain already verified on Namecheap DNS ✅
- Wire up contact form to Resend API
- On submission: Charles receives email at `charlesp.cisoevents@gmail.com`
- You also receive a copy at `bluesproutagency@gmail.com`
- Test with Charles after integration — text him to check inbox

```jsx
// Resend API key — already in your env
// RESEND_API_KEY=re_xxxx
// FROM: noreply@cisoevents.com (verified domain)
// TO: charlesp.cisoevents@gmail.com
```

---

### 6. CHATBOT — Tawk.to

- Script tag already obtained ✅
- Add to `index.html` or `_document.js` (Next.js) before `</body>`
- Customize widget: upload CISOevents logo (80x80px), match navy/neon green colors
- Charles can monitor via Tawk.to mobile app

---

### 7. ADMIN PANEL — Google Auth (Gmail whitelist)

- Route: `/admin` — protected
- Auth: Google OAuth
- **Whitelist:** `charlesp.cisoevents@gmail.com` ONLY
- Admin can: Add / Edit / Delete Events, Speakers, Partners
- Use current DB (your Supabase or local PG) — migrate to Charles's Namecheap PG at delivery

**Admin capabilities needed:**
- Events CRUD (title, date, location, description, Luma link)
- Speakers CRUD (name, bio, headshot URL, company)
- Partners CRUD (logo URL, company name, website link)

---

### 8. PARTNER LOGOS

- Charles has logos in an archived folder — he will send them
- Once received: compress, optimize, add to `/public/logos/` or S3
- Build scrolling logo ticker component (already in scope from contract)
- Use high-quality versions only — Charles confirmed he has them

---

### 9. FOOTER — Full Update

Footer must include:
```
Navigation links:
- Home | Events | Speakers | Partners | Contact | Privacy Policy | FAQ

Contact:
- Phone number (get from Charles or existing site)
- Social: Facebook, Instagram, LinkedIn, YouTube (@VerizonSummit), Snapchat

Legal:
© 2026 CISOevents. All rights reserved.
A Neptune Media Company.

Links:
- Privacy Policy (new page — AI drafted, Charles to review)
- FAQ (existing content, add back)
```

---

### 10. PRIVACY POLICY PAGE

- Draft using AI (Claude can generate this)
- Route: `/privacy-policy`
- Link in footer
- Send draft to Charles for review before launch
- Include: data collection disclosure, cookie policy, contact info

---

### 11. FAQ PAGE

- Route: `/faq`
- Link in footer (not main nav)
- Pull FAQ content from existing HubSpot page if available
- Minimal design — accordion style

---

### 12. HERO IMAGE

- Create new hero using Canva or AI image gen
- Theme: cybersecurity executive / tech conference aesthetic
- Must match navy + electric blue palette
- No old Horizon Summit branding
- Replace existing hero image

---

### 13. NEW EVENT THUMBNAILS

- Create template in Canva with updated CISOevents logo
- Use navy + neon green color scheme
- Apply to all upcoming event cards going forward
- Do NOT use old thumbnails

---

### 14. SOCIAL MEDIA LINKS — Update All

Add these links (confirm handles with Charles):
- Facebook
- Instagram  
- LinkedIn
- YouTube: `youtube.com/@VerizonSummit`
- Snapchat (handle TBD)

---

### 15. GOOGLE ANALYTICS

- Charles to provide GA4 script tag (not blocking launch)
- Add to `<head>` when received
- If not received before launch: add placeholder comment in code

---

## 📋 WAITING ON CHARLES

| Item | Status |
|---|---|
| Partner logo files | Charles to send from archive folder |
| GA4 script tag | Charles to get from Google Analytics |
| Privacy policy review | After Blue Sprout drafts it |
| Phone number for footer | Confirm with Charles |
| Snapchat handle | Confirm |
| PostgreSQL credentials | At time of migration / delivery |
| cPanel access | At time of migration / delivery |
| GitHub repo access | At time of migration / delivery |

---

## 🔄 MIGRATION PLAN (After Launch Approval)

1. Charles reviews staging site → approves
2. Migrate code to Charles's GitHub repo
3. Connect to Namecheap PostgreSQL (Charles creates DB user/password)
4. Deploy to Namecheap cPanel via FTP build upload
5. Update DNS to point cisoevents.com to new site
6. Smoke test all pages, forms, chatbot, Luma embed
7. **Request final $500 payment**
8. **Request testimonial** (email or text with his photo + website link for portfolio)

---

## 💬 TESTIMONIAL REQUEST (send after go-live)

> "Hey Charles! The site is live and looking great. I'd really appreciate a quick testimonial from you — even just a few sentences via email or text message. If you're up for it, a photo of yourself and the cisoevents.com URL would be amazing so I can feature it in my portfolio. Thanks so much for trusting Blue Sprout with this! 🙏"

---

## 📁 FILE STRUCTURE TO BUILD/UPDATE

```
src/
├── components/
│   ├── Hero.jsx              ← new hero image, Luma CTA button
│   ├── UpcomingEvents.jsx    ← Luma embed + manual event cards
│   ├── PastEvents.jsx        ← manual Luma past event links
│   ├── Speakers.jsx          ← dynamic from admin/DB
│   ├── Partners.jsx          ← scrolling logo ticker
│   ├── ContactForm.jsx       ← Resend API wired up
│   ├── Footer.jsx            ← full update
│   ├── ChatBot.jsx           ← Tawk.to script injected
│   └── AdminPanel/
│       ├── Login.jsx         ← Google Auth, whitelist charles email
│       ├── EventsManager.jsx
│       ├── SpeakersManager.jsx
│       └── PartnersManager.jsx
├── pages/
│   ├── index.jsx
│   ├── privacy-policy.jsx    ← new
│   ├── faq.jsx               ← restored
│   └── admin.jsx             ← protected route
└── styles/
    └── theme.js              ← NAVY + ELECTRIC BLUE only
```

---

## 🎯 LAUNCH CHECKLIST

- [ ] Navy + neon green theme applied everywhere
- [ ] All "Horizon Summit" / "CISO Events" → "CISOevents"
- [ ] Luma embed script on homepage (event ID: IUUTTA274)
- [ ] Past events section live
- [ ] Contact form → Resend API working (test email received)
- [ ] Tawk.to chatbot visible on site
- [ ] Admin panel → Google Auth → Charles's email whitelisted
- [ ] Partner logos added (waiting on Charles)
- [ ] Footer complete (links, phone, copyright, Neptune Media)
- [ ] Privacy Policy page live
- [ ] FAQ page live
- [ ] New hero image
- [ ] Social links updated (incl. YouTube + Snapchat)
- [ ] Mobile responsive pass done
- [ ] GA4 added (if Charles sends tag in time)
- [ ] Staging URL sent to Charles for review
- [ ] Charles approval received
- [ ] Migration to Namecheap + PostgreSQL complete
- [ ] Final $500 payment requested
- [ ] Testimonial requested
