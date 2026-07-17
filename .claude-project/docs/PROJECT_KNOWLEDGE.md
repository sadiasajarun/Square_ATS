# PROJECT_KNOWLEDGE — STL AI-Powered ATS (`stl-ats`)

**Compiled:** 2026-07-16
**Repo:** `D:\Square_ATS` → `github.com/sadiasajarun/Square_ATS` (branch `main`)
**Client:** Square Toiletries Limited (STL)
**Current state:** Design/prototype phase complete. **No application code exists yet** — no `backend/`, no `frontend/`. What ships today is a clickable HTML prototype plus the full spec/design artifact set.

This document is the single consolidated snapshot of what this project *is* and what has actually been *done*. It is assembled from the seed spec, PRD, design system, pipeline status, and the round-by-round change log.

---

## 1. What the product is

A web-based **Applicant Tracking System with AI-assisted CV screening** for STL's HR team.

HR defines job positions with weighted, position-specific screening templates, bulk-uploads CVs (5,000+ per batch), and receives AI-assisted, **fully explainable** shortlist recommendations.

### The four non-negotiable principles

These are hard constraints from the seed spec, not preferences. They shape every screen and every future code path.

1. **Human-in-the-loop — zero automated rejections.** No code path may finalize a rejection without an explicit HR action plus a logged reason. Below-threshold candidates are marked `REJECTED_PENDING_REVIEW`, never `REJECTED`.
2. **Explainable scoring.** Every match score must expose per-criterion contributions, matched/missed CV evidence, and red flags. No black-box outputs.
3. **Bilingual as first-class.** Bangla + English CVs both fully supported — Unicode normalization, language-aware parsing, bilingual dictionaries.
4. **Full audit trail.** Uploads, parsing, scoring runs, overrides, shortlist movements, exports, and admin actions are all logged immutably.

Governance is aligned to NIST AI RMF, ISO/IEC 42001, and OWASP LLM Top 10. Templates and AI prompts are version-controlled for traceability.

### Roles (RBAC — 4 roles)

| Role | DB value | Can do | Cannot do |
|------|:--------:|--------|-----------|
| **Viewer** | `0` | Read-only: assigned positions, candidate profiles, reports | Anything mutating |
| **Hiring Manager** | `1` | Review shortlist, accept/reject for next round, interview feedback, **final candidate selection** | Upload CVs, override screening scores, schedule interviews |
| **HR** | `2` | *Primary user.* Positions, templates, uploads, screening review, overrides, comms, scheduling, exports, onboarding | Select the final candidate (HM-only) |
| **Admin** | `99` | Users, roles, module permissions, system settings, audit trail | — |

User status: **Active** (`0`) / **Inactive** (`1` — cannot log in, sees "Your account is deactivated. Contact your administrator.").

### Scope

**In scope (v1 = all 7 modules):** User Management & Security · CV Upload & Parsing · AI Screening & Matching · Candidate Database & History · Export & Reporting · Integration & Workflow · AI Governance & Accuracy.

**Explicitly out of scope:** candidate-facing self-service portal (candidates get email/SMS only) · full employment/fraud verification (inconsistency *indicators* only) · automated rejection.

---

## 2. The seven modules

| # | Module | Core content |
|:-:|--------|--------------|
| 1 | **User Management & Security** | Admin user CRUD, RBAC across 4 roles with module-level permission toggles, password policy, JWT httpOnly-cookie sessions with token rotation, full audit trail, TLS + at-rest encryption, malware-scan readiness. |
| 2 | **CV Upload & Parsing** | Drag-drop bulk 5,000+/batch via Redis queue. PDF (digital + scanned), Word, JPG, PNG. OCR via pluggable `IOcrService`. Bangla + English parsing. Per-file status + extraction-confidence + missing-field flags. Duplicate detection within batch (file hash) and against DB (email, phone, name, profile similarity). Email-inbox + job-portal import (adapter-ready). |
| 3 | **AI Screening & Matching** | Versioned position-wise templates. Criteria: age, gender, education, years of experience, past positions, skills, location, certifications. Weighted scoring + include-keyword (must-have) / exclude-keyword (disqualifier) filters. % match score + auto-shortlist threshold. Red-flag detection. Score explanation panel. Re-screening on criteria change **without re-upload**. |
| 4 | **Candidate Database & History** | Master profiles, application history (last applied, previous positions, previous shortlist status), tagging, bookmarking, full-text + structured talent-pool search. |
| 5 | **Export & Reporting** | Bulk original-CV bundle, customizable-field Excel, STL predefined Excel format, screening reports, interview panel summaries — all audit-logged. |
| 6 | **Integration & Workflow** | Templated SMTP email (real), templated SMS (stub adapter), interview scheduling (slots, panels, invites), delivery + schedule status tracking. |
| 7 | **AI Governance & Accuracy** | Explainable scoring, mandatory-reason overrides, weighted-scoring suggestions, enforced human review, version-controlled templates/prompts, accuracy validation vs. annotated ground truth, controlled feedback loop from validated HR overrides. |

### Status enums

| Enum | Values |
|------|--------|
| `CvProcessingStatus` | `PENDING`, `PROCESSING`, `PARSED`, `SCREENED`, `SHORTLISTED`, `REJECTED_PENDING_REVIEW`, `DUPLICATE`, `FAILED` |
| `BatchStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `ApplicationStatus` | `SCREENED`, `SHORTLISTED`, `REJECTED_PENDING_REVIEW`, `REJECTED`, `IN_INTERVIEW`, `ADVANCED`, `RETURNED_TO_HR` |
| `InterviewStatus` | `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |
| `NotificationStatus` | `QUEUED`, `SENT`, `DELIVERED`, `FAILED` |
| `UserRole` | `VIEWER`, `HIRING_MANAGER`, `HR`, `ADMIN` |

---

## 3. Domain model (13 entities)

From the seed's `ATSDomainModel` ontology:

| Entity | Role |
|--------|------|
| `User` | Role, status, module permissions, credentials |
| `JobPosition` | Title, department, designation, description, status; owns template versions |
| `ScreeningTemplate` | Version-controlled: weighted criteria, include/exclude keywords, threshold, AI prompt version |
| `Criterion` | One weighted screening dimension |
| `CandidateBatch` | Upload batch tied to a position; aggregate progress + counts |
| `CvFile` | Format, storage key, file hash, per-file status, extraction confidence, missing-field flags |
| `Candidate` | Master profile: name, contact, district, education, experience, skills, tags, bookmark |
| `Application` | Links Candidate → JobPosition via CvFile; match score, status, shortlist state |
| `ScreeningResult` | % score, per-criterion contributions, matched/missed evidence, red flags, prompt/template version |
| `Override` | HR decision change: mandatory reason, actor, timestamp → audit + AI feedback |
| `Interview` | Slot, panel, invite, status, HM feedback |
| `Notification` | Email/SMS: template, channel, delivery status |
| `AuditLog` | Immutable record of every significant action |
| `ExportJob` | Export request: field selection, status, audit linkage |

---

## 4. Tech stack (decided, not yet built)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | **NestJS 10.x** (TypeScript) | **Overrides the source doc's Laravel/FastAPI** — chosen to align with the existing `.claude` tooling, rules, gates, and base-class architecture. 4-layer: Controller → Service → Repository → Entity |
| ORM | TypeORM 0.3.x | BaseEntity/BaseRepository, UUID PKs, soft delete |
| Database | PostgreSQL 16.x | |
| Queue | Redis + BullMQ | Required for 5,000+ CV async batches |
| Search | OpenSearch 2.x / Elasticsearch 8.x | Talent-pool search |
| Storage | S3-compatible (MinIO/S3) | Original CVs + export artifacts |
| Frontend | React 18.x + React Router 7.x | Framework mode |
| State | Redux Toolkit (async thunks) | **Not** TanStack Query |
| CSS | Tailwind CSS 4.x + Shadcn/UI | |
| Build | Vite | |
| Realtime | Socket.io | Live batch/screening progress |
| Container | Docker | Cloud/on-prem/hybrid portability |

### Key build decisions

- **Hybrid AI scoring** — a deterministic weighted engine is the scoring *core* (guarantees explainability + offline operation); an optional Anthropic LLM pass adds extraction nuance and red-flag narrative. **Falls back to rules-only when no API key** is configured.
- **OCR + SMS as pluggable adapters**, stubbed in v1 — decouples vendor selection from delivery. Digital PDF/Word parse directly.
- **JWT in httpOnly cookies**, never localStorage; token rotation on refresh.
- **Human-in-the-loop enforced in code**, not just UI.

### Environment variables

`DATABASE_URL` · `REDIS_URL` · `JWT_SECRET` (no fallback — throws if missing) · `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` · `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` · `SEARCH_NODE` · `ANTHROPIC_API_KEY` (optional → rules-only if absent) · `OCR_PROVIDER` / `OCR_API_KEY` · `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` · `SMS_PROVIDER` / `SMS_API_KEY` · `FRONTEND_URL` · `VITE_API_URL`

---

## 5. Design system — Variation A "Clarity"

Three variations (A/B/C) were generated with a representative HR-dashboard page each; **the client picked A** and it was approved 2026-06-23. Primary was then rebranded from indigo to Square Toiletries corporate blue.

**DNA:** Clean, neutral, professional SaaS (Stripe / Linear lineage) carrying Square Toiletries' corporate blue. Maximum legibility, generous whitespace, subtle borders.

### Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--primary` | **`#0B61C2`** | **Square brand blue** — primary actions, active nav |
| `--primary-hover` | `#094E9E` | Hover |
| `--primary-soft` | `#E6F0FB` | Selected rows, badge bg |
| `--accent` | `#1E88E5` | Bright Square blue — highlights, focus rings, links |
| `--bg` | `#F8FAFC` | App background |
| `--surface` | `#FFFFFF` | Cards, panels, tables |
| `--surface-2` | `#F1F5F9` | Subtle fills, table header |
| `--border` | `#E2E8F0` | Hairline borders |
| `--text` | `#0F172A` | Primary text |
| `--text-muted` | `#64748B` | Secondary text |

### Status semantics (mapping is fixed across all variations)

| Status | Semantic | Hex / soft |
|--------|----------|-----------|
| Shortlisted / Advanced / Active / Delivered | Success | `#16A34A` / `#DCFCE7` |
| Screened / Parsed / In Interview | Info | `#0369A1` / `#E0F2FE` |
| Pending / Processing / Queued | Warn | `#D97706` / `#FEF3C7` |
| Rejected-pending / Failed / No-show | Danger | `#DC2626` / `#FEE2E2` |
| Duplicate | Caution | `#7C3AED` / `#EDE9FE` |
| Inactive / Cancelled | Muted | `#64748B` / `#F1F5F9` |

### Typography & shape

- **Font:** Inter, system-ui fallback. Bangla: Noto Sans Bengali. Scores use tabular-nums.
- Scale: display 28/700 · h1 22/700 · h2 18/600 · body 14/400 · small 13/400 · label 12/500 uppercase.
- Base unit 4px · card padding 24px · section gap 24px · table cell 12px 16px.
- Radius: cards 12px · inputs/buttons 8px · badges 6px · pills 999px.
- Sidebar white, 248px, brand-blue active item (soft bg + primary text + 3px left accent).
- Score bar bands: <50 danger · 50–74 warn · ≥75 success.

### Quality rules enforced

Contrast ≥ 4.5:1 (WCAG AA) · status never color-only · `cursor-pointer` + focus ring + `data-testid` on interactives · hover = color/opacity only (no scale/layout shift) · **no emojis as icons** (inline SVG only) · semantic HTML · responsive 1440/1280/1024/768 · all inputs labeled.

---

## 6. What has been built — the prototype

**35 interlinked HTML pages** (36 in the deployed copy, counting `index.html`). Pure HTML + CSS + inline SVG + vanilla inline JS. **No build step, no dependencies, no framework.**

### Page inventory

| Role | Count | Pages |
|------|:-----:|-------|
| `auth` | 2 | login, forgot-password |
| `hr` | 22 | dashboard, positions, position-new, position-detail, template-builder, import-cvs, processing, cv-review, results, application-detail, candidates, candidate-detail, cv-analysis-dashboard *(R6)*, written-exam *(R7)*, assessment-summary-report *(R7)*, online-visibility-analysis *(R8)*, interviews, interview-schedule, final-selection, onboarding, exports, settings |
| `hiring-manager` | 6 | dashboard, shortlist, application-detail, interviews, interview-rating, final-selection |
| `viewer` | 4 | dashboard, position-detail, candidate-detail, reports |
| `admin` | 5 | dashboard, users, user-detail, audit, settings |

All files use the `.page.html` suffix (established round 1; the whole prototype is interlinked on it).

### The full clickable flow

```
login → pick a role
HR:  Dashboard → Job Positions → Template Builder → Import CVs → Processing
     → Review CVs → AI Shortlist → Screening Results → Send to Hiring Manager
HM:  Shortlist Review (accept/reject) → Interview Feedback (score)
     → Final Selection (AI suggests → HM selects) → sends to HR
HR:  Final Selection (read-only) → Onboarding (offer email + checklist)
```
Plus Admin (users/audit/settings), Viewer (read-only), and Sign out from any page.

### Cross-page workflow stepper

A persistent indicator sits at the top of all 9 position-flow pages:

`Template → Import → Process → Review → Shortlist → Hiring Manager → Interview → Hire`

Completed = green check + clickable · current = solid Square-blue dot · future = muted. Uses unique `wf-` prefixed classes (`wf-stepper/wf-step/wf-dot/wf-sep`) to avoid collisions.

### HR sidebar nav grouping

```
Workspace          Dashboard · Job Positions
Hiring Workflow    Import CVs · Review CVs · Screening Results · Interviews · Final Selection
Talent & System    Candidates · Exports · Settings
```

### Mock data convention

FMCG / Bangladesh-realistic: Bangla + English names, Bangladeshi districts, FMCG roles (e.g. Sr. Brand Manager).

---

## 7. Build history — round by round

### Round 1 (2026-06-23) — pipeline P1→P3
Seed spec (ambiguity 0.10) → PRD v1 (508 lines) → design guide → 3 variations → client picks A → rebrand to Square blue → 30 role-folder HTML pages generated via parallel agents → QA + snapshot.

### Round 2 (2026-06-23) — major flow buildout
- **Login logo** added (`assets/img/logo-square.webp`, max-height 64px, above the card).
- **Template Builder reworked** from a flat weight list into a full builder: optional screening-guidance prompt, "+ Add new criterion" popover, per-row enable toggles (the live "Total: NN%" counts **only enabled** rows; toggling redistributes proportionally), and per-criterion input UIs — Skills (chips + 10 AI-suggested), Age (dual-handle 18–65), Gender (segmented), Education (min-level + field chips), Experience (stepper + chips), Past Position, Location (district autocomplete), Certifications (Required/Preferred), Custom field. Global keyword filters moved to the bottom.
- **`upload.page.html` → `import-cvs.page.html`** with three sources: bulk file upload (5,000/batch), job-portal import (LinkedIn / BDJobs / Bdjobs Premium / Other), email-inbox import.
- **New `processing.page.html`** — aggregate progress + per-stage chips (Queued/OCR/Parsing/Scoring), duplicate triage (compare modal, reject/keep), files-needing-attention (unsupported/corrupt/OCR-failed/too-large). **"Continue to review" is disabled until every triage row is resolved.**
- **New `cv-review.page.html`** — sticky table with parsed-profile drawer, color-coded confidence (≥90 / 70–89 / <70), AI match score, row quick-actions.
- **New AI Shortlist Suggestion modal** — score-distribution histogram + 5 strategies (Top N, Above threshold, Balanced by skill coverage, Top N per location, Manual) with live preview. Applying bulk-sets matches to Shortlisted and the rest to **"Rejected — pending HR review"** with a governance note.
- **Results dashboard repositioned** after the shortlist step; KPI row + tabs + "Send shortlist to Hiring Manager" modal.
- **New:** `interview-schedule` (grid + email-template editor with merge tokens + live preview), `interview-rating` (1–5 stars across Technical/Communication/Culture fit/Domain/Overall), `final-selection` (AI recommendation + comparison table), `onboarding` (offer email + 6-step checklist).
- **QA:** 34/34 reachable · 0 broken links · 0 emoji icons · brand blue on all 34.

### Round 3 (2026-06-24) — bug fixes + HM/HR responsibility rework
Three real bugs found and fixed:
1. **Stepper rendered unstyled** on template-builder — its own `.stepper` class collided with the injected one. Fixed by re-injecting under unique `wf-` classes.
2. **"+ Add new criterion" threw** — the handler was named `togglePopover`, colliding with the native `HTMLElement.togglePopover()` Popover API. Renamed → `toggleAddPopover`.
3. **Blank confirm button** on HM final-selection — now shows visible "Confirm selection" text.

Responsibility split clarified — **only the HM selects the final candidate; HR's final-selection is read-only**:
- HM Shortlist Review → view-profile + Accept/Reject only (scoring removed); decided rows show "Accepted/Rejected — sent to HR" + a "Change decision" redo.
- HM Interview Feedback → all scheduling UI removed (HM doesn't schedule); read-only date/time + Scored status.
- **New `hiring-manager/final-selection.page.html`** with "Select for onboarding" → confirm → "Sent to HR for onboarding".
- HR `final-selection` → read-only + "Selected by Hiring Manager" badge + "Proceed to onboarding".
- HR `interview-schedule` → after "Send invites", switches to a tracking view + "Schedule new interview".
- Onboarding → send-offer transitions to a sent state; start-onboarding shows a tracked X/6 checklist.
- **Exports rebuilt functional** — type → scope → conditional options (Excel field checklist) → Generate → prepends to export history with a download link.
- **QA:** 35/35 reachable · 0 broken links · Square blue 35/35.

### Round 4 (2026-06-24) — UI polish + deploy
- Removed the standalone skill "+" button from the Skills criterion (skills add via typing/Enter + AI chips; +/− steppers remain on the weight %).
- **CV files are now downloadable** — `cv-review` filename is a download link (mock CV via Blob); `application-detail`'s "View original PDF" became a working Download CV link.
- **"Create & send invitation"** now works — shows confirmation + disables the button, no page reload.
- **Hosting:** added `docs/` as a deployable copy + `docs/index.html` redirecting to login + `.nojekyll`. Pushed to `github.com/sadiasajarun/Square_ATS`.
- **QA:** canonical 35/35 · `docs/` 36/36 · `docs/` byte-identical to canonical.

---

## 8. Repo layout

```
D:\Square_ATS\
├── docs/                    ← THE HOSTED PROTOTYPE (GitHub Pages serves this)
│   ├── index.html           ← redirects to auth/login.page.html
│   ├── .nojekyll
│   ├── assets/  auth/  hr/  hiring-manager/  viewer/  admin/
├── .claude-project/
│   ├── context/PRD_FULL_CONTENT.md      ← original client source doc (382 lines)
│   ├── docs/PRD.md                      ← canonical PRD v1 (508 lines)
│   ├── docs/PROJECT_KNOWLEDGE.md        ← this file
│   ├── prd/STL_ATS_PRD.md + history/    ← v1 snapshot + hash
│   ├── design/
│   │   ├── DESIGN_SYSTEM.md             ← the approved A (Square blue)
│   │   ├── DESIGN_SYSTEM_{A,B,C}.md     ← the three candidates
│   │   ├── STL_ATS_DesignGuide.md
│   │   ├── _SHARED_SHELL_A.html         ← verbatim style block reused by every page
│   │   ├── _WORKFLOW_COMPONENTS.md      ← stepper + nav grouping source of truth
│   │   ├── html/                        ← CANONICAL 35-page tree
│   │   └── variations/                  ← A/B/C dashboards + showcase-ALL
│   └── status/stl-ats/                  ← PIPELINE_STATUS, DESIGN_STATUS, DESIGN_QA_STATUS, seed yaml
├── .claude/                 ← build pipeline / rules tooling (771 files)
├── CHANGES.md               ← per-round revision log (rounds 1–4)
└── README.md                ← prototype overview + Pages setup
```

> **Important:** `docs/` is a *generated copy* of `.claude-project/design/html/` — GitHub Pages cannot serve the dotted `.claude-project` folder. **Always edit the canonical tree, then re-copy into `docs/`.**

### Deployment

GitHub Pages, `main` branch, `/docs` folder → `https://sadiasajarun.github.io/Square_ATS/` (root redirects to login). Setup steps are in [README.md](../../README.md).

---

## 9. Pipeline status

| Phase | Status | Score | Output |
|-------|--------|-------|--------|
| P1-spec | ✅ Complete | 0.90 | `seed-stl-ats-v1.yaml`, ambiguity **0.10** |
| P2-prd | ✅ Complete | 0.92 | `docs/PRD.md` v1, 508 lines, all sections |
| P3-design | ✅ Complete | **8/8 checks** | 35 HTML pages across 5 role folders; DESIGN_STATUS approved + `phase_complete` |

**Pipeline score: 0.90.** Track: `pm`.

> **Known quirk:** the gate-runner mislabeled the P3 row "Failed" purely because its score-arithmetic step needs `bc`, which isn't installed in this Windows git-bash. The proof file records `passed: 8/8` — **the design phase genuinely PASSED**. Don't re-litigate this.

### Evaluation weights (from the seed)

| Principle | Weight |
|-----------|:------:|
| Human-in-the-loop integrity | 0.25 |
| Explainability | 0.20 |
| Functional completeness | 0.20 |
| Bulk-processing robustness | 0.15 |
| Security & audit | 0.10 |
| Bilingual support | 0.10 |

Exit condition: `evaluation_score >= 0.8`. Safety valve: `iterations > 10`.

### Artifact hashes (P3g snapshot)

- `prd_hash_at_generation`: `af5ab029646450bce8908c8cd44b85d7a9bc18e5692d85b41700f49e03cf9a63`
- `html_bundle_hash`: `5315e1551484bbfb6a7f3c68150ff4534a695b40aa0c419aafba82f5c80a752f`
- P3-design gate `checks_hash`: `058618ec2a7e98fe484e96039b95a6268ab4eeba5b224bec7127ea609d02f238`

---

## 10. Open questions — blocking full build

All 9 are still **⏳ Open** and owned by the client. (#9, added R8: enrichment provider + Legal approval + candidate-notice policy for the online-presence feature.)

| # | Question | Impact | Owner |
|:-:|----------|--------|-------|
| 1 | Which OCR provider (Azure vs Google vs on-prem)? | Scanned-CV accuracy + data residency; v1 uses stub | STL |
| 2 | Which SMS gateway? | Module 6 delivery; stubbed until chosen | STL |
| 3 | Exact STL predefined Excel summary format? | Module 5 export must match exactly | STL HR |
| 4 | Email-inbox / job-portal import credentials & APIs? | Whether import is active in v1 or adapter-only | STL IT |
| 5 | Data-retention durations + archival/deletion policy? | Retention workflows + audit defaults | STL |
| 6 | Ground-truth annotated CV set? | Required for the Module 7 accuracy benchmark | STL HR |
| 7 | **Are gender/age criteria permitted under STL policy + local labour law?** | Governance — sensitive criteria only within client-approved configs | STL Legal/HR |
| 8 | Deployment target (cloud vs on-prem vs hybrid)? | OCR/LLM connectivity + infra setup | STL IT |

Question 7 deserves attention before build: the template builder already ships Age and Gender criteria UIs, so a legal "no" would mean removing shipped screens.

---

## 11. What comes next

The prototype and spec are done; **the application itself is not started**. The remaining pipeline (per `/fullstack-dev`) is D1–D10:

1. **Database** — `src/core/base/` base classes first, then the 13 entities as TypeORM entities extending `BaseEntity`, migrations.
2. **Backend** — NestJS 4-layer modules per feature, Swagger on every controller, class-validator on every DTO, seed script from `_fixtures.yaml`.
3. **Frontend** — convert the 35 HTML pages to React. **The HTML prototype is the source of truth** (RULE-F7) — an `HTML_STRUCTURE_INVENTORY.md` must be written *before* any React page (RULE-F9).
4. **Integrate** — wire to real APIs via Redux async thunks.
5. **Test** — e2e API tests, then browser tests from YAML user stories.
6. **Ship** — production builds + drift check.

### Not yet created

- `backend/` and `frontend/` directories
- `.claude-project/user_stories/` (including `_fixtures.yaml`, needed for the seed script and Playwright `global-setup.ts`)
- `.claude-project/docs/PROJECT_API.md`, `PROJECT_DATABASE.md`
- `HTML_STRUCTURE_INVENTORY.md`

### Gotchas worth carrying forward

- **Class-name collisions** with injected components — the stepper bug happened because a page defined its own `.stepper`. The `wf-` prefix convention exists for this reason.
- **Native API collisions** — `togglePopover` broke because it shadows `HTMLElement.togglePopover()`. Watch for handler names that collide with DOM APIs.
- **`docs/` drift** — it's a copy, not a symlink. Editing `docs/` directly means the canonical tree silently falls behind.
- **The backend stack overrides the source doc.** The client's original doc says Laravel/FastAPI; every artifact here says NestJS. NestJS wins — it's a recorded decision in both the seed and the PRD.
