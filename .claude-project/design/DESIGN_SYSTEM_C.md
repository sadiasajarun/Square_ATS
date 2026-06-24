# DESIGN_SYSTEM — Variation C: "Focus"

**DNA:** Modern, warm, calm and approachable. Slate neutrals with a warm amber accent, softer rounded cards, Manrope font, airy. Reduces fatigue across long screening sessions; feels human and contemporary without being playful.

## Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#FAFAF9` | App background (warm paper) |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#F5F5F4` | Fills, table header |
| `--border` | `#E7E5E4` | Borders (warm gray) |
| `--text` | `#1C1917` | Primary text |
| `--text-muted` | `#78716C` | Secondary (stone) |
| `--primary` | `#0F766E` | Teal — primary actions, active nav |
| `--primary-hover` | `#0D5F58` | Hover |
| `--primary-soft` | `#D7F0ED` | Selected, badge bg |
| `--accent` | `#EA8A0B` | Amber — highlights, scores, attention |
| `--accent-soft` | `#FCEBCF` | Amber soft bg |
| **Status** | | |
| `--success` | `#15803D` / soft `#DCFCE7` | Shortlisted/active |
| `--info` | `#0F766E` / soft `#D7F0ED` | Screened/info |
| `--warn` | `#EA8A0B` / soft `#FCEBCF` | Pending/processing |
| `--danger` | `#DC2626` / soft `#FEE2E2` | Rejected-pending/failed |
| `--caution`| `#9333EA` / soft `#F3E8FF` | Duplicate |
| `--muted` | `#78716C` / soft `#F5F5F4` | Inactive |

## Typography
- **Font:** `Manrope`, system fallback. (Bangla: `Noto Sans Bengali`.)
- Scale: display 28/700, h1 22/700, h2 18/600, body 14.5/450, small 13/450, label 12/600 tracking-wide.
- Scores: `Manrope` 700 tabular-nums, large.

## Spacing & Shape
- Base 4px. Generous: card padding 24–28px, section gap 28px, table cell 14px 18px (roomier rows).
- Radius: cards 16px, inputs/buttons 10px, badges 8px, pills 999px.
- Shadow: soft layered `0 1px 3px rgba(28,25,23,.06), 0 8px 24px -12px rgba(28,25,23,.12)`.

## Components
- **Sidebar:** warm white, 256px, active item = teal soft bg + rounded 10px pill + teal text.
- **Buttons:** primary teal solid (rounded 10px); secondary surface + border; amber used sparingly for "needs attention" CTAs.
- **Score bar:** rounded full track, amber→teal→green by band; large numeric to the right.
- **Badge:** soft bg, 8px radius, gentle.
- **Table:** roomy rows, hover `--surface-2`, rounded card container around table.

## Personality
Warm, focused, low-fatigue, "designed for humans doing careful work." Best when STL prioritizes reviewer comfort and a modern, friendly-but-professional feel.
