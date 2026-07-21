# STL AI-Powered ATS — Product Requirements Document

**Version:** 2.0
**Date:** 2026-06-24
**Status:** Draft — aligned with the approved clickable prototype
**Client:** Square Toiletries Limited (STL)

> **v2 changes:** adds STL's two-part assessment (**Written Exam** + **Viva**), the **CV Analysis**, **Online Presence** and **Assessment Summary** decision-support views, and formalises the **10-stage hiring workflow** with explicit role ownership (§0.5). Terminology, status values, modules (8–9) and the page map are updated to match the prototype.

---

## 0. Project Overview

### Product

**Name:** STL AI-Powered ATS (Applicant Tracking System)
**Type:** Web App (internal enterprise tool)
**Deadline:** TBD
**Status:** Draft

### Description

A web-based Applicant Tracking System with intelligent CV screening for Square Toiletries Limited's HR team. HR defines job positions with weighted, position-specific screening templates, bulk-uploads CVs (5,000+ per batch), and receives AI-assisted, fully explainable shortlist recommendations. The system enforces human-in-the-loop control: AI assists, HR decides, and no candidate is ever rejected automatically. Bangla and English CVs are treated as first-class.

### Goals

1. Replace slow, inconsistent manual CV screening with consistent, auditable, AI-assisted screening.
2. Make every AI score explainable — show which criteria contributed and what CV evidence was used.
3. Build a reusable, searchable talent pool with full candidate application history.
4. Provide a complete audit trail of every screening decision, override, and export.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | STL HR team — create positions/templates, upload CVs, review AI results, override, shortlist, communicate, schedule, export. |
| **Secondary** | Hiring Managers (interview feedback), Viewers (department heads / internal audit), Admin (system administration). |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Viewer** | `0` | Read-only stakeholder (dept heads, audit) | Read assigned positions, profiles, reports |
| **Hiring Manager** | `1` | Reviews shortlisted candidates | Interview feedback, accept/reject for next round, return to HR |
| **HR** | `2` | Primary user | Positions, templates, uploads, screening review, overrides, comms, scheduling, exports |
| **Admin** | `99` | System administrator | User/role/permission management, system settings, audit monitoring |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access per role |
| **Inactive** | `1` | Cannot log in — show: "Your account is deactivated. Contact your administrator." |

### MVP Scope

**Included (9 modules):**
- Module 1 — User Management & Security (RBAC, audit, encryption)
- Module 2 — CV Upload & Parsing (bulk async, bilingual, duplicate detection, OCR-ready)
- Module 3 — AI Screening & Matching (weighted templates, explainable scores, red flags)
- Module 4 — Candidate Database & History (master profiles, talent pool, search)
- Module 5 — Export & Reporting (CV bundles, Excel, screening reports)
- Module 6 — Integration & Workflow (email real, SMS stub, interview scheduling)
- Module 7 — AI Governance & Accuracy (explainability, overrides, versioned templates)
- **Module 8 — Assessment: Written Exam & Viva** *(new in v2)* — STL's two-part assessment, panel scoring, combined merit sheet
- **Module 9 — Decision Support & Analytics** *(new in v2)* — CV Analysis dashboard, Online Presence analysis, Assessment Summary report

**Build decisions (overrides / realizations):**
- Backend stack is **NestJS (TypeScript)**, not the doc's Laravel/FastAPI.
- AI scoring is **hybrid**: deterministic weighted engine as the scoring core + optional LLM (Anthropic) for extraction & red-flag narrative; falls back to rules when no API key is configured.
- OCR via a **pluggable `IOcrService` adapter** with a stub/local implementation in v1; digital PDF/Word parsed directly; cloud provider (Azure/Google) wired later.
- Notifications: **real SMTP email** (templated); **SMS as a pluggable adapter with a stub/log implementation** until a gateway is chosen.

**Excluded (explicitly out of scope):**
- Candidate-facing self-service portal (candidates receive email/SMS only).
- Full employment/fraud verification (system detects inconsistency *indicators* only).
- Automated rejection (human review mandatory before any rejection).

---

## 0.5 Hiring Workflow — the 10-stage spine *(new in v2)*

Every position moves through one numbered, linear spine. The stage number is shown as a persistent step indicator on every workflow screen, and both the HR and Hiring Manager sidebars are grouped and numbered to match it.

`1 Template → 2 Import → 3 Process → 4 Review → 5 Shortlist → 6 Hiring Manager → 7 Written Exam → 8 Viva → 9 Selection → 10 Onboard`

| # | Stage | Owner | Primary screen | Companion / decision-support view |
|---|-------|-------|----------------|-----------------------------------|
| 1 | **Define role & criteria** | HR | Job Positions → Screening Template | — |
| 2 | **Import CVs** | HR | Import CVs | — |
| 3 | **Process & triage** | HR | Processing (duplicates, failed files) | — |
| 4 | **Review parsed CVs** | HR | Review CVs | **CV Analysis dashboard** |
| 5 | **Shortlist** | HR | Screening Results | **Online Presence analysis** |
| 6 | **Hiring Manager review** | **Hiring Manager** | Shortlist Review (accept / reject) | Candidate detail |
| 7 | **Written exam** | HR | Written Exam | — |
| 8 | **Viva** | HR schedules · **HM scores** | Schedule Viva → Viva & Interviews tracker | HM Interview Rating |
| 9 | **Final selection** | **HM selects** → HR confirms | HM Final Selection → HR Final Selection (read-only) | **Assessment Summary report** |
| 10 | **Onboarding** | HR | Onboarding (offer email + checklist) | — |

### Ownership rules
- **Only the Hiring Manager selects** the candidate for onboarding (stage 9). HR sees the full comparison panel read-only and then proceeds with onboarding.
- **The Hiring Manager never schedules** interviews; scheduling is HR's (stage 8).
- **Shortlist review (stage 6) and interview feedback (stage 8) are distinct**: stage 6 is view-profile + accept/reject only, with no scoring; scoring happens only at stage 8.
- Decisions taken by the Hiring Manager are **sent back to HR** and surfaced as HR notifications.

### Outside the spine (support functions)
Candidates (talent pool), Exports, Settings, the **Admin** role (users, audit, system settings) and the **Viewer** role (read-only oversight) are support functions and are deliberately **not** part of the numbered workflow.

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **ATS** | The applicant tracking system covering CV intake → parsing → AI screening → shortlisting → interview scheduling. |
| **Job Position** | An open role (title, department, designation, description) that owns screening templates and receives applications. |
| **Screening Template** | A version-controlled, position-specific config: weighted criteria, include/exclude keywords, auto-shortlist threshold, AI prompt version. |
| **Criterion** | A single weighted screening dimension (e.g. skills, experience, education, age, location). |
| **Batch** | An upload of one or more CVs against a position, processed asynchronously. |
| **Candidate** | A master profile assembled from parsed CV data, deduplicated across batches. |
| **Application** | The link between a candidate and a position via an uploaded CV; carries score and status. |
| **Match Score** | An AI/engine-produced percentage indicating fit against the template. |
| **Score Explanation** | The per-criterion contribution breakdown + matched/missed CV evidence + red flags behind a score. |
| **Red Flag** | A risk indicator (career break, frequent job changes, missing info, over/under-qualification, skill gap). |
| **Override** | An HR decision that changes an AI outcome, requiring a mandatory logged reason. |
| **Talent Pool** | The searchable database of all candidates for future hiring. |
| **Stage** | One of the 10 numbered steps of the hiring spine (§0.5). Every workflow screen declares its stage. |
| **Written Exam** *(v2)* | STL's written assessment, taken after Hiring Manager shortlist acceptance (stage 7). Produces a written score per candidate. |
| **Viva** *(v2)* | The panel interview (stage 8). HR schedules slots/panel and sends invitations; the Hiring Manager scores the candidate against criteria. |
| **Merit Sheet** *(v2)* | The combined written-exam + viva ranking used as decision support at final selection. |
| **CV Analysis** *(v2)* | Stage-4 analytics over the parsed cohort (distributions, skill coverage, cohort building). Assistive and read-only. |
| **Online Presence Analysis** *(v2)* | Stage-5 digital-footprint research from public professional sources. **Assistive only — never a screening input.** |
| **Assessment Summary Report** *(v2)* | Stage-9 evidence pack combining AI screening score, written exam and viva ratings. |

### User Roles

| Role | Description |
|------|-------------|
| **Viewer** | Read-only access to assigned positions, candidate profiles, and reports. |
| **Hiring Manager** | Reviews shortlisted candidates, records interview feedback, accepts/rejects for next round or returns to HR. Cannot upload or override screening scores. |
| **HR** | Primary user: manages positions, templates, uploads, screening review, overrides, communications, scheduling, exports. |
| **Admin** | Manages users, roles, module-level permissions, system settings, and the full audit trail. |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **CvProcessingStatus** | `PENDING`, `PROCESSING`, `PARSED`, `SCREENED`, `SHORTLISTED`, `REJECTED_PENDING_REVIEW`, `DUPLICATE`, `FAILED` | Lifecycle of a single CV file. |
| **BatchStatus** | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` | Aggregate batch progress. |
| **ApplicationStatus** | `SCREENED`, `SHORTLISTED`, `REJECTED_PENDING_REVIEW`, `REJECTED`, `HM_ACCEPTED`, `HM_REJECTED`, `IN_WRITTEN_EXAM`, `IN_VIVA`, `SELECTED`, `IN_ONBOARDING`, `RETURNED_TO_HR` | Candidate's state in a position pipeline (v2 adds the HM decision, assessment and selection states). |
| **InterviewStatus** | `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` | Viva lifecycle. |
| **WrittenExamStatus** *(v2)* | `NOT_STARTED`, `SCHEDULED`, `COMPLETED`, `ABSENT`, `SCORED` | Written-exam lifecycle per candidate (stage 7). |
| **AssessmentScore** *(v2)* | `written` (0–100), `viva` per-criterion 1–5 (Technical, Communication, Culture fit, Domain knowledge, Overall) | Inputs to the combined merit sheet. |
| **StageNumber** *(v2)* | `1`–`10` | The hiring-spine stage a screen or application belongs to (§0.5). |
| **NotificationStatus** | `QUEUED`, `SENT`, `DELIVERED`, `FAILED` | Outbound message delivery state. |
| **UserRole** | `VIEWER`, `HIRING_MANAGER`, `HR`, `ADMIN` | Access level. |

### Technical Terms

| Term | Definition |
|------|------------|
| **Hybrid scoring** | Deterministic weighted scoring core + optional LLM extraction/narrative, with rule-based fallback. |
| **IOcrService** | Pluggable OCR adapter interface; stub/local impl in v1, cloud adapter later. |
| **Auto-shortlist threshold** | The score (%) at or above which a candidate is auto-moved to the shortlist. |
| **Re-screening** | Re-running scoring after a template/criteria change without re-uploading CVs. |
| **Template version** | An immutable snapshot of a screening template + AI prompt used for a given scoring run (traceability). |

---

## 2. System Modules

### Module 1 — User Management & Security

User accounts, RBAC, module-level permissions, sessions, audit trail, and encryption.

#### Main Features
1. Admin user CRUD — create accounts for HR, Hiring Managers, Viewers; activate/deactivate.
2. Role-based access control across 4 roles with module-level permission toggles.
3. Password policy enforcement and JWT httpOnly-cookie sessions with token rotation.
4. Full audit trail — uploads, parsing, scoring runs, overrides, shortlist movements, exports, admin actions.
5. Encryption in transit (TLS) and at rest; upload validation + malware-scan integration readiness.

#### Technical Flow — Login
1. User submits email + password.
2. Frontend posts to `/auth/login`.
3. Backend validates credentials, checks user status, issues JWT in `httpOnly, secure, sameSite=strict` cookie.
4. On success: role-based redirect to the appropriate dashboard; audit log entry written.
5. On failure: 401 with generic message; deactivated users get the deactivation message.

---

### Module 2 — CV Upload & Parsing

Bulk, asynchronous, bilingual CV intake with parsing, OCR-readiness, and duplicate detection.

#### Main Features
1. Drag-and-drop upload; bulk 5,000+ CVs per batch via Redis queue.
2. Formats: PDF (digital + scanned), Word (.doc/.docx), JPG, PNG.
3. OCR for scanned PDFs/images via pluggable `IOcrService` (stub in v1).
4. Bangla + English parsing (Unicode normalization, language-aware OCR, bilingual dictionaries).
5. Per-file status tracking and extraction-confidence + missing-field flags.
6. Duplicate detection: within batch (file hash) and against DB (email, phone, name, profile similarity).
7. Email-inbox and job-portal import (adapter-ready; subject to credentials).

#### Technical Flow — Bulk Upload
1. HR drops files into the batch uploader for a position.
2. Frontend uploads files (chunked) to `/batches/:id/files`; files stored in S3-compatible storage.
3. Each file enqueued (Redis) → worker parses/OCRs → extracts structured fields → runs dedup.
4. On success: file `PARSED`, candidate profile upserted, status streamed to UI.
5. On failure: file `FAILED` with reason; surfaced for manual review (never silently dropped).

---

### Module 3 — AI Screening & Matching

Position-wise, weighted, explainable screening producing percentage match scores.

#### Main Features
1. Position-wise screening templates with configurable prompts (versioned).
2. Configurable criteria: age, gender, education, years of experience, past positions, skills, location, certifications.
3. Weighted scoring (configurable weight per criterion) + multi-criteria filters.
4. Include-keyword (must-have) and exclude-keyword (disqualifier) filtering.
5. Percentage match score + auto-shortlist on threshold; auto-move to shortlist.
6. Red-flag detection (career break, frequent job changes, missing info, over/under-qualification, skill gap).
7. Score explanation panel: per-criterion contributions, matched/missed evidence, red-flag reasoning.
8. Re-screening on criteria change without re-upload.

#### Technical Flow — Screening Run
1. Trigger on parse completion or manual "Run screening" / "Re-screen".
2. Engine loads active template version; applies exclude keywords (disqualify → flag), include keywords, then weighted per-criterion scoring (deterministic core).
3. Optional LLM pass enriches extraction + writes red-flag narrative (if API key present); otherwise rules-only.
4. On success: `ScreeningResult` persisted with breakdown; score ≥ threshold → `SHORTLISTED`, else `REJECTED_PENDING_REVIEW` (never auto-rejected).
5. On failure: run marked failed, retryable; no candidate state silently changed.

---

### Module 4 — Candidate Database & History

Centralized master profiles, application history, tagging, and talent-pool search.

#### Main Features
1. Master candidate profile from parsed data.
2. Application history: last application date, previously applied positions, previous shortlist status.
3. Tagging (custom labels) and bookmarking.
4. Talent pool — full-text + structured search across profiles, skills, tags, parsed CV content.

#### Technical Flow — Candidate Search
1. HR enters keyword/structured filters.
2. Backend queries the search index (OpenSearch/Elasticsearch) + DB.
3. Returns ranked profiles with history and tags; empty state when no matches.

---

### Module 5 — Export & Reporting

Bulk downloads and STL-format reporting, fully audit-logged.

#### Main Features
1. Bulk original-CV download for filtered/shortlisted candidates.
2. Excel export with customizable field selection (name, contact, email, district, education, experience, …).
3. Final candidate summary in STL's predefined Excel format.
4. Downloadable screening reports and interview panel summaries.
5. Export/download audit logging.

#### Technical Flow — Export
1. HR selects scope + fields + format.
2. Backend enqueues an `ExportJob`; worker assembles the artifact to storage.
3. On success: signed download link; audit log entry written. On failure: job marked failed with reason.

---

### Module 6 — Integration & Workflow

Notifications and interview scheduling.

#### Main Features
1. Templated email notifications via SMTP (real).
2. Templated SMS via pluggable gateway adapter (stub/log in v1).
3. Interview scheduling — slot creation, panel assignment, candidate invitation.
4. Notification delivery status + schedule status tracking.

#### Technical Flow — Schedule Interview
1. HR selects candidate(s), slot, and panel.
2. Backend creates `Interview` + `Notification` records, sends email invite (SMS stub logs intent).
3. On success: statuses tracked and shown; calendar invite content generated.
4. On failure: notification `FAILED` with reason; HR can retry.

---

### Module 7 — AI Governance & Accuracy

Explainability, override capture, versioning, and validation.

#### Main Features
1. Explainable scoring with per-criterion breakdown + evidence (no black-box outputs).
2. HR manual override with mandatory reason capture (logged for audit + AI feedback).
3. Weighted-scoring suggestions in the template builder.
4. Human review enforced before any final rejection.
5. Version-controlled templates and prompts (full traceability).
6. Accuracy/validation reporting against manually annotated ground-truth CVs.
7. Controlled feedback loop using validated HR overrides.
8. Governance aligned with NIST AI RMF, ISO/IEC 42001, OWASP LLM Top 10.

#### Technical Flow — Override
1. HR changes an AI outcome (e.g., shortlist a below-threshold candidate or reject pending-review).
2. UI forces a reason field (mandatory).
3. Backend records `Override` (actor, before/after, reason, timestamp) → audit log + feedback store.
4. Application status updates; the original AI result remains intact for traceability.

---

### Module 8 — Assessment: Written Exam & Viva *(new in v2)*

STL's two-part assessment, run after the Hiring Manager accepts a shortlisted candidate (stages 7–8).

#### Main Features
1. **Written exam (stage 7)** — record/administer the written assessment per candidate; capture a written score and attendance (`ABSENT` supported).
2. **Viva scheduling (stage 8, HR)** — slot + platform (Google Meet / Zoom / Gmail / in-person) + panel assignment; templated email invitations with merge tokens and a live preview.
3. **Viva tracker (stage 8, HR)** — every scheduled/completed interview with delivery and schedule status.
4. **Viva scoring (stage 8, Hiring Manager)** — 1–5 ratings across Technical, Communication, Culture fit, Domain knowledge, Overall, plus free-text comments.
5. **Combined merit sheet** — written score + viva ratings + AI screening score, ranked, feeding stage 9.

#### Role rules
- The **Hiring Manager does not schedule** interviews — no scheduling UI appears in the HM role.
- The **Hiring Manager scores** the viva; HR owns scheduling and the exam.

#### Technical Flow — Viva
1. HR schedules slots, assigns the panel and sends invitations → invites move to the tracker; the schedule form is replaced by the tracker plus a "Schedule new interview" action.
2. After the viva, the Hiring Manager submits ratings per criterion.
3. When all candidates are scored, the HM comparison panel unlocks (stage 9).
4. On failure: notification marked `FAILED` and retryable; no candidate state changes silently.

---

### Module 9 — Decision Support & Analytics *(new in v2)*

Assistive views that help HR and the Hiring Manager interpret the cohort. **All are read-only and advisory — none of them rejects, ranks or filters a candidate on their own.**

#### Main Features
1. **CV Analysis dashboard (stage 4 companion)** — distributions and skill coverage across the parsed cohort; click a segment to build a cohort. Assistive, read-only.
2. **Online Presence & public-information analysis (stage 5 companion)** — digital-footprint research from public professional sources. **Never a screening input**; surfaced for context only and excluded from the match score.
3. **Assessment Summary report (stage 9 companion)** — combined written-exam + viva merit sheet presented as decision support for the Hiring Manager's selection.

#### Governance
- These views inherit Module 7 rules: explainable, logged, and never a substitute for human judgement.
- Online-presence data is **excluded from scoring** and must not be used as a screening criterion, consistent with the "no sensitive criteria beyond client-approved setup" rule.

---

## 3. HR & Shared Application (Primary)

### 3.1 Page Architecture

**Stack:** React + TypeScript, React Router 7, Redux (async thunks), Tailwind CSS v4.

#### Route Groups

| Group | Access |
|-------|--------|
| Auth | Unauthenticated only |
| Protected (HR) | HR role |
| Protected (Hiring Manager) | Hiring Manager role |
| Protected (Viewer) | Viewer role |
| Protected (Admin) | Admin role |

#### Page Map

**Auth**
| Route | Page |
|-------|------|
| `/auth/login` | Login |
| `/auth/forgot-password` | Forgot Password |

**HR (Protected)** — sidebar is grouped *Workspace* / *Hiring Workflow (numbered 1–10)* / *Talent & System*

| Stage | Route | Page |
|:-----:|-------|------|
| — | `/` | HR Dashboard (incl. workflow notifications) |
| — | `/positions` | Job Positions list |
| — | `/positions/new` | Create Job Position |
| — | `/positions/:id` | Position detail |
| **1** | `/positions/:id/template` | Screening Template builder (weighted criteria, guidance prompt, re-screen) |
| **2** | `/positions/:id/import` | Import CVs (bulk upload; position selector) |
| **3** | `/batches/:id/processing` | Processing & triage (duplicates, failed files) |
| **4** | `/positions/:id/cv-review` | Review parsed CVs (+ AI shortlist suggestion modal) |
| **4c** | `/positions/:id/cv-analysis` | **CV Analysis dashboard** *(companion)* |
| **5** | `/positions/:id/results` | Screening Results (shortlist segments) |
| **5c** | `/positions/:id/online-presence` | **Online Presence analysis** *(companion)* |
| **5** | `/applications/:id` | Candidate screening detail + explanation panel *(drill-down)* |
| **7** | `/positions/:id/written-exam` | **Written Exam** |
| **8** | `/positions/:id/schedule-viva` | **Schedule Viva** (slots, panel, email template) |
| **8** | `/interviews` | **Viva & Interviews tracker** |
| **9** | `/positions/:id/final-selection` | Final Selection (read-only for HR) |
| **9c** | `/positions/:id/summary-report` | **Assessment Summary report** *(companion)* |
| **10** | `/positions/:id/onboarding` | Onboarding (offer email + checklist) |
| — | `/candidates` | Candidate database / talent pool |
| — | `/candidates/:id` | Candidate master profile |
| — | `/exports` | Exports & reports |
| — | `/settings` | Profile & security |

**Hiring Manager (Protected)** — sidebar shows the same spine numbers (6, 8, 9)

| Stage | Route | Page |
|:-----:|-------|------|
| — | `/` | Assigned positions (inbox: new from HR) |
| **6** | `/positions/:id/shortlist` | Shortlist Review — view profile + accept/reject **only** (no scoring) |
| **6** | `/applications/:id` | Candidate detail + decision *(drill-down)* |
| **8** | `/interviews` | Interview Feedback (candidates to score; no scheduling UI) |
| **8** | `/applications/:id/rating` | Interview Rating (1–5 per criterion + comments) |
| **9** | `/positions/:id/final-selection` | Final Selection — comparison + AI recommendation; **HM selects** → sends to HR |

**Viewer (Protected)**
| Route | Page |
|-------|------|
| `/` | Assigned positions (read-only) |
| `/positions/:id` | Position detail (read-only) |
| `/candidates/:id` | Candidate profile (read-only) |
| `/reports` | Reports (read-only) |

### 3.2 Feature List by Page

#### `/` — HR Dashboard
- Stats: open positions, pending screening runs, recent applications, shortlist counts.
- Recent batches with progress; quick actions (new position, upload).
- Empty + loading states.

#### `/positions` — Job Positions
- Search by title/department; filter by status; sort by date.
- Position card: title, department, designation, applications count, shortlist count.
- Actions: open, edit, build template, upload CVs.

#### `/positions/new` — Create Job Position
- Form: title, department, designation, description.

#### `/positions/:id/template` — Screening Template Builder
- Select criteria (age, gender, education, experience, skills, location, certifications, past positions).
- Set per-criterion weights (must sum to 100%); weighted-scoring suggestions.
- Include keywords (must-have), exclude keywords (disqualifiers).
- Auto-shortlist threshold slider; save as new version (versioned).

#### `/positions/:id/upload` — CV Batch Upload
- Drag-and-drop; format validation; batch creation; progress hand-off.

#### `/batches/:id` — Batch Progress Monitor
- Per-file status (`pending → processing → parsed → screened → shortlisted / rejected-pending-review / duplicate / failed`).
- Aggregate progress bar; failed-file list with reasons; live updates.

#### `/batches/:id/duplicates` — Duplicate Review
- List detected duplicates with matched evidence; actions: keep / merge / discard.

#### `/positions/:id/results` — Screening Results
- Ranked candidate list with AI match score (%); filters (status, score range); bulk actions.
- Accept auto-shortlist; tag/bookmark; open detail.

#### `/applications/:id` — Candidate Screening Detail
- Parsed profile + original CV viewer.
- **Score explanation panel:** per-criterion contributions, matched/missed evidence, red flags.
- Actions: accept shortlist, manual override (mandatory reason), tag/bookmark, message, schedule.

#### `/candidates` — Candidate Database / Talent Pool
- Full-text + structured search; filters (skills, tags, district, education).
- Profile cards with history; empty state.

#### `/candidates/:id` — Candidate Master Profile
- Application history, last application date, previous positions, previous shortlist status, tags, bookmark.

#### `/interviews` — Interview Scheduling
- Create slots, assign panels, invite candidates; delivery + schedule status tracking.

#### `/exports` — Exports & Reports
- Choose scope/fields/format; CV bundle, customizable Excel, STL-format summary, screening reports, panel summaries; export history.

#### `/auth/login` — Login
- Email + password; forgot-password link; role-based redirect.

#### `/settings` — Settings
- Profile (name), security (change password).

---

## 4. Admin Dashboard

### 4.1 Page Architecture

**Access:** Admin role only.

| Route | Page |
|-------|------|
| `/admin` | Dashboard Overview |
| `/admin/users` | User Management |
| `/admin/users/:id` | User Detail |
| `/admin/audit` | Audit Trail |
| `/admin/settings` | System Settings |

### 4.2 Feature List by Page

#### `/admin` — Dashboard Overview
- Stats: total users, active positions, processing batches, scoring runs.
- Recent admin activity feed.

#### `/admin/users` — User Management
- List with search/filter (role, status); create user; edit role, status, module permissions; activate/deactivate.

#### `/admin/users/:id` — User Detail
- Full account info; role + module permissions; activity; admin actions (suspend/activate, reset).

#### `/admin/audit` — Audit Trail
- Filterable log of uploads, parsing, scoring runs, overrides, shortlist movements, exports, admin actions; export audit log.

#### `/admin/settings` — System Settings
- SMTP/email config, SMS gateway config, OCR provider config, data-retention policy, integration credentials (masked).

---

## 5. Tech Stack

### Architecture

Modular, decoupled services. Monorepo with separate backend and frontend; async workers for bulk processing.

```
square_ats/
├── backend/     ← NestJS REST API (TypeScript) + queue workers
├── frontend/    ← React + TypeScript user/admin app
└── .claude-project/  ← PRD, design, docs, status
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | REST API server (4-layer: Controller→Service→Repository→Entity) |
| Language | TypeScript | 5.x | Backend + frontend |
| ORM | TypeORM | 0.3.x | PostgreSQL access (BaseEntity/BaseRepository) |
| Database | PostgreSQL | 16.x | Primary data store (UUID PKs, soft delete) |
| Queue | Redis + BullMQ | — | Async bulk CV processing workers |
| Search | OpenSearch / Elasticsearch | 2.x / 8.x | Talent-pool full-text + structured search |
| Storage | S3-compatible (MinIO/S3) | — | Original CV files + export artifacts |
| Frontend | React | 18.x | UI |
| Routing | React Router | 7.x | Client routing (framework mode) |
| State | Redux Toolkit | — | Global/server state via async thunks |
| CSS | Tailwind CSS | 4.x | Styling + Shadcn/UI |
| Build | Vite | — | Frontend bundler |
| Realtime | Socket.io | — | Live batch/screening progress |
| Container | Docker | — | Portable cloud/on-prem/hybrid deployment |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Anthropic (Claude) | Optional LLM extraction + red-flag narrative (hybrid scoring) |
| OCR provider (Azure Document Intelligence / Google Document AI) | Scanned/image CV OCR — adapter, stub in v1 |
| SMTP | Real templated candidate emails |
| SMS gateway | Templated SMS — adapter, stub/log in v1 |
| Email inbox / Job portals | CV import — adapter-ready |
| Malware scanning | Upload security — integration-ready |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| NestJS over Laravel/FastAPI | Aligns with existing `.claude` tooling, rules, gates, and base-class architecture. |
| Hybrid AI scoring | Deterministic core guarantees explainability + offline operation; LLM adds nuance when available. |
| OCR/SMS as pluggable adapters (stub v1) | Decouples vendor selection from delivery; data-residency flexibility per deployment mode. |
| JWT in httpOnly cookies | XSS-safe sessions per backend security rules; token rotation on refresh. |
| Redis/BullMQ workers | Required for 5,000+ CV async batches with per-file status. |
| Human-in-the-loop enforced in code | No code path can finalize a rejection without an explicit HR action + reason. |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection |
| `REDIS_URL` | Redis/BullMQ connection |
| `JWT_SECRET` | JWT signing secret (no fallback — throws if missing) |
| `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (e.g. `1h`, `7d`) |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` | Object storage |
| `SEARCH_NODE` | OpenSearch/Elasticsearch endpoint |
| `ANTHROPIC_API_KEY` | Optional — enables LLM enrichment; absent → rules-only |
| `OCR_PROVIDER` / `OCR_API_KEY` | OCR adapter selection + creds (stub if unset) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Email delivery |
| `SMS_PROVIDER` / `SMS_API_KEY` | SMS adapter (stub if unset) |
| `FRONTEND_URL` | CORS origin / links |
| `VITE_API_URL` | Frontend API base URL |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | Which OCR provider for production (Azure vs Google vs on-prem)? | Affects scanned-CV accuracy + data residency; v1 uses stub adapter. | STL | ⏳ Open |
| 2 | Which SMS gateway will STL provide? | SMS is stubbed until chosen; affects Module 6 delivery. | STL | ⏳ Open |
| 3 | Exact STL predefined Excel summary format? | Module 5 final-summary export must match STL's template exactly. **Update 16 Jul 2026:** client provided `Summary format.xlsx` — implemented in the R9 assessment-summary report. Remaining: confirm the same format governs the Module 5 Excel *export*, and confirm the Age column with Legal (see #7). | STL HR | 🟡 Partially resolved |
| 4 | Email-inbox / job-portal import credentials & APIs? | Determines whether import is active in v1 or adapter-only. | STL IT | ⏳ Open |
| 5 | Data-retention durations + archival/deletion policy specifics? | Drives retention workflows + audit; configurable but needs defaults. | STL | ⏳ Open |
| 6 | Ground-truth annotated CV set for accuracy validation? | Required for Module 7 accuracy benchmark report. | STL HR | ⏳ Open |
| 7 | Are gender/age criteria permitted under STL policy + local labour law? | Governance: sensitive criteria only within client-approved configs. | STL Legal/HR | ⏳ Open |
| 8 | Deployment target for first release (cloud vs on-prem vs hybrid)? | Affects OCR/LLM connectivity + infra setup. | STL IT | ⏳ Open |
| 9 | Online-presence analysis (R8): which enrichment/search provider? Approved by STL Legal? What candidate-notice/consent policy applies? | Blocks live use of the online-visibility feature; prototype ships fixture-data-only with the workflow gated on HR identity confirmation. Same class of blocker as #7. | STL Legal/HR/IT | ⏳ Open |
