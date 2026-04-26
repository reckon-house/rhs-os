# Reckon House — Infrastructure

Reference for what's wired to what. Update when something changes.

**Last updated:** April 2026

---

## Domain & DNS

**Domain:** reckon.house **Registrar:** Namecheap **DNS managed at:** Namecheap → Domain List → Manage → Advanced DNS

### Active records

TypeHostValuePurposeA`@76.76.21.21`Points apex (reckon.house) to VercelCNAME`wwwcname.vercel-dns.com`Points www subdomain to VercelTXT`@v=spf1 include:spf.easywp.com ~all`SPF — authorizes Namecheap Private Email to send mailTXT`default._domainkeyv=DKIM1;k=rsa;p=...`DKIM — signs outgoing mail so it doesn't get flagged as spamTXT`@openai-domain-verification=dv-...`OpenAI domain ownership verificationTXT`domain-verification...`UUIDGeneric ownership token (origin unknown — leave alone)CNAME`_67be4272b719...`hashed valueAuto-issued verification record (likely SSL or third-party). Safe to leave.

### Canonical URL behavior

- `reckon.house` → serves the site (production)
- `www.reckon.house` → 308 redirect to `reckon.house`

---

## Hosting

**Platform:** Vercel **Project name:** rhs-os **Production URL:** rhs-os.vercel.app (Vercel-issued) **Custom domain:** reckon.house

### Connected domains in Vercel

- `reckon.house` → Production (canonical)
- `www.reckon.house` → 308 redirect to `reckon.house`
- `rhs-os.vercel.app` → Production (Vercel default)

### Repository

- **Location:** `/Volumes/ReckonHouse/RHS/OS/`
- **Framework:** Next.js
- **Deploy trigger:** push to main branch → auto-deploys via Vercel

---

## Email

**Provider:** Namecheap Private Email (paid) **Primary inbox:** hello@reckon.house

The SPF and DKIM records above are what make sending work. Don't delete them.

If email ever stops sending, those records are the first place to check.

---

## Database

**Provider:** Supabase **Used by:** RHS/OS (case study CMS, future content layer)

(Add project name and key tables as the build expands.)

---

## Stack

- **Framework:** Next.js
- **Hosting:** Vercel
- **Database:** Supabase
- **Email:** Namecheap Private Email
- **Domain registrar:** Namecheap
- **Dev environment:** Claude Code (primary CMS for case study .ts files)

---

## Where to manage what

If you need to...Go hereEdit a case studyClaude Code → `/Volumes/ReckonHouse/RHS/OS/src/data/[project]-case-study.ts`Change DNS recordsNamecheap → Domain List → Manage → Advanced DNSConnect/redirect a domainVercel → rhs-os project → Settings → DomainsCheck deployment statusVercel dashboardManage emailNamecheap → Private EmailQuery/edit databaseSupabase dashboard

---

## Notes

- Vercel auto-provisions SSL certificates once DNS validates. No manual cert management needed.
- The two "verification" TXT records (OpenAI, generic UUID) don't affect routing. They're proof-of-ownership tokens for services that asked for them at some point. Leaving them alone is safer than deleting and finding out later what broke.
- Namecheap defaults nameservers to "Namecheap BasicDNS" — that's what makes the Advanced DNS tab work. Don't switch to Custom DNS unless you know why.
