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

---

# Round 4 — UI fixes + GitHub Pages deploy (2026-06-24)

- **Template builder:** removed the standalone skill "+" button (`tpl-skill-add`) from the Skills criterion — skills add via typing/Enter + AI-suggestion chips; the +/- steppers remain on the weight %.
- **CV file = downloadable link:** in `cv-review` the CV filename is now a download link (`downloadCv()` generates a mock CV file via Blob) alongside the view-drawer icon; `application-detail`'s "View original PDF" became a working **Download CV** link (data-URI download).
- **"Create & send invitation"** (`hr/interviews.page.html`) now works: submitting shows an "Invitation created & sent — Scheduled" confirmation and disables the button (no page reload).
- **Hosting:** added `docs/` (deployable copy of the prototype) with `docs/index.html` redirecting to the **login page** as the site entry point, plus `.nojekyll`. README documents the GitHub Pages setup. Pushed the whole project to `github.com/sadiasajarun/Square_ATS` (`main`).
- **QA:** canonical tree 35/35 reachable · `docs/` 36/36 reachable from `index.html` · 0 broken links · `docs/` byte-identical to the canonical `html/` tree.

---

# Round 5 — Advanced candidate filtering (2026-07-16)

**Scope:** `hr/candidates.page.html` only (per R5 spec). The filter block is built as a self-contained, reusable `flt-` component intended to be dropped onto `cv-review.page.html` and `results.page.html` in a later round.

- **Quick-filter row extended** — Skills became a multi-select chip dropdown; added a **Stage** multi-select over the `ApplicationStatus` values (`SCREENED`, `SHORTLISTED`, `IN_INTERVIEW`, `ADVANCED`, `RETURNED_TO_HR`, `REJECTED_PENDING_REVIEW`, `REJECTED`), each option rendered with its semantic status badge (color + icon + label, never color alone). `REJECTED_PENDING_REVIEW` and `REJECTED` stay distinct facets — the pending state is the human-in-the-loop guard.
- **"Advanced filters" expandable panel** (chevron toggle + active-facet count badge), grouped: **Scoring** (AI match score + parsing confidence dual-handle 0–100 sliders, score-band-colored readout), **Experience & qualifications** (years min/max, certifications multi-select), **Position context** (requisition + department multi-selects), **Source** (Bulk upload / LinkedIn / BDJobs / Email inbox + batch multi-select), **Signals** (red-flag multi-select + "Has any red flag" toggle), **Application history** (previously applied/shortlisted Yes/No/Any segments, last-applied date range, application-count range).
- **Sensitive criteria gated** — Age range + Gender controls render **visibly disabled** with the note "Pending STL policy & local labour-law approval" (Open Question 7); they are excluded from `fltMatch()` and cannot affect results.
- **Filter behavior** — AND across groups, OR within a multi-select; every applied facet appears as a removable chip in the Active-filters strip + Clear all; **live results count** in the table header and on the panel's "Show N results" button.
- **Saved views** — "Save current filters" names the current set and pins it as a clickable pill above the quick row; 2 pre-seeded examples ("Dhaka · Shortlisted · Score >80", "Pending review · Has red flag"). In-memory only (no localStorage).
- **Table** — new **STAGE** column (between District and Tags) with icon+label status badges; stage colors follow the established prototype mapping (`b-dan` for Rejected-pending, `b-mut` for final Rejected). Card view rebuilt data-driven and reflects the same filtered set.
- **Mock data** — candidate set expanded 8 → **45**, each with the full attribute set (stage, score, confidence, years, certs, source, requisition/department, red flags, history flags, application count, batch, last-applied); FMCG/Bangladesh realism preserved.
- **QA:** inline JS syntax-checked clean · all new controls labeled + `data-testid` + focus rings · no emoji icons (inline SVG only) · handler names all `flt`-prefixed (no native-DOM shadowing) · responsive 1440/1280/1024/768 · `docs/hr/candidates.page.html` byte-identical to canonical (SHA256 verified).

---

# Round 6 — CV Analysis Dashboard (2026-07-16)

**Scope:** new `hr/cv-analysis-dashboard.page.html` (pool-level analytics) + minimal wiring. Per the R6 spec's "no major change" constraint, the per-candidate evaluation is NOT duplicated — the dashboard links into the existing `candidate-detail.page.html`.

- **New page** — breadcrumb + scope selector (Position: Sr. Brand Manager 120 CVs / Trade Marketing Officer 86 / QA Chemist 64 · Batch filter), live summary line ("N CVs analyzed · N scoring ≥75% · avg match · avg confidence"), **"Export to Excel"** button funneling into the existing Exports flow.
- **Six insight cards** (pure inline-SVG charts, `cva-` namespace, no libraries; noted in code these become recharts in the React build): match-score histogram (6 buckets, score-band colors), required-skill coverage bars (surfaces the biggest gap), red-flag frequency bars, parsing-confidence bands (≥90/70–89/<70), experience + education mix, source donut + top districts. Every card carries a plain-language takeaway caption; all charts labeled + legends (never color-only).
- **Evaluation Summaries table** — ranked standout readout (top 15 + "Show all N" expander): rank, candidate, match-score bar, **one-sentence AI evaluation summary** assembled from the candidate's own attributes (so text never contradicts the chips), key-signal chips (top skills + red-flag badge), confidence mini-bar, **View → candidate-detail.page.html**. Sortable by score/confidence (default: score desc).
- **Internally consistent mock data** — pool generated per scope with a seeded deterministic PRNG (mulberry32), so charts and table always reconcile and every load shows identical numbers; FMCG/Bangladesh realism (Bangla + English names, BD districts/companies).
- **Wiring** — "CV Analysis" nav item added to all 19 HR sidebars (between Screening Results and Interviews); "Open CV Analysis" button on `results.page.html`; "View pool analysis" link on `candidate-detail.page.html`. `wf-` stepper left untouched (analytics side-view, not a pipeline step).
- **Governance** — read + drill-through only (no accept/reject actions on this surface, stated in a footer note); **no age/gender analytics at all** (deliberate Open-Question-7 omission, noted on-page).
- **QA:** JS syntax-checked clean · all links from the new page resolve · nav item present exactly once on every HR page · `docs/hr/` all 19 pages byte-identical to canonical · tree now 36 canonical / 37 deployed pages (inventory: auth 2 · hr 19 · hiring-manager 6 · viewer 4 · admin 5).

---

# Round 7 — Written Exam + Viva Combined Assessment Summary Report (2026-07-16)

**Scope:** new `hr/assessment-summary-report.page.html` (the star) + minimal plumbing `hr/written-exam.page.html` + stepper/nav wiring. `asr-` namespace throughout.

> ⚠️ **Format dependency:** the client asked for the report "following the attached format" but no format file was provided (the shared screenshot was the Candidate Database page). The report ships a standard BD combined-result / merit-list default with a `TODO: swap to client's attached format` comment at the top — same open dependency as PRD Open Question 3. **Flag at the demo.**

- **Assessment Summary Report** — official-document header (STL logo + "Combined Assessment Summary — Written Examination & Viva Voce" + meta row incl. recruitment ref), live qualification controls (written pass 50, viva pass 60, Written/Viva weighting slider summing 100, default 60/40), view toggle **"Qualified in both only"** (default) vs "Show all assessed" (non-qualified grey), merit table (Merit # among qualified · Roll STL-BM-01xx · Written /100 · Viva /100 · weighted Combined · AI match · Result badge **Selected**(top-5 vacancies)/**Waitlisted**/**Not qualified** with icon+label · Remarks · View → candidate-detail), sortable by written/viva/combined. Per-row expandable consolidation: written breakdown (MCQ/30 + Written/50 + Case/20), viva per-criterion bars (Technical/Communication/Culture fit/Domain/Overall from interview-rating), AI evaluation sentence, red flags, contact. Signature block (2 viva panel members, HR Manager, Approving Authority) + **print stylesheet** (chrome hidden, header/table/signatures intact) + **Export to Excel** via existing Exports flow.
- **Written Exam page** (plumbing) — position/batch selector, per-section totals (MCQ 30 / Written 50 / Case 20, editable), 28-candidate marks-entry table with auto total/%/status (Marks entered / Pending — last 3 pending to show the state), Save marks → toast. Viva marks are NOT re-captured — they come from interview-rating.
- **Mapping decision** — Viva = the existing interview/interview-rating stage (5-pt × 20); Written Exam = new. No second viva UI.
- **`wf-` stepper grew to 9 steps** on all 9 flow pages: `Template → Import → Process → Review → Shortlist → Hiring Manager → Written Exam → Viva → Hire` (Interview relabeled Viva; done/current/future states preserved per page; `_WORKFLOW_COMPONENTS.md` updated).
- **Wiring** — "Written Exam" + "Assessment Report" nav items on all 21 HR sidebars; "Open Assessment Report" button on `interviews.page.html`; "View assessment report" on `final-selection.page.html`.
- **Internally consistent mock data** — verified programmatically: exactly **12 of 28** qualify at default thresholds; edge cases included and verified (strong written 82 / weak viva 48 → not qualified; weak written 44 / strong viva 84 → not qualified) so the "performed well in both" filter visibly works.
- **Governance** — decision-support only (stated on-page); "Not qualified" is an assessment outcome distinct from ATS `REJECTED`; no auto-select; no age/gender surfaced.
- **QA:** both pages' JS syntax-checked clean · qualification math verified by script · all links resolve · nav items exactly once per page · steppers verified on all 9 flow pages (no stray "Interview" label) · `docs/hr/` all 21 pages byte-identical · tree now 38 canonical / 39 deployed (inventory: auth 2 · hr 21 · hiring-manager 6 · viewer 4 · admin 5).

---

# Round 8 — Online Presence & Public-Information Analysis (2026-07-16)

**Scope:** new `hr/online-visibility-analysis.page.html` (`ovi-` namespace) + minimal wiring. **Highest-governance feature in the prototype** — guardrails are built into the code, not bolted on. Everything is fixture data; nothing is retrieved from any real source.

> ⚠️ **New open dependency (raise at demo, added as PRD Open Question 9):** which enrichment/search provider, is it approved by STL Legal, and what candidate-notice/consent policy applies? `TODO` comment at the top of the page. Same class of blocker as Open Question 7.

- **Persistent governance banner** (info-styled, no dismiss control): public professional information only · assistive, never a screening input or automated decision · identity matches are AI suggestions requiring HR confirmation · personal/social/protected-characteristic data excluded by design · every lookup audit-logged, opt-in per position.
- **Sample-set run surface** — "Analyze default sample set — 12 CVs" card with name-preview chips; **Run analysis** plays a deterministic ~3s mocked progress listing the *source types* checked (professional network, code/portfolio, publications, directories/associations, news/conference mentions).
- **Results table** — per candidate: online-visibility score 0–100 (tooltip: *strength of footprint, NOT candidate quality — low visibility is neutral*; neutral color palette, not score-band), profiles-found count, identity-match badge (High / Medium—verify / Low—verify with caution icon), CV-corroboration badge (Corroborated / Partial / Discrepancy found / Not found online), **View report**. Summary line: "12 analyzed · 8 high-confidence identity matches · 1 discrepancy flagged · 1 minimal presence (neutral)". **Generate & export all reports** → existing Exports flow.
- **Per-candidate report drawer** (print stylesheet renders it as a standalone clean document): header with score + AI one-liner → **identity-verification block first** (N potential matches, per-profile source/URL/confidence/snippet + `Confirm — this is them` / `Not them` / `Unsure`) → public professional info → CV-claim cross-check table → excluded-by-design notice → Export / Print / Add-to-record (audited) / Close.
- **The gate is code, not copy:** sections 4c/4d render a locked placeholder until HR confirms at least one profile; per-claim evidence stays "Pending" until its specific source profile is confirmed.
- **Instructive fixtures** (12, clearly fictional): Mahmudul Hasan = common name → Low confidence + 2 namesakes (verify-first workflow); Kazi Nazrul Haque = CV says 2021–2023, public profile shows Aug 2022–Jun 2024 → Discrepancy (anti-fraud path); Farhana Karim = minimal presence → shown neutral, explicitly not a red flag.
- **Wiring** — "Online Presence" nav item on all 22 HR sidebars (next to CV Analysis); "Run online presence analysis" entry links on `candidate-detail` and `cv-analysis-dashboard`. **Deliberately NOT added to the `wf-` stepper** — optional research side-tool, not a pipeline gate, so it can never become an automated-rejection lever.
- **Governance enforced** — visibility score appears nowhere near match-score computation and is not selectable as a screening criterion; nothing on this surface can change a candidate's pipeline status; architecture comment notes the real build is a pluggable enrichment adapter stubbed in v1 (like OCR/SMS).
- **QA:** JS syntax-checked clean · all internal links resolve · nav item exactly once on all 22 HR pages · `docs/hr/` all 22 pages byte-identical · tree now 39 canonical / 40 deployed (inventory: auth 2 · hr 22 · hiring-manager 6 · viewer 4 · admin 5).

---

# Round 9 — Assessment Summary Report reworked to the client's format (2026-07-16)

**Trigger:** the client's actual format arrived — `Summary format.xlsx` (sheet "12.07.2026") — resolving the R7 TODO and closing the format half of Open Question 3. `hr/assessment-summary-report.page.html` reworked to match it.

- **Client layout implemented:** title in the client's wording ("Summary for the Position of Sr. Brand Manager, Marketing Dept.") + date; columns **Sl · Name · Age · Degree · Educational Institution · Passing Year · Result · Working Experience · Year of Exp. · Written Marks · Remarks** — exactly the sheet's column set.
- **Row-block structure like the sheet:** one candidate = a block of rows, one row per education level (MBA/BBA/HSC/SSC with institution, passing year, CGPA/GPA), with Sl, Name (+phone +roll/district), Age, the multi-org Working Experience cell (Org/Position/Duration lines), Year of Exp. ("N Y / M M"), marks, and Remarks row-spanned across the block. Block-start rows carry a heavier rule, education sub-rows a dashed one.
- **Platform additions kept, format-safe:** Viva Marks + Combined columns sit after Written Marks; the Result badge (Selected/Waitlisted/Not qualified) lives in the Remarks cell; the Action column (expander + View) is **on-screen only — hidden on print, so the printed sheet matches the client format**. Pass-mark/weighting controls, qualified-only toggle, sorting, per-candidate expansion (written/viva breakdown + AI sentence) all preserved. The AI-match column was removed from the table (not in the client format) — it remains in the expansion panel.
- **Fixtures enriched** for all 28 candidates: phone, age, 2–4-row education history (BD universities/colleges/schools), current + previous employer with durations — derived deterministically so every load is identical; qualification math unchanged (verified: still exactly 12 of 28 at defaults).
- **⚠️ Age column governance note:** Age is part of STL's own provided format and is rendered as provided, with an on-page note that it is never a screening criterion and its display remains subject to Open Question 7. Worth an explicit confirmation from STL Legal/HR at the demo.
- **QA:** JS syntax-checked clean · data-shape validated by script (no candidate missing client-format fields) · `docs/` byte-identical.

---

# Round 10 — Interactive CV Analysis + dropdown spacing fix + report rename (2026-07-17)

## Dropdown spacing bug (`hr/candidates.page.html`)
- **Root cause:** `.field label` (specificity 0,1,1) outranked `.flt-ms-opt` (0,1,0), forcing the quick-row **Skills** and **Stage** option rows to `display:block` — which killed the flex `gap` (checkbox flush against the label) and leaked `font-weight:600` + `margin-bottom`. The advanced-panel dropdowns were unaffected because they don't sit inside a `.field`.
- **Fix:** scoped to `.flt-ms .flt-ms-opt` (0,2,0) so the option layout wins, with explicit `margin:0` / `font-weight:400` resets. Comment records why the descendant selector must stay.

## Rename — "Assessment Report" → "Summary Report"
- Sidebar nav, page title, `<h1>`, breadcrumb, and both entry-point links ("Open Summary Report" on `interviews`, "View summary report" on `final-selection`, head link on `written-exam`) — 22 files. Filename and `data-testid`s left unchanged so links and selectors stay stable. Matches the client's own "Summary format.xlsx" wording.

## CV Analysis Dashboard → decision-grade (R9 prompt)
Every number was previously a dead end; now every chart element is a live entry point.
- **Clickable cross-filtering** — score histogram, confidence bands, skill-coverage bars, red-flag bars, experience/education rows, source donut (slices *and* legend rows) and top-district chips are all selectable. Selections **AND across facet types, OR within one facet**; clicking an active segment de-selects. **A chart never filters itself** (`cvaCohort(except)`) so its segments stay visible and clickable while every *other* chart recomputes for the cohort — click "Career break" and their score distribution redraws underneath you.
- **Active-cohort strip** — removable chips per selection + Clear cohort, and a live read-out: cohort size, avg match, % in ≥75 band, avg confidence, red-flag rate, top-3 covered skills, top-3 gaps.
- **Captions became drill actions** — "Biggest gap: X — only N% have it" → *View the N candidates missing it*; "N parsed below 70%" → *Review those N*; "N% scored ≥80%" → *Preview a wider shortlist (lower to 70% → N)*; plus experience and flag drills.
- **Table drill-through** — header reflects the cohort ("Showing 21 candidates · Flag: Career break · ranked by match score"), shows the whole cohort with a Show-all expander, and **row skill chips / flag badges are themselves clickable** to pivot from one candidate to everyone like them. Empty-cohort state added.
- **Cohort hand-offs (navigational only)** — Export to Excel (existing flow); **Open in Candidates with these filters** → deep-links `candidates.page.html?srcs=…&scMin=…&adv=1`, which now parses those params and pre-applies the Round-5 `flt-` block; **Get shortlist suggestions** → `cv-review.page.html#ai-shortlist`, which now auto-opens its existing modal. Both are genuine reuse — no rebuilt filter or modal.
- **Implementation notes:** event delegation via `data-k`/`data-v` (no inline handlers in SVG; sidesteps quoting hazards with values like "A&P Budgeting"); band facets use safe keys (`lt50`, `90-100`) not display labels; all segments `role="button"` + `tabindex="0"` + Enter/Space + `aria-pressed` + `data-testid`; selection shown by stroke + label weight/color, never color alone. §6 cohort-compare deliberately skipped (documented in a comment) — it would double the layout at 1024px.
- **Governance unchanged:** read-only; cohorts drill/preview/export/navigate and never change a candidate's status; **no age/gender facet**, not even as a cohort dimension; footer note kept.
- **QA:** JS syntax clean · **cross-filter math verified by script** — every chart's segments sum to exactly 120 (score 18+33+27+24+13+5, confidence 27+59+34, experience 17+34+41+28, sources 70+27+18+5), cohort counts match independent recomputation (flag=Career break → 21 both ways; their score dist sums to 21), self-exclusion confirmed, and AND/OR verified (LinkedIn AND score≥80 → 4 both ways) · all links resolve · `docs/hr/` all 22 pages byte-identical.

---

# Round 11 — Online-presence identity model corrected + real .xlsx export (2026-07-17)

## Summary Report — "Export to Excel" now actually exports (`hr/assessment-summary-report.page.html`)
- The button previously just navigated to Exports. It now **generates and downloads a real `.xlsx`** — genuine Office Open XML in a ZIP, written by a self-contained CRC32 + STORE-method ZIP writer (**still zero dependencies, no build step**). A CSV or an HTML-file-renamed-`.xls` was rejected: the client's Summary format depends on **merged cells**, and only a real xlsx reproduces them (and opens without Excel's format-mismatch warning).
- **Reproduces the client format exactly:** title + position + date rows, the 11 client columns (Sl · Name · Age · Degree · Educational Institution · Passing Year · Result · Working Experience · Year of Exp. · Written Marks · Remarks) plus Viva/Combined, and the **row-block structure** — one candidate per block with a row per education level and Sl/Name/Age/Experience/marks/Remarks merged down the block. Name carries the phone on a second line, per the client's sheet. Frozen header, column widths, wrapped multi-line Working Experience cells, landscape page setup, signature line.
- **Exports what's on screen:** honours the current view mode, sort, pass marks and weighting; the header rows record the settings used. Filename `STL_Assessment_Summary_Sr_Brand_Manager_16.07.2026.xlsx`.
- **Verified by round-tripping:** ran the page's own export code headless and re-opened the output with `openpyxl` — opens cleanly, sheet `16.07.2026`, dims A1:M54, **113 merged ranges**, first block `A7:A10 B7:B10 C7:C10 H7:H10 I7:I10 J7:J10 K7:K10 L7:L10 M7:M10` with education rows 7–10 nested inside, freeze pane at A7.
- **Bug fixed (found via that dump):** R9 derived a Mr./Ms. honorific from the candidate's array index, producing *"Ms. Tanvir Hasan"*. Honorific removed — STL's format carries it, but it's a field the candidate supplies on the application form; inferring it from a name is unreliable and is a gender inference this platform does not make. Comment records the reasoning.

## Online Presence — identity model rebuilt (`hr/online-visibility-analysis.page.html`)
- **The core correction:** the R10 build asked HR to "Confirm — this is them" on *each source* (LinkedIn, portfolio, conference). That conflated *"which sources belong to this person"* with *"is this the person"*. **Identity is now ONE decision about the PERSON**, anchored on the profile photo + name; LinkedIn/GitHub/portfolio/publications are **source types** — findings attached to a confirmed person, never identity votes.
- **Step 1 — photo-anchored identity card:** large avatar (initials placeholder, labelled "Placeholder · demo"), name, LinkedIn headline, role @ employer, location, connections, education, LinkedIn badge, confidence badge, "Open LinkedIn profile ↗", and **one primary "Confirm — this is the candidate"** + "Not a match". Caption: the photo is a recognition aid, never analyzed, never scored.
- **Namesake picker only when names genuinely collide** — Mahmudul Hasan surfaces 2 competing real people (each with its own card/photo/headline) under "More than one person matches this name — pick the candidate, or none". The other 11 get one card, one confirm.
- **Step 2 — sources & information** (gated on that single confirmation): icon-led source grid (LinkedIn / GitHub / site / publications / talks / news / directory) with URL, snippet and a "looks wrong? dismiss" control — **no identity buttons here** — plus a consolidated two-column facts panel (roles, tenure, education, skills, certifications, location, publications, public-code count, mentions).
- **Step 3 — result** (gated): three visually distinct big-count buckets — **Matched with CV** (green, claim→evidence pairs), **Unmatched** (amber, split into *Contradiction — a real flag* vs *Not found publicly — neutral*, with "absence is not evidence"), **Extra — not on CV** (blue, bonus context) — plus a **score ring (0–100)** with three sub-bars (footprint breadth, CV corroboration, professional activity) and the unmissable caption that it measures footprint, not candidate quality.
- **Numbered 1·2·3 rhythm** replaces the wall of identical cards; step headers show lock state.
- **Step 0 confirmed present:** checkbox selection table (name, position, district, ATS score), "Load 12 sample candidates", live count, "Run online presence analysis on selected (N)", opt-in note.
- **Governance unchanged:** fixture-only; photo never analyzed/scored; score never feeds the match score and can't change status; no protected-characteristic data; verify-first is structural (Steps 2–3 gated in code).
- **QA:** JS clean · **verified by script** — 11 single-identity vs 1 namesake picker (2 people); **0 sources carry an identity flag** (model correction enforced in the data shape); score/sub-score derivation matches independent recomputation for all 12 (no drift); instructive cases behave — Mahmudul (namesake, 2 identities), Kazi Nazrul (contra=1 → Discrepancy), Farhana (vis=6, notfound=2 → neutral "Not found"), Sabrina (vis=83, extra=3 rich extras) · all internal links resolve · `docs/hr/` all 22 pages byte-identical.

---

# Round 12 — Exports produce real files (2026-07-17)

## ⚠️ Deviation from the brief — no CDN dependency
The R12 prompt's premise was that "a static prototype can't produce a true `.xlsx` with vanilla JS alone" and to load **SheetJS + JSZip from cdnjs**. That premise is false here: Round 11 already shipped a working zero-dependency `.xlsx` writer, verified by an openpyxl round-trip (merged cells, styles, frozen panes). Adding a CDN would have broken the no-dependency/no-build rule every prior round held, added an external network dependency (the prototype runs offline and from `file://`), and gained nothing. **Everything the brief asked for is delivered without a library.** If the team later wants SheetJS anyway, the builders are library-agnostic — only `STLX.build()` would swap.

## New shared assets (extracted, not duplicated)
- **`assets/js/stl-xlsx.js`** — dependency-free writers: real Office Open XML (**multi-sheet**, merged cells, styles, frozen panes, column widths, wrap, landscape) packaged in a STORE-method ZIP; a real `.zip` writer; and a CSV fallback. Generalised from the verified R11 code so there is **one** copy.
- **`assets/js/stl-fixtures.js`** — the single source of truth (R12 §2). Seeded PRNG pool, assessment marks, per-criterion explainability, panel. **Proven identical** to the dashboard's pool by script, so exports can't drift from what HR sees.
- **De-duplicated:** `cv-analysis-dashboard` (−5,840 chars of duplicate generator) and `assessment-summary-report` (fixture + entire inline ZIP/xlsx writer) now consume the shared modules. Both re-verified post-refactor — dashboard cross-filter maths unchanged (buckets still 18+33+27+24+13+5=120, cohort[Career break]=21, self-exclusion intact); Summary Report export byte-structure unchanged (A1:M54, 113 merges, freeze A7, same block merges).

## `hr/exports.page.html` — real, meaningful downloads
- **Generate now builds and downloads an actual file.** All **8 types** verified end-to-end by generating each headless and re-opening it with openpyxl / zipfile:

  | Type | Output | Verified |
  |---|---|---|
  | Excel export | `Candidates` sheet | 120 rows, columns = checked fields |
  | Final candidate summary | `Final summary` | 32 shortlisted, ranked |
  | Screening report | `Screening report` | **725 rows, 483 merges** — one row per criterion per candidate |
  | Assessment report | `Merit list` | 12 qualified, merit-ranked |
  | CV analysis | **2 sheets** — `Pool insights` + `Evaluation summaries` | insights 18+33+27+24+13+5 = **120, matching the dashboard exactly** |
  | Online-presence | `Online presence` | confirmed identities only |
  | Interview panel summary | `Panel summary` | per-criterion rollup + average |
  | Bulk CV download | **real `.zip`** | valid archive, 122 entries: `manifest.csv` + 120 CV stand-ins + README |

- **Meaningful, not just contact fields:** the screening report carries per-criterion **weight → contribution → CV evidence** (contributions verified to sum to each candidate's real match score); CV analysis carries the full pool insight tables; assessment carries marks/combined/result; online-presence carries identity confidence, score, bucket counts and source URLs.
- **Field selection genuinely drives columns** (verified: 2 fields → 2 columns, 8 fields → 8 columns, in checkbox order). **Scope genuinely filters rows** (verified: All → 120, Shortlisted only → 32, matching the fixture's stage distribution). New fields added per brief: Current/last position, Current/last company, Position applied, Parsing confidence, Stage/status, Source, Red flags, Applied date.
- **Live preview** (step 4) shows the first rows × selected columns, the sheet list for multi-sheet exports, the row count and the exact filename — updating on every type/scope/field change.
- **History "Download" re-downloads the real file** produced this session (held as a Blob); seeded rows say so honestly rather than pretending. Rows record file name + size, created-by, scope and options.
- **Graceful degradation:** if the shared scripts fail to load, the page shows a clear message and disables Generate rather than failing silently.
- **Governance:** age and gender are **not offered as fields at all** (not merely unchecked) with an on-page note; online-presence and screening exports carry their assistive-only header line; `REJECTED_PENDING_REVIEW` stays distinct from `REJECTED` in every status column; every generate still writes an audit-style history row.
- **QA:** all script blocks + both shared libs syntax-clean · every generated file opens · shared assets resolve from `hr/` and return 200 over the server · `docs/` 22 HR pages + 2 JS assets byte-identical.

---

# Round 9 — workflow spine (P0 + P1 from the workflow audit) · 2026-06-24

Full findings + resolution log: `.claude-project/design/WORKFLOW_AUDIT.md`.

**P0 — demo blockers**
- **HM → HR handoff made real.** It previously existed only as a timed JS redirect; added a visible "Open HR selection panel" link (`hm/final-selection` → `hr/final-selection`).
- **Stepper now spans roles.** Rebuilt as a role-aware component: present on all 19 workflow pages including the 5 Hiring Manager stage pages, with targets resolving correctly across `hr/` ↔ `hiring-manager/`.
- **Spine extended to 10 stages** — stage 9 relabelled *Selection*, new stage **10 · Onboard**, so the cycle visibly completes.

**P1 — clarity**
- **Both sidebars rebuilt to mirror the spine**: numbered *Hiring Workflow* group (1–10) with indented companion views, plus a separate *Talent & System* group. Previously-missing stages (Template, Processing, Schedule Viva, Onboarding) are now navigable.
- **Interview pages disambiguated**: `interviews` = Viva & Interviews **tracker**; `interview-schedule` = **Schedule Viva** action. Retitled, cross-linked, one sidebar entry + sub-item.
- **Analysis pages given a home**: CV Analysis (Stage 4), Online Presence (Stage 5), Summary Report (Stage 9) each carry a stage tag + link back to the owning stage.
- Sidebars made sticky + internally scrollable for the longer numbered nav.

**QA:** 40/40 reachable · 0 broken links · 0 emoji-icons · brand blue 40/40.

---

# Round 10 — P2 from the workflow audit · 2026-06-24

- **Drill-down context (M5).** HR + HM candidate-detail pages now show a "Stage N · detail" tag with a link back to the owning stage, so a drill-down no longer reads as the stage itself.
- **Re-screening (G5).** "Re-screen with updated template" on Screening Results → confirmation modal (v3→v4, 4,820 re-scored, overrides preserved, no re-upload, human review still applies) → Processing. Companion link added on the Template Builder.
- **PRD v2 (M7).** Added §0.5 the 10-stage spine with ownership rules, Module 8 (Written Exam & Viva), Module 9 (Decision Support & Analytics), new terminology and status enums, and a stage-annotated HR/HM page map replacing the stale upload/batches/duplicates routes. Snapshot `PRD_v2`; `DESIGN_STATUS` pinned to `prd_version: v2`.
- **Support-role framing (G6).** Viewer + Admin dashboards labelled "Support role — outside the 10-stage hiring workflow."

**QA:** 40/40 reachable · 0 broken links · 0 emoji-icons · brand blue 40/40. All audit items M1–M7 / G1–G6 closed.

---

# Round 11 — Online Presence: full page + CV Analysis feedback loop · 2026-06-24

**New page — `hr/online-presence-detail.page.html`** (replaces the cramped right-side drawer with a direct-target full page, opened via `?c=<id>`):
- **Identity verification with "next best match".** Each candidate carries an ordered list of possible matches. **"Not a match"** discards the current profile and shows the next one ("Showing match 2 of 3", with progress dots and a "← Previous match"). When the list is exhausted: "No further matches found" → **Mark as Not found publicly**, with an explicit note that absence of a footprint is not a negative signal.
- **Gated report.** Sources/info/cross-check/signals stay locked until a human confirms identity — one decision, made by a person, never by the AI.
- **Expanded sources:** LinkedIn, Facebook, Instagram/X, personal website & portfolio, publications & research, news & press, conference/speaking, professional directory — each with a "posts / activity" note and a "looks wrong? dismiss" control.
- **Information gathered:** name, photo (placeholder), current role, work history with dates, education, research/publications, portfolio, **From (hometown)**, **Lives in**, skills, certifications, public-post summary, news mentions — each showing its source, "—" when not found.
- **CV cross-check visualisation:** four colour-coded groups with count badges and a summary strip (`6 matches · 1 mismatch · 2 not found · 3 extra`) — **Matches** (green), **Mismatches** with side-by-side "CV says · Sources say" (red), **Not found** (muted), **Additional findings** (blue).
- **Reputation signals:** *Positive / achievements* vs *Risks / adverse findings*, with an explicit **"None found"** empty state.
- 6 instructive fixtures: clean/strong · 3-way namesake (demonstrates the cycling) · real mismatch + adverse trade-press finding · sparse/low-confidence · research-heavy · socially-active but thin. Print rules produce a clean document.

**CV Analysis feedback loop (Stage 5 → Stage 4).** Running the analysis now publishes results (`oviPublishToAnalysis`) and the dashboard consumes them:
- List page shows a green **"Added to CV Analysis"** confirmation + *Open CV Analysis*.
- CV Analysis gains an **"Online presence"** card: strong/moderate/sparse distribution bars plus *analysed · identity confirmed · with mismatches · adverse findings* badges, and a takeaway that flags candidates needing a closer look. Empty state with a **Run Online Presence analysis** CTA before the analysis is run.
- Governance preserved throughout: presence is **assistive only and never part of the ATS match score**.

**QA:** 41/41 reachable · 0 broken links · 0 emoji-icons · brand blue 41/41 · stepper on 20 pages.

## Round 11a — fix: Online Presence report layout blowout · 2026-06-24

- **Bug:** every fixture record defined `pos:` **twice** — once as the job title string and again as the positives array. JS keeps the last key, so `c.pos` was always the array; the hero subtitle rendered the whole array as comma-joined text (including full URLs), which forced the page into infinite horizontal scroll. Renamed the array key to `positives:` across all 6 records and updated its 4 consumers. Verified: `pos` is now a string and `positives`/`risks` are arrays for all 6 candidates.
- **Overflow guards** added so no long URL or string can widen the page again: `min-width:0` on grid/flex children, `overflow-wrap:anywhere` on text blocks, `overflow-x:hidden` on the content column.
- **"At a glance" verdict strip** added under the hero for fast scanning — Identity · Sources · Matches · Mismatches · Not found · Risks, colour-coded, with cross-check figures deliberately hidden until a human confirms identity (collapses 6→3→2 columns responsively).
