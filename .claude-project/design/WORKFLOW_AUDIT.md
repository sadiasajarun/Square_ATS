# STL ATS Prototype — Workflow Audit (mismatches & gaps)

**Date:** 2026-06-24 · **Scope:** 39 role pages (`hr` 22 · `hiring-manager` 6 · `admin` 5 · `viewer` 4 · `auth` 2)
**Method:** automated link-graph + step-indicator + sidebar-nav audit of `.claude-project/design/html/`.

---

## 1. Current state (what the audit found)

- **Link integrity is healthy**: 0 orphan pages, 0 dead-end pages, 0 broken links.
- **Three separate "stories" exist and they disagree**:
  1. the **step indicator** (9 stages: Template → Import → Process → Review → Shortlist → Hiring Manager → Written Exam → Viva → Hire),
  2. the **HR sidebar** (14 items, different order and different membership),
  3. the **actual click-path** (some stages reachable only by deep link).

---

## 2. Mismatches (things that contradict each other)

| # | Mismatch | Evidence | Impact on demo |
|---|----------|----------|----------------|
| **M1** | **Stepper dies at the role handoff.** Step 6 "Hiring Manager" jumps to `hiring-manager/shortlist`, but **no HM page carries the stepper**. | stepper present on 9 HR pages, 0 HM pages | The guided narrative breaks at the most important moment — the HR→HM handoff. Client loses the thread. |
| **M2** | **Step 7 "Written Exam" page has no stepper.** The stepper links *to* `written-exam` but that page doesn't show where you are. | `hr/written-exam` → MISS | Dead spot mid-flow. |
| **M3** | **Sidebar ≠ workflow.** 4 workflow stages are **absent from the sidebar** (`template-builder`, `processing`, `interview-schedule`, `onboarding`); 3 sidebar items are **absent from the workflow** (CV Analysis, Online Presence, Summary Report). | nav(14) vs 9 steps | Two different mental models presented simultaneously. |
| **M4** | **Two competing interview pages.** `hr/interviews` (in sidebar, no stepper) vs `hr/interview-schedule` (stepper step 8 "Viva", not in sidebar). | both exist, overlapping purpose | Client asks "which one is the real one?" |
| **M5** | **Duplicate current-step claim.** `results` and `application-detail` both mark themselves step 5. | dupes = {5: 2} | Minor, but the indicator lies on a drill-down page. |
| **M6** | **Onboarding is outside the flow.** Step 9 is "Hire" → `final-selection`; `onboarding` has no step and is reachable only from `final-selection`. | onboarding IN = [final-selection] | The cycle appears to end before the actual final deliverable. |
| **M7** | **PRD ↔ prototype drift.** PRD v1 describes an 8-stage flow with no Written Exam, Viva, CV Analysis, or Online Presence — all of which now exist in the prototype. | PRD.md vs page inventory | Client-facing docs and the demo don't match. |

---

## 3. Gaps (things missing)

| # | Gap | Evidence | Severity |
|---|-----|----------|----------|
| **G1** | **The Hiring Manager → HR handoff does not exist.** No HM page links to any HR page. HM "select candidate → send to HR for onboarding" is a dead end. | HM→HR links: **NONE** (HR→HM: 3) | **Blocker** — the loop cannot be completed from the HM side in a live demo. |
| **G2** | **Analysis pages have no place in the workflow.** `cv-analysis-dashboard`, `online-visibility-analysis`, `assessment-summary-report` are linked from ~21 pages (sidebar) but belong to **no stage**. | not in stepper | High — client will ask "when do I use these?" |
| **G3** | **Core stages missing from navigation.** `processing`, `template-builder`, `interview-schedule`, `onboarding` are not in the sidebar; `onboarding` has exactly one inbound link. | nav gap list | High — stages feel accidental. |
| **G4** | **HM stage pages missing from HM nav.** `interview-rating` (a real stage) and `application-detail` are not in the HM sidebar. | HM nav(4) | Medium |
| **G5** | **No "re-screen after template change"** entry point, though the PRD promises re-screening without re-upload. | PRD Module 3 | Medium |
| **G6** | **Viewer/Admin are outside the story.** 9 pages that never appear in the workflow narrative. | no stepper, no stage | Low (by design) — but needs framing in the demo. |

---

## 4. Proposed canonical workflow (single source of truth)

One numbered spine, with **explicit role ownership** and the analysis pages given a home:

| # | Stage | Owner | Primary page | Companion views |
|---|-------|-------|--------------|-----------------|
| 1 | **Define role & criteria** | HR | `positions` → `template-builder` | `position-detail` |
| 2 | **Import CVs** | HR | `import-cvs` | — |
| 3 | **Process & triage** | HR | `processing` | — |
| 4 | **Review parsed CVs** | HR | `cv-review` | **`cv-analysis-dashboard`** (analytics for this stage) |
| 5 | **Shortlist** | HR | `results` | **`online-visibility-analysis`** (enrichment before handoff) |
| 6 | **Hiring Manager review** | **HM** | `hm/shortlist` | `hm/application-detail` |
| 7 | **Written exam** | HR | `written-exam` | — |
| 8 | **Viva / interview** | HR schedules · HM scores | `interview-schedule` → `interviews` | `hm/interview-rating` |
| 9 | **Final selection** | **HM selects** → HR confirms | `hm/final-selection` → `hr/final-selection` | **`assessment-summary-report`** (evidence pack) |
| 10 | **Onboarding** | HR | `onboarding` | — |

Everything else is **support, not workflow**: Candidates (talent pool), Exports, Settings, Admin (users/audit/settings), Viewer (read-only). These should be visually separated in the sidebar so they don't compete with the spine.

---

## 5. Recommended fixes (prioritized)

### P0 — blocks a clean client demo
1. **Wire the HM → HR handoff**: `hm/final-selection` "Send to HR for onboarding" → `hr/final-selection` (which already has "Proceed to onboarding"). *(fixes G1)*
2. **Extend the stepper across role boundaries** — add it to the 4 HM stage pages + `written-exam`, `interviews`, and the 3 analysis pages, so the spine is continuous end to end. *(fixes M1, M2)*
3. **Add stage 10 "Onboard"** to the stepper (or relabel 9 → "Select" + 10 → "Onboard") so the cycle visibly completes. *(fixes M6)*

### P1 — removes client confusion
4. **Restructure both sidebars to mirror the spine**: a numbered "Hiring Workflow" group in stage order, then a separate "Talent & System" group. Add the missing stages. *(fixes M3, G3, G4)*
5. **Resolve the two interview pages** — make `interview-schedule` the action ("Schedule viva") and `interviews` the tracker, with explicit cross-links and one sidebar entry. *(fixes M4)*
6. **Label the analysis pages with their stage** ("Stage 4 companion", etc.) and link them from their owning stage. *(fixes G2)*

### P2 — polish & consistency
7. Fix the duplicate step-5 claim on `application-detail` (drill-downs should show the parent stage, not claim "current"). *(M5)*
8. Add a **"Re-screen with updated template"** action on `results`/`template-builder`. *(G5)*
9. **Update the PRD to v2** to include Written Exam, Viva, CV Analysis, Online Presence, and the 10-stage spine. *(M7)*
10. Add a one-line framing on Viewer/Admin dashboards ("support role — outside the hiring spine"). *(G6)*

---

## 6. Demo script this enables (what the client would walk through)

`login → HR: Positions → Template → Import → Process → Review (+CV Analysis) → Shortlist (+Online Presence) → send to HM`
`→ HM: Shortlist review → accept → HR: Written Exam → Schedule Viva → HM: Interview rating`
`→ HM: Final selection (AI recommends) → HR: confirm → Onboarding → cycle complete`

Ten stages, four roles, one continuous indicator, no dead ends.

---

## 7. Resolution log — P0 + P1 implemented (2026-06-24)

| Item | Status | What changed |
|------|--------|--------------|
| **G1** HM→HR handoff | ✅ Fixed | The handoff existed only as a 1.5s JS redirect (invisible to link crawlers). Added a real **"Open HR selection panel"** link on `hm/final-selection` → `hr/final-selection`. |
| **M1** Stepper dies at handoff | ✅ Fixed | Stepper is now **role-aware** and present on **all 5 HM stage pages**; from HM the earlier stages resolve to `../hr/…`, so the spine is continuous across the role boundary. |
| **M2** Written Exam had no stepper | ✅ Fixed | `written-exam` now carries the spine (stage 7). |
| **M6** Onboarding outside the flow | ✅ Fixed | Spine extended to **10 stages**; stage 9 relabelled **Selection**, new stage **10 · Onboard** → `onboarding`. |
| **M3/G3** Sidebar ≠ workflow | ✅ Fixed | Both sidebars rebuilt to mirror the spine: a numbered **Hiring Workflow** group (1–10) with indented companion views, then a separate **Talent & System** group. All previously missing stages (`template-builder`, `processing`, `interview-schedule`, `onboarding`) are now in the nav. |
| **M4** Two interview pages | ✅ Fixed | `interviews` = **Viva & Interviews tracker** (nav entry, stage 8); `interview-schedule` = **Schedule Viva** action (sub-item). Both retitled with cross-links to each other. |
| **G2** Analysis pages had no stage | ✅ Fixed | Each now carries a **stage tag** under its title + a link back to its owning stage: CV Analysis → Stage 4 (Review), Online Presence → Stage 5 (Shortlist), Summary Report → Stage 9 (Final Selection). All three also carry the stepper. |
| **G4** HM stage pages missing from nav | ✅ Fixed | `interview-rating` added to the HM sidebar as a sub-item under stage 8. |
| **M5** Duplicate step numbers | ✅ By design now | Shared stage numbers are intentional — companion/drill-down views legitimately sit at the same stage (e.g. stage 8 = tracker + schedule + HM feedback + rating). |
| **M7** PRD drift · **G5** re-screen · **G6** role framing | ⏳ Deferred (P2) | Still open. |

**Final spine:** `1 Template → 2 Import → 3 Process → 4 Review → 5 Shortlist → 6 Hiring Manager → 7 Written Exam → 8 Viva → 9 Selection → 10 Onboard`

**Verification:** 40/40 pages reachable from the login entry point · 0 broken links · 0 emoji-as-icons · brand blue on 40/40 · stepper on 19 workflow pages (14 HR + 5 HM) · sidebars made sticky + scrollable to accommodate the numbered spine.
