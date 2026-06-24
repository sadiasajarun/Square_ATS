# DESIGN_QA_STATUS — stl-ats (P3f)

date: 2026-06-23
variation: A (Clarity · Square brand blue #0B61C2)

## Checks

| Check | Result |
|-------|--------|
| Role folders present (auth, hr, hiring-manager, viewer, admin) | ✅ all 5 |
| Pages per role (auth 2, hr 15, hiring-manager 4, viewer 4, admin 5) | ✅ 30 total |
| Shared shell / design-system consistency (brand blue `#0B61C2` in all) | ✅ 30/30 |
| No stray indigo (#4F46E5) | ✅ 0 |
| `:root` token block present in every page | ✅ 30/30 |
| Cross-role + intra-role href integrity | ✅ 0 broken links |
| No emojis as icons (📧 ☎ 📍 🎓 stripped from 2 HR pages) | ✅ 0 remaining |
| Status badge semantics (.b-suc/.b-inf/.b-warn/.b-dan/.b-cau/.b-mut) | ✅ used per fixed mapping |
| Human-in-the-loop affordances (override modal w/ mandatory reason on application-detail) | ✅ present |
| Read-only enforcement (viewer pages, HM no-override) | ✅ honored |

## Notes
- All pages reuse the verbatim `<style>` block + shell from `_SHARED_SHELL_A.html`.
- Score explanation panel (per-criterion contributions + matched/missed evidence + red flags) implemented on hr/application-detail and read-only variants for hiring-manager/viewer.
- SMS + OCR shown as stub adapters (b-mut "stub in v1" badges) per build decisions.

## Verdict: PASS
