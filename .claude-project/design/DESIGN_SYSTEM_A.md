# DESIGN_SYSTEM — Variation A: "Clarity"

**DNA:** Clean, neutral, professional SaaS (Stripe / Linear lineage). Maximum legibility, generous whitespace, subtle borders, indigo accent. Feels like a trustworthy modern enterprise tool.

## Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#F8FAFC` | App background |
| `--surface` | `#FFFFFF` | Cards, panels, tables |
| `--surface-2` | `#F1F5F9` | Subtle fills, table header |
| `--border` | `#E2E8F0` | Hairline borders |
| `--text` | `#0F172A` | Primary text |
| `--text-muted` | `#64748B` | Secondary text |
| `--primary` | `#4F46E5` | Indigo — primary actions, active nav |
| `--primary-hover` | `#4338CA` | Hover |
| `--primary-soft` | `#EEF2FF` | Selected rows, badges bg |
| **Status** | | |
| `--success` | `#16A34A` / soft `#DCFCE7` | Shortlisted/active |
| `--info` | `#2563EB` / soft `#DBEAFE` | Screened/info |
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
- **Sidebar:** white, 248px, indigo active item (soft bg + primary text + 3px left accent).
- **Buttons:** primary indigo solid; secondary white + border; ghost text.
- **Score bar:** track `--surface-2`, fill indigo→green gradient by score band (<50 danger, 50–74 warn, ≥75 success).
- **Badge:** soft bg + saturated text, 6px radius, dot prefix.
- **Table:** zebra off, hover `--primary-soft`, sticky header `--surface-2`.

## Personality
Quiet, precise, "this tool gets out of your way." Best when HR wants a familiar, low-fatigue SaaS feel.
