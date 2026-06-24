# STL AI-Powered ATS — Design Guide

**Project:** STL AI-Powered ATS
**Version:** 1.0
**Type:** Web Application — internal enterprise tool (desktop-first)
**Platform:** Desktop-first (1440px), responsive down to 1024px; key pages usable at 768px
**User Types:** Admin, HR (primary), Hiring Manager, Viewer
**Source:** `.claude-project/docs/PRD.md`

---

## 1. Design Philosophy

This is a **data-dense, decision-support tool** for HR professionals processing thousands of CVs. The design must prioritize **scanability, trust, and explainability** over visual flourish. Every screen is a workspace, not a marketing page.

### Design Pillars

1. **Clarity over decoration** — HR scans ranked lists and score breakdowns all day; reduce visual noise, maximize legibility.
2. **Explainable by design** — score breakdowns, evidence, and red flags must be visually first-class (progress bars, evidence chips, flag badges), never buried.
3. **Trust & auditability** — every AI suggestion reads as *assistive*; override/human-decision affordances are always visible. Status is unambiguous via consistent color semantics.
4. **Bilingual-ready** — layouts tolerate Bangla + English strings (longer text, different glyph widths); avoid fixed-width labels.
5. **Calm under volume** — batch progress, 5,000-row tables, and long candidate lists must feel controllable (sticky headers, filters, pagination, empty/loading states).

### Reference Applications

| PRD Feature | Inspiration | Reference |
|-------------|-------------|-----------|
| Ranked candidates + scoring | Pipeline/list UI | **Greenhouse, Lever** (ATS) |
| Dashboards + clean tables | Minimal data dashboard | **Stripe, Linear** |
| Score explanation panels | Detail/inspector panels | **Linear issue view, Notion** |
| Batch processing monitor | Job/operations monitor | **Vercel deployments, Stripe events** |
| Admin user management | Settings + RBAC | **Stripe Dashboard, Auth0** |

---

## 2. Information Architecture (by role)

- **HR (primary):** Dashboard → Positions → Template Builder → Upload → Batch Monitor → Duplicate Review → Screening Results → Candidate Detail (explanation panel) → Candidate DB / Talent Pool → Interviews → Exports → Settings
- **Hiring Manager:** Assigned Positions → Shortlist Review → Candidate Detail + Feedback → My Interview Panels
- **Viewer:** Assigned Positions (read-only) → Position/Candidate detail → Reports
- **Admin:** Overview → User Management → User Detail → Audit Trail → System Settings

### Shared Shell
- **Left sidebar** (collapsible): role-aware nav, STL brand at top (links to role home), user menu at bottom.
- **Top bar**: page title + breadcrumb, global search (HR/Admin), language toggle (EN/বাংলা), notifications, profile.
- **Content area**: page header (title + primary actions) → filters/toolbar → main content → empty/loading/error states.

---

## 3. Core Component Patterns

| Component | Usage |
|-----------|-------|
| **Stat card** | Dashboard KPIs (open positions, pending runs, shortlist counts). |
| **Data table** | Positions, candidates, results, users, audit — sticky header, sortable, row actions, pagination. |
| **Ranked candidate row** | Score % (with bar), name, key fields, status badge, quick actions. |
| **Score explanation panel** | Per-criterion bars summing to total, matched/missed evidence chips, red-flag badges. |
| **Status badge** | Semantic colors per `CvProcessingStatus` / `ApplicationStatus`. |
| **Override modal** | Mandatory reason textarea + before/after summary. |
| **Batch progress** | Aggregate bar + per-file status stream + failed-file list. |
| **Template builder** | Criteria selector, weight sliders (live-sum to 100%), keyword chips, threshold slider. |
| **Empty / loading / error states** | Every list and async page. |
| **Toast / inline alerts** | Mutation feedback, never `console.log`. |

---

## 4. Status Color Semantics (shared across all variations)

| Status | Semantic | Intent |
|--------|----------|--------|
| Shortlisted / Advanced / Active / Delivered | **Success** | green |
| Screened / Parsed / In Interview | **Info** | blue/accent |
| Pending / Processing / Queued | **Neutral-busy** | amber |
| Rejected-pending-review / Failed / No-show | **Warning/Danger** | red/orange |
| Duplicate | **Caution** | purple |
| Inactive / Cancelled / Withdrawn | **Muted** | gray |

Exact hex per variation defined in each `DESIGN_SYSTEM_{A,B,C}.md`, but the *semantic mapping above is fixed*.

---

## 5. Accessibility & Quality Rules (pre-delivery)

- Text contrast ≥ 4.5:1 (WCAG AA); status never conveyed by color alone (always label/icon too).
- All interactive elements: `cursor-pointer`, visible focus ring, `data-testid`.
- Hover = color/opacity change only (no scale/layout shift).
- No emojis as icons — use inline SVG / Lucide.
- Semantic HTML (`header`, `nav`, `main`, `footer`, `table`).
- Responsive at 1440 / 1280 / 1024 / 768; no horizontal scroll on content (tables may scroll within a container).
- All form inputs have labels; language toggle present on every authenticated page.

---

## 6. Deliverables Plan (P3e role-folder HTML)

| Role | Pages |
|------|-------|
| `auth` | login, forgot-password |
| `hr` | dashboard, positions, position-new, position-detail, template-builder, upload, batch-monitor, duplicates, results, application-detail, candidates, candidate-detail, interviews, exports, settings |
| `hiring-manager` | dashboard, shortlist, application-detail, interviews |
| `viewer` | dashboard, position-detail, candidate-detail, reports |
| `admin` | dashboard, users, user-detail, audit, settings |

Three style variations (A/B/C) are produced first with a representative page each; client selects one before full generation.
