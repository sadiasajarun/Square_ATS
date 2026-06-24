# DESIGN_SYSTEM — Variation B: "Square Corporate"

**DNA:** Brand-forward enterprise HRIS. Confident deep teal-green primary (evokes Square Toiletries' corporate identity), structured and dense, strong header bar, IBM Plex Sans. Feels like serious, institutional enterprise software built for power users.

## Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#F4F6F5` | App background (cool neutral) |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#ECF1EF` | Table header, fills |
| `--border` | `#D7DEDB` | Borders |
| `--text` | `#10221C` | Primary text (near-black green) |
| `--text-muted` | `#5C6E68` | Secondary |
| `--primary` | `#0B6E4F` | Deep teal-green — primary actions |
| `--primary-hover` | `#08583E` | Hover |
| `--primary-soft` | `#E3F2EC` | Selected, badge bg |
| `--primary-dark` | `#0A3D2C` | Sidebar/top-bar background |
| `--accent` | `#C8A33C` | Gold accent — highlights, KPIs |
| **Status** | | |
| `--success` | `#0B6E4F` / soft `#E3F2EC` | Shortlisted/active |
| `--info` | `#1E6FB8` / soft `#DCEBF7` | Screened/info |
| `--warn` | `#B5781A` / soft `#FBEFD6` | Pending/processing |
| `--danger` | `#C2402F` / soft `#F8DED9` | Rejected-pending/failed |
| `--caution`| `#6D4AAE` / soft `#E9E2F5` | Duplicate |
| `--muted` | `#5C6E68` / soft `#ECF1EF` | Inactive |

## Typography
- **Font:** `IBM Plex Sans`, system fallback. (Bangla: `Noto Sans Bengali`.)
- Scale: display 26/600, h1 21/600, h2 17/600, body 14/400, small 12.5/400, label 11/600 uppercase tracking-wider.
- Scores: `IBM Plex Mono` tabular for numeric emphasis.

## Spacing & Shape
- Base 4px. Card padding 20px. Denser tables (cell 10px 14px) for power users.
- Radius: cards 8px, inputs/buttons 6px, badges 4px, pills 999px.
- Shadow: minimal — rely on borders; `0 1px 0 rgba(16,34,28,.05)`.

## Components
- **Top bar:** `--primary-dark` solid, white text, gold active underline; left sidebar `--primary-dark` darker shade.
- **Sidebar:** dark green, white/70 items, active = white text + gold left accent.
- **Buttons:** primary deep-green solid; secondary outline green; accent (gold) for emphasis CTAs only.
- **Score bar:** green fill, gold marker at threshold line.
- **Badge:** soft bg, 4px radius, square corners feel institutional.
- **Table:** dense, header `--surface-2` bold uppercase labels, hover `--primary-soft`.

## Personality
Authoritative, branded, "enterprise system of record." Best when STL wants the tool to feel corporate, owned, and built for daily heavy use.
