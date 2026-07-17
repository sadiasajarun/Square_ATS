# STL AI-Powered ATS — Prototype

AI-powered Applicant Tracking System with intelligent CV screening for **Square Toiletries Limited (STL)**.
Clickable HTML/CSS prototype (Variation A "Clarity", Square brand blue `#0B61C2`) — pure HTML + inline SVG + vanilla JS, no build step.

## Live prototype

Once GitHub Pages is enabled (see below), the site entry point is the **login page**:

```
https://sadiasajarun.github.io/Square_ATS/
```

The root redirects straight to the login screen. From login you can **explore every role** (HR, Hiring Manager, Viewer, Admin) and walk the full hiring cycle.

## What's in here

| Path | Contents |
|------|----------|
| `docs/` | **The hosted prototype** (GitHub Pages serves this). `index.html` → login. 40 interlinked pages across `auth/ hr/ hiring-manager/ viewer/ admin/` + `assets/`. |
| `.claude-project/` | Pipeline artifacts: `docs/PRD.md`, `design/` (DESIGN_SYSTEM, design guide, the canonical `html/` source the `docs/` copy is generated from), `status/`. |
| `.claude/` | Build pipeline / rules tooling. |
| `CHANGES.md` | Full per-round revision log (rounds 1–8). |

> Note: `docs/` is a deployable copy of `.claude-project/design/html/` (Pages can't serve the dotted `.claude-project` folder). Edit the canonical tree, then re-copy into `docs/`.

## Hosting on GitHub Pages — step by step

1. Push this repo to GitHub (already at `github.com/sadiasajarun/Square_ATS`).
2. On GitHub, open the repo → **Settings** (top-right tab).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, select **`main`** and the folder **`/docs`**, then click **Save**.
6. Wait ~1 minute. The page shows: *"Your site is live at `https://sadiasajarun.github.io/Square_ATS/`"*.
7. Open that URL → it redirects to the login page. Done.

To update the live site later: edit pages, copy the latest `.claude-project/design/html/*` into `docs/`, commit, and push to `main` — Pages redeploys automatically.

## The hiring flow (what to click)

`login → pick a role`
**HR:** Dashboard → Job Positions → Template Builder → Import CVs → Processing → Review CVs → AI Shortlist → Screening Results → Send to Hiring Manager
**Hiring Manager:** Shortlist Review (accept/reject) → Interview Feedback (score) → Final Selection (AI suggests → HM selects) → sends to HR
**HR:** Final Selection (read-only) → Onboarding (offer email + onboarding checklist)
Admin (users/audit/settings) and Viewer (read-only) areas included. **Sign out** from any page.
