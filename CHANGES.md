# STL ATS HTML Mockups — Round 2 Revisions

**Date:** 2026-06-23
**Design variation:** A "Clarity" + Square Toiletries brand blue `#0B61C2` (unchanged — all round-1 tokens, typography, spacing, and component patterns preserved).
**Stack:** pure HTML/CSS + inline SVG + vanilla inline JS — no new dependencies.

> **Filename note:** the prototype uses the established `.page.html` suffix from round 1 (the whole set is interlinked on it). The round-2 spec's `*.html` names map 1:1 to `*.page.html` (e.g. `processing.html` → `processing.page.html`). Files live under `.claude-project/design/html/<role>/`.

---

## §1 — Login logo
- Copied `logo-square.webp` from the Downloads BuildFest folder into **`.claude-project/design/html/assets/img/logo-square.webp`** (placed inside the mockup tree so the relative reference resolves; the login page is at `auth/login.page.html`).
- Added the logo centered **above** the login card, `max-height:64px`, `alt="Square Toiletries Limited"`, `data-testid="login-logo"`.
- Files: `auth/login.page.html`.

## §2 — Screening Template Builder (significant rework)
Replaced the flat weight-only list with a full builder. File: `hr/template-builder.page.html`.
- **§2.1** Added "Screening guidance prompt (optional)" textarea with the specified helper text + FMCG placeholder.
- **§2.2** "+ Add new criterion" outline button opens a popover of not-yet-added criteria (Age, Gender, Education, Years of Experience, Specific Past Position, Skills, Location, Certifications, Custom field); selecting inserts a typed row; each row has a remove "×".
- **§2.3** Per-row enable toggle; the live "Total: NN%" indicator counts **only enabled** rows (disabled rows muted + excluded); toggling redistributes weights proportionally while sliders stay manually adjustable.
- **§2.4** Per-criterion input UIs implemented: Skills (chip multi-select + 10 AI-suggested skill chips + free type), Age (dual-handle 18–65 + min/max inputs), Gender (segmented Any/Male/Female/Other), Education (min-level select + preferred-field chips), Years of Experience (numeric stepper + "also require experience in" chips), Specific Past Position (title chips), Location (district autocomplete chips), Certifications (chips with Required/Preferred toggle), Custom field (label + value + match-type select).
- **§2.5** "Global keyword filters" card (include + exclude chip inputs) moved to the bottom.
- **§2.6** Auto-shortlist threshold slider kept in its own card.
- **§2.7** "Save template & continue" now routes to **`import-cvs.page.html`**.

## §3 — CV Intake → multi-source "Import CVs"
Renamed `upload.page.html` → **`import-cvs.page.html`** (old file removed). Three source cards:
- **§3.1** Bulk file upload (drag-drop + browse, PDF/Word/JPG/PNG, up to 5,000/batch).
- **§3.2** Job-portal import (LinkedIn / BDJobs / Bdjobs Premium / Other tabs; URL + auto-sync toggle + Connect account; Connected/Not-connected status; 15-min helper text).
- **§3.3** Email-inbox import (monitored inbox, subject filter, attachment filter, Connect Gmail/Outlook, auto-import toggle, status).
- "Current batch" card with running counts (queued / upload / portals / email) + "Start processing" → `processing.page.html`.

## §4 — CV Processing / triage screen (new)
File: **`hr/processing.page.html`**.
- **§4.1** Aggregate progress bar + per-stage chips (Queued / OCR / Parsing / Scoring) with counts.
- **§4.2** "Duplicate CVs detected" inline triage (reason, confidence, compare modal, Reject duplicate / Keep anyway + bulk bar).
- **§4.3** "Files needing attention" (Unsupported / Corrupt / OCR failed / Too large + Remove / Retry-with-OCR / Replace).
- **§4.4** "Continue to review" is **disabled until every triage row is resolved** (live "N decisions remaining" counter); "Skip remaining" opens a confirmation modal. Routes to `cv-review.page.html`.

## §5 — CV Review List (new)
File: **`hr/cv-review.page.html`**.
- Sticky-header table: bulk-select, Candidate (name+email), CV file (opens side drawer), Parsed profile (chip summary → expandable in-row drawer with full profile + red flags), Confidence (color-coded bar ≥90/70–89/<70), AI match score, Status (all start "Pending review"), row quick-actions (Shortlist / Reject / Mark pending).
- Top banner: "500 candidates ready… Would you like AI to suggest a shortlist?" → opens the §6 modal.

## §6 — AI Shortlist Suggestion modal (new)
Embedded in `cv-review.page.html`.
- Summary block + CSS-bar score-distribution histogram.
- 5 radio-card strategies: Top N by score (slider), Above threshold (slider), Balanced by skill coverage, Top N per location, Manual — each with a live preview.
- "Apply suggestion" bulk-sets matches → Shortlisted, rest → "Rejected — pending HR review" (governance note: human review still required), then routes to `results.page.html`.

## §7 — Screening Results dashboard (repositioned)
File: `hr/results.page.html` (reworked). Appears **after** §6.
- KPI row (Shortlisted / Pending review / Rejected / Duplicates handled / Failed).
- Tabs: Shortlisted / Pending / Rejected.
- "Send shortlist to Hiring Manager" → modal (pick HM(s) + note + confirm → success toast).

## §8 — Guided workflow step indicator (new, cross-page)
- Persistent stepper `Template → Import → Process → Review → Shortlist → Hiring Manager → Interview → Hire` injected at the top of all 9 position-flow pages.
- Completed steps = green check + clickable; current = solid Square-blue dot; future = muted. "Hiring Manager" links to `../hiring-manager/shortlist.page.html`.

## §9 — Hiring Manager review (extended)
- `hiring-manager/dashboard.page.html`: "5 new candidates from HR — Sr. Brand Manager" inbox card → Review shortlist.
- `hiring-manager/application-detail.page.html`: actions normalized to **Accept for interview / Request more info / Reject**; Accept marks "Confirmed for interview" + fires a "HR notified" toast (auto-notify note); added "Add interview rating" link.

## §10 — Interview scheduling (new + notification)
- **§10.1** `hr/dashboard.page.html`: notifications card — "Hiring Manager confirmed 4 candidates → Schedule interviews" + "Shortlist sent — awaiting review".
- **§10.2** **`hr/interview-schedule.page.html`** (new): per-candidate schedule grid (datetime, platform Gmail/Google Meet/Zoom/In-person, panel assignment) + email-template editor with merge tokens and a **live preview pane**; "Send invites" → `interviews.page.html`.

## §11 — Interview feedback & AI-assisted final selection (new)
- **§11.1** **`hiring-manager/interview-rating.page.html`** (new): 1–5 star ratings (Technical / Communication / Culture fit / Domain knowledge / Overall) + comments → submit → `interviews.page.html`.
- **§11.2** **`hr/final-selection.page.html`** (new): AI Recommendation card (with reasons) + comparison table (AI score, avg rating, per-criterion breakdown, comments, AI-pick badge); "Select candidate" → confirm modal → `onboarding.page.html`.

## §12 — Onboarding handoff (new)
File: **`hr/onboarding.page.html`**.
- Celebration banner (inline SVG award, no emoji) + "Recruitment cycle complete".
- "Send offer / congratulations email" (editable template + merge tokens + live preview) and "Start onboarding process" (toggleable checklist: Documents, Joining date, ID, Orientation, IT assets, Payroll). Back-to-dashboard / new-position links.

## §13 — File / route map
**New HR pages:** `import-cvs`, `processing`, `cv-review`, `interview-schedule`, `final-selection`, `onboarding` (all `.page.html`).
**Reworked:** `template-builder`, `results`, `dashboard`.
**Removed (superseded by import-cvs + processing):** `upload.page.html`, `batch-monitor.page.html`, `duplicates.page.html` — their batch-progress + duplicate/failed-file triage now live inline in `processing.page.html`.
**New HM page:** `interview-rating.page.html`. **Updated HM:** `dashboard`, `application-detail`.
**Sidebar nav** regrouped into Workspace / Hiring Workflow / Talent & System (see `.claude-project/design/_WORKFLOW_COMPONENTS.md`). Sign-out link preserved on every page.

## §14 — Deliverables / QA
- Logo asset at `assets/img/logo-square.webp`. ✅
- Mock data is FMCG/Bangladesh (Bangla+English names, districts, FMCG roles). ✅
- Design tokens, type, spacing match Variation A (Square blue) on every new screen. ✅
- **QA:** 34/34 pages reachable from login · 0 broken internal links · 0 emoji-as-icons · brand blue on all 34 · no stray indigo · all 9 flow pages carry the step indicator · sign-out on all role pages.

### Full clickable flow
`login → (role) → Job Positions → Template Builder → Import CVs → Processing → Review CVs → AI Shortlist → Screening Results → Send to Hiring Manager → HM review/accept → Schedule Interviews → Interview Rating → Final Selection → Onboarding` — plus Sign out from anywhere.

---

# Round 3 — bug fixes & flow rework (2026-06-24)

## Step indicator (bug)
- The §8 stepper rendered as unstyled text on `template-builder` because that page's own `.stepper` class collided with the injected one. Re-injected the step indicator under unique **`wf-`** classes (`wf-stepper/wf-step/wf-dot/wf-sep`) across all 9 flow pages — now styled correctly everywhere.

## Template builder (`hr/template-builder.page.html`)
- **"+ Add new criterion" fixed** — root cause: the handler was named `togglePopover`, which collided with the native `HTMLElement.togglePopover()` Popover API and threw. Renamed → `toggleAddPopover`. Add/insert/remove of typed criterion rows + weight recompute now work.
- **Skills criterion +/−** — added an explicit "+" add control (alongside AI-suggestion chips + free type) and working "×" remove on each skill chip.

## Import CVs (`hr/import-cvs.page.html`)
- **Job-portal connect/fetch flow** — "Connect account" → status flips to **Connected** + reveals "Fetch CVs"; fetching shows a brief loading state, then "Imported N CVs from {portal}" and **increments the Current-batch counts** (queued + from-portals). Per-portal state persists across tabs.

## Hiring Manager flow (reworked)
- **Shortlist Review** (`shortlist.page.html`) is now view-profile + **Accept/Reject only** (scoring removed). After a decision the buttons are replaced by a **"Accepted/Rejected — sent to HR"** state + a **"Change decision"** redo affordance (no longer the raw initial buttons).
- **`application-detail.page.html`** — interview-scoring removed; Accept for interview / Request more info / Reject with the same decided-state + redo; auto-notify-HR note kept.
- **`dashboard.page.html`** — added a "Candidate Decisions" section showing each decision "sent to HR" with a per-row Change-decision affordance.
- **Interview Feedback** (`interviews.page.html`) — retitled; **all scheduling UI removed** (HM doesn't schedule). Lists candidates HR scheduled with read-only date/time + Scored/Not-scored status + "Give feedback".
- **`interview-rating.page.html`** — per-candidate 1–5 star scoring across Technical/Communication/Culture fit/Domain/Overall + comments → returns to the feedback hub.
- **NEW `hiring-manager/final-selection.page.html`** — comparison panel (AI score + interview ratings + per-criterion + AI Recommendation) with **"Select for onboarding"** (HM only) → confirm modal (**visible "Confirm selection"** text, fixing the blank-button bug) → "Sent to HR for onboarding" → routes to the HR read-only panel.
- HM sidebar regrouped: Assigned Positions / Shortlist Review / Interview Feedback / Final Selection.

## HR selection & scheduling
- **`hr/final-selection.page.html`** is now **read-only** — HR sees the full comparison + AI suggestion + a "Selected by Hiring Manager" badge/banner, but **cannot select**; adds **"Proceed to onboarding"**. (The select action + confirm modal were removed from HR — only the HM selects.)
- **`hr/interview-schedule.page.html`** — after **"Send invites"** the form is hidden and a **tracking view** is shown with a **"Schedule new interview"** button that reopens the form to repeat the process.

## Onboarding (`hr/onboarding.page.html`)
- **"Send offer email"** → transitions to a **sent state** ("Offer email sent…", timestamp, "View sent email" expander, Sent indicator + Resend).
- **"Start onboarding"** → **onboarding-started view**: success banner, active tracked checklist with a progress indicator (X/6), toggleable steps.

## Exports (`hr/exports.page.html`) — rebuilt functional
- Choose **export type** (Bulk CV ZIP / Excel with custom fields / Final candidate summary (predefined Excel) / Screening report PDF / Interview panel summary) → **scope** → conditional options (Excel **field checklist** with select-all; report/summary options) → **Generate** (validates, shows generating state, prepends a row to **Export history** with a Download link + success toast). Audit-log note retained.

## QA (round 3)
- 35/35 pages reachable from login · 0 broken links · 0 emoji/glyph icons · Square blue on 35/35 · stepper styled on all 9 flow pages · HM nav consistent across 6 pages.
- Inventory: auth 2 · hr 18 · hiring-manager 6 · viewer 4 · admin 5.
