# AGENTS.md

Main
Got it. I’m going to be strict and ruthless here and cut DEADDROP down to something you
can actually build end-to-end in a few hours using Lovable / v0 / Cursor / Replit-style AI
builders, no custom infra, no clever backend, and no footguns.
This will not be the “perfect” DEADDROP.
It will be a real, demo-ready, useful primitive that doesn’t collapse under its own ambition.
DEADDROP — AI-ONLY BUILD VERSION
(HARD-CUT)
Core principle
If it can’t be generated, glued, and deployed by AI tools in one sitting, it’s out.
1) What survives the cut (non-negotiable)
We keep only what:
● AI tools can reliably generate
● requires zero long-running state machines
● uses existing SaaS primitives
● has binary behavior
KEEP
● Email-only check-ins
● Client-side encryption (single shared passphrase)
● Single escalation timer
● One-time payload release
● Immutable release receipt (hash only)
CUT
● Wallet signing
● SMS, Telegram, multi-channel
● Shamir, multiple envelopes
● On-chain transactions
● Tokens, staking, bonds
● Dynamic escalation logic
● Abuse detection heuristics
This is deliberate.
2) One-sentence product (for builders + users)
“Upload an encrypted file and if you don’t click ‘I’m alive’ within N days, it
gets emailed to your people.”
That’s it. Anything else is scope creep.
3) AI-friendly system architecture (NO custom backend)
Tools stack (example)
● Frontend: v0 / Lovable → static React site
● Forms: Typeform or Tally
● Email: Resend or SendGrid
● Cron: GitHub Actions OR Vercel Cron (1 job)
● Storage: Supabase Storage or S3
● DB: Supabase (1 table)
● Encryption: WebCrypto (client side)
● Hash receipt: SHA-256 logged in DB
Every one of these is something AI tools can wire up reliably.
4) Data model (ONE table, that’s it)
drops
id
user_email
recipient_email
encrypted_payload_url
payload_hash
passphrase_hint
checkin_interval_days
grace_days
last_checkin_at
release_at
status // ACTIVE | RELEASED
created_at
No other tables. No relations. No magic.
5) Core flows (AI-buildable step by step)
A) Create Drop (single page)
UI
● Email
● Recipient email
● Textarea or file upload
● Passphrase (client-side only)
● Interval selector (7 / 14 / 30 days)
Client
● Encrypt payload with passphrase (WebCrypto)
● Upload encrypted blob
● Hash encrypted blob
● Save record to DB
➡ AI can generate this reliably.
B) Check-in email (cron job)
Cron logic (daily run)
for each drop where status = ACTIVE:
if now > release_at:
trigger release
else if now - last_checkin_at >= checkin_interval:
send checkin email
Check-in email contains
● “I’m alive” button
● Signed token link
Clicking link:
● updates last_checkin_at
● recalculates release_at
No state machine. No retries.
C) Release (single irreversible action)
When now > release_at:
● Send email to recipient with:
○ link to encrypted file
○ instructions page
○ passphrase hint
● Mark status = RELEASED
● Log payload_hash + timestamp
No undo. No second chances.
6) Security posture (acceptable for MVP)
This is important to frame honestly on the site.
What this protects against
● Platform compromise (payload encrypted)
● Forgotten instructions
● Sudden unavailability
What it DOES NOT protect against
● Email compromise
● Weak passphrases
● Malicious recipients
● Legal disputes
That honesty buys you credibility.
7) Website structure (v0/Lovable perfect fit)
Page 1: Home
● One sentence
● Diagram (Upload → Check-in → Release)
● CTA
Page 2: Create Drop
● Form only
Page 3: I’m Alive
● Big button
● Confirmation
Page 4: Decrypt Instructions
● Paste ciphertext
● Paste passphrase
● Client-side decrypt
Page 5: Receipt
● Payload hash
● Release timestamp
That’s it.
8) What makes THIS version correct
● No long-running agent state → cron + comparisons
● No probabilistic logic → simple time > deadline
● No partial failure states → either ACTIVE or RELEASED
● No backend crypto → browser handles secrets
● No token bullshit
This is why it’s AI-buildable in hours.
9) How long realistically (AI-only mindset)
I won’t give times, but I’ll give friction weight:
Component Difficulty
UI + forms trivial
Client-side encryption low
Supabase wiring low
Cron logic low
Email templates trivial
Release logic low
Edge cases intentionally ignored
This is why this version works.
10) When you would expand (later, NOT now)
Only after users trust it:
● wallet signature as optional check-in
● multiple recipients
● on-chain receipt
● cooldowns
● bonds
But none of that belongs in v1.
11) Final verdict (brutally honest)
Yes, this pared-down DEADDROP is:
● AI-friendly
● Buildable in a few hours
● Useful even without crypto gimmicks
● Not embarrassing to ship
Pages prompts
Below are copy-paste prompts you can drop into v0 / Lovable (or similar) to generate each
page. They assume a boring stack: Next.js App Router + Tailwind + shadcn/ui. They also
assume you’ll wire “actions” later with simple serverless functions (or Supabase Edge
Functions), but the UI will be generated cleanly.
I’m intentionally making the prompts strict so the generator doesn’t wander into dashboards,
tokens, or complex flows.
PAGE 1 — Home (
/
)
Prompt
Build a minimalist landing page for a product called “DEADDROP”. One
sentence: “Upload an encrypted file; if you don’t click ‘I’m alive’ within N
days, it’s emailed to your person.”
Style: stark, internet-native, not corporate. White background, black text,
subtle gray borders.
Layout:
● Header: left “DEADDROP” (wordmark), right nav links: “Create”,
“Decrypt”, “Receipt”, “Safety”.
● Hero: big headline “If you disappear, your instructions don’t.” Subhead
with the one-sentence explanation. Two buttons: primary “Create a
Drop” (link /create), secondary “How it works” (scroll).
● How it works section: simple 3-step horizontal diagram with icons and
short labels: 1) Encrypt in your browser 2) Monthly check-in email 3) If
you miss the deadline → release email.
● Safety section: two columns “What we do” vs “What we don’t do” with
bullet points. Be honest: no custody, no legal guarantee, email-only,
encryption is client-side, weak passphrases are risky.
● Footer: small text “Client-side encryption. No on-chain storage. No
trading.” + links.
Requirements: keep it under one screen + two sections; no
testimonials, no roadmaps, no token talk. Use shadcn components.
PAGE 2 — Create Drop (
/create
)
Prompt
Build a single-page “Create Drop” wizard for DEADDROP. Minimal UI, no
multi-step modal unless necessary.
Goal: user enters their email, recipient email, check-in interval, grace
period, passphrase, and uploads a file or writes text. The payload is
encrypted client-side.
Layout:
● Top: back link to home, title “Create a Drop”, one-line warning: “Your
passphrase is never saved. If you lose it, nobody can decrypt.”
● Form (card):
○ Your email (required)
○ Recipient email (required)
○ Check-in interval dropdown: 7, 14, 30 days (default 30)
○ Grace period dropdown: 1, 3, 7 days (default 7)
○ Passphrase (required) + confirm passphrase (required) + strength
hint text (no fancy meter)
○ Optional passphrase hint (short text)
○ Payload input as tabs: “Text” (textarea) and “File” (upload)
● Below form: a “What happens” box showing computed dates example:
“Next check-in: … Release deadline: …” (use placeholder dates)
● Submit button: “Encrypt & Create”
● On submit: show a progress state with steps: “Encrypting → Uploading
→ Saving → Done” and then a success screen with:
○ “Your Drop is active.”
○ A “Check-in link” placeholder URL (copy button) (this will be
emailed too)
○ A “Receipt” link placeholder (to /receipt/[id])
Requirements: Generate client-side encryption placeholder
function encryptPayload() using WebCrypto in comments only (no
full implementation), and include clearly marked TODOs for
integrating Supabase Storage + DB insert. Keep the page simple
and robust; do not add user accounts or login.
PAGE 3 — I’m Alive Check-in (
/alive/[token]
)
Prompt
Build a very simple confirmation page for a check-in link: “I’m alive”.
Route: /alive/[token] where token is a URL param.
UI: centered card with big title “Check-in”, subtitle “Confirm you’re okay to
delay release.”
States:
● Loading state: “Verifying link…”
● Success state: big check icon + “You’re confirmed.” + small text: “Next
release deadline extended.” + button “Done” to home.
● Error state: “This link is invalid or expired.” + button “Go home”.
Include a minimal callout: “If you didn’t request this, ignore it.”
Requirements: no extra navigation, no forms. Include TODO comments
for calling a serverless endpoint POST /api/checkin with token to update
last_checkin_at and release_at in DB.
PAGE 4 — Decrypt (
/decrypt
)
Prompt
Build a “Decrypt” page for DEADDROP recipients. It must work entirely
client-side.
Layout:
● Title “Decrypt a Drop”
● Short instructions: “Paste the encrypted text or upload the encrypted
file. Enter the passphrase. Decryption happens in your browser.”
Inputs (in a card):
● Tabs: “Paste ciphertext” (large textarea) and “Upload file” (file input)
● Passphrase field (password input)
● Button “Decrypt locally”
Output area:
● If decrypted content is text: show in a readonly textarea with “Copy”
button
● If it’s a file: show a “Download decrypted file” button (client-side blob)
Error handling: “Wrong passphrase or corrupted file.”
Requirements: include a placeholder decryptPayload() function
signature and TODO comments for WebCrypto implementation. Do not
use any backend calls. Keep the page extremely plain and readable.
PAGE 5 — Receipt (
/receipt/[id]
)
Prompt
Build a public-ish “Receipt” page for a DEADDROP record. Route:
/receipt/[id].
Purpose: show a simple audit receipt without exposing secrets.
Display in a clean card layout:
● Status badge: ACTIVE or RELEASED
● Drop ID (shortened)
● Payload hash (SHA-256) with copy button
● Created at timestamp
● Last check-in timestamp
● Release deadline timestamp
● If RELEASED: show release timestamp
Add a small note: “This receipt proves timing and payload hash only. It
does not reveal contents.”
Requirements: include TODO comments for fetching record from
Supabase by id. Do not show user_email or recipient_email publicly;
show them masked like j***@domain.com. Keep it minimal.
OPTIONAL “Safety” page (if your generator wants the
nav link real) (
/safety
)
Prompt
Build a short “Safety & Limits” page for DEADDROP.
Sections: “What this protects”, “What it doesn’t”, “How to choose a
passphrase”, “Operational limits (email-only)”.
Tone: blunt, non-marketing. No token talk. No roadmap. No legal
promises.
Quick wiring notes (so your AI builder doesn’t invent complexity)
● Use Supabase for DB + Storage.
● Use Resend (or SendGrid) for emails.
● Use one daily cron calling /api/cron to (1) send check-in emails when due and (2)
trigger release when deadline passed.
● Token in URL for /alive/[token] should be a signed JWT-like string stored/validated
server-side (or stored in DB as random token).
If you want, I can also write the exact prompts for the 3 tiny API endpoints you’ll need
(/api/create, /api/checkin, /api/cron) in the same “AI-builder friendly” style—still minimal, no
frameworks beyond what these tools already generate.
