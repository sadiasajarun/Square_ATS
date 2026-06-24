# DESIGN_SYSTEM — Variation A: "Clarity" (Square brand blue)

**DNA:** Clean, neutral, professional SaaS (Stripe / Linear lineage) carrying **Square Toiletries' corporate blue** as the primary. Maximum legibility, generous whitespace, subtle borders. Feels like a trustworthy modern enterprise tool that is unmistakably Square's.

**Brand source:** squaretoiletries.com — corporate blue logo/header with bright blue accents.

## Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#F8FAFC` | App background |
| `--surface` | `#FFFFFF` | Cards, panels, tables |
| `--surface-2` | `#F1F5F9` | Subtle fills, table header |
| `--border` | `#E2E8F0` | Hairline borders |
| `--text` | `#0F172A` | Primary text |
| `--text-muted` | `#64748B` | Secondary text |
| `--primary` | `#0B61C2` | **Square brand blue** — primary actions, active nav |
| `--primary-hover` | `#094E9E` | Hover |
| `--primary-soft` | `#E6F0FB` | Selected rows, badge bg |
| `--accent` | `#1E88E5` | Bright Square blue — highlights, focus rings, links |
| **Status** | | |
| `--success` | `#16A34A` / soft `#DCFCE7` | Shortlisted/active |
| `--info` | `#0369A1` / soft `#E0F2FE` | Screened/info (deep cyan-blue, distinct from brand primary) |
| `--warn` | `#D97706` / soft `#FEF3C7` | Pending/processing |
| `--danger` | `#DC2626` / soft `#FEE2E2` | Rejected-pending/failed |
| `--caution`| `#7C3AED` / soft `#EDE9FE` | Duplicate |
| `--muted` | `#64748B` / soft `#F1F5F9` | Inactive |

## Typography
- **Font:** `Inter`, system-ui fallback. (Bangla: `Noto Sans Bengali`.)
- Scale: display 28/700, h1 22/700, h2 18/600, body 14/400, small 13/400, label 12/500 uppercase tracking-wide.
- Numbers/scores: `Inter` tabular-nums.

## Spacing & Shape
- Base unit 4px. Card padding 24px. Section gap 24px. Table cell 12px 16px.
- Radius: cards 12px, inputs/buttons 8px, badges 6px, pills 999px.
- Shadow: `0 1px 2px rgba(15,23,42,.06)` resting; `0 4px 12px rgba(15,23,42,.08)` on raised panels.

## Components
- **Sidebar:** white, 248px, brand-blue active item (soft bg + primary text + 3px left accent).
- **Buttons:** primary Square-blue solid; secondary white + border; ghost text.
- **Score bar:** track `--surface-2`, fill by score band (<50 danger, 50–74 warn, ≥75 success).
- **Badge:** soft bg + saturated text, 6px radius, dot prefix.
- **Table:** zebra off, hover `--primary-soft`, sticky header `--surface-2`.
- **Brand mark:** square logo tile uses `--primary` (Square blue).

## Personality
Quiet, precise, "this tool gets out of your way" — wrapped in Square Toiletries' corporate blue identity. Best for Admin / HR / executive users who want a familiar, low-fatigue, on-brand SaaS feel.
