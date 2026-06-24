# Workflow Components (round-2) — HR nav grouping + Step Indicator

Applied uniformly across HR pages by the normalization scripts. Single source of truth for §8 (step indicator) and §13 (grouped sidebar nav).

## Naming convention
All mockup files use the `.page.html` suffix (established in round 1; the whole prototype is interlinked on it). The round-2 spec's `*.html` names map 1:1 to `*.page.html`.

## New HR sidebar nav (grouped)

```
Workspace
  Dashboard          dashboard.page.html
  Job Positions      positions.page.html
Hiring Workflow
  Import CVs         import-cvs.page.html        (replaces upload.page.html)
  Review CVs         cv-review.page.html
  Screening Results  results.page.html
  Interviews         interviews.page.html
  Final Selection    final-selection.page.html
Talent & System
  Candidates         candidates.page.html
  Exports            exports.page.html
  Settings           settings.page.html
```

### Active-state mapping (filename → active nav item)
- dashboard → Dashboard
- positions / position-new / position-detail / template-builder → Job Positions
- import-cvs / processing → Import CVs
- cv-review → Review CVs
- results / application-detail → Screening Results
- interviews / interview-schedule → Interviews
- final-selection / onboarding → Final Selection
- candidates / candidate-detail → Candidates
- exports → Exports
- settings → Settings

The `.side-foot` (user info + Sign out → ../auth/login.page.html) is preserved unchanged.

## Step Indicator (§8)

Linear flow shown at the top of every position-flow page:

`Template → Import → Process → Review → Shortlist → Hiring Manager → Interview → Hire`

Step → target page:
1. Template → template-builder.page.html
2. Import → import-cvs.page.html
3. Process → processing.page.html
4. Review → cv-review.page.html
5. Shortlist → results.page.html
6. Hiring Manager → ../hiring-manager/shortlist.page.html
7. Interview → interview-schedule.page.html
8. Hire → final-selection.page.html

Rules: completed steps = green check + clickable link; current step = solid Square-blue dot (not a link); future steps = muted, not links. Injected as the first child of `<main class="content">`.

Pages that receive the step indicator: template-builder, import-cvs, processing, cv-review, results, application-detail, interview-schedule, final-selection, onboarding.

### CSS (added to each such page's shared `<style>`)
```css
.stepper{display:flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 16px;margin-bottom:20px;overflow-x:auto;box-shadow:var(--shadow)}
.step{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12.5px;font-weight:600;white-space:nowrap}
.step .dot{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--surface-2);color:var(--muted);font-size:12px;border:1px solid var(--border);flex:none}
.step .dot svg{width:14px;height:14px}
.step.done{color:var(--text)} .step.done .dot{background:var(--success-s);color:var(--success);border-color:var(--success-s)}
.step.current{color:var(--primary)} .step.current .dot{background:var(--primary);color:#fff;border-color:var(--primary)}
.step-sep{flex:1;min-width:16px;height:2px;background:var(--border);margin:0 8px}
.step-sep.done{background:var(--success)}
a.step{text-decoration:none}a.step:hover .dot{border-color:var(--primary)}a.step:hover{color:var(--primary)}
```
