# RepoPilot — Design System

This document adapts the supplied Stitch design reference into implementation-ready guidance for the RepoPilot product UI.

## 1. Design principles

- **Editorial technicality:** pair refined serif headlines with highly legible sans-serif UI and monospaced code metadata.
- **Quiet focus:** use a deep burgundy canvas and restrained rose accents instead of generic blue or high-neon cyberpunk styling.
- **Evidence first:** answers, citations, source excerpts, and uncertainty should be visually distinct.
- **Dense where needed, spacious where useful:** repository trees and code panes are compact; explanations and onboarding cards breathe.
- **Trustworthy, not theatrical:** glow effects are subtle and reserved for active/focused elements. Avoid fake telemetry or unsupported claims.

## 2. Color tokens

| Token | Hex | Usage |
|---|---|---|
| `wine-abyss` | `#12020A` | Deepest canvas, code gutter / recessed area |
| `background` | `#1A050F` | Main application background |
| `burgundy-base` | `#2A0918` | Primary panel and navigation surfaces |
| `burgundy-surface` | `#3B0E23` | Cards, editor panels, active surfaces |
| `burgundy-elevated` | `#4E132E` | Menus, selected cards, popovers |
| `border-wine` | `#541931` | Hairline borders and dividers |
| `blush-primary` | `#F472B6` | Primary accent, focus state, active navigation |
| `rose-accent` | `#FB7185` | Primary CTA, important active state |
| `rose-muted` | `#FDA4AF` | Metadata and secondary accent |
| `blush-highlight` | `#FCE7F3` | High-emphasis secondary text |
| `text-on-dark` | `#FFF1F2` | Primary text and headings |
| `text-muted` | `#D4A5B8` | Supporting text, placeholders, descriptions |
| `error` | `#FFB4AB` | Error text and error state |

Maintain contrast for all text. Do not use muted rose for small text on bright accent surfaces without checking readability.

## 3. Typography

- **Display / section headlines:** Bodoni Moda, serif.
- **Body / controls / forms:** Plus Jakarta Sans, sans-serif.
- **Code / paths / line numbers / metadata:** JetBrains Mono, monospace.

Suggested hierarchy:
- H1: 36–42 px desktop; 30–32 px mobile.
- H2: 26–30 px.
- H3 / card title: 16–18 px, semibold.
- Body: 13–15 px.
- Supporting text: 12–13 px.
- Code: 12–13 px.
- Micro-labels: 10–11 px, uppercase, letter-spaced.

If external font loading is unavailable, fall back to Georgia for serif, system sans-serif for body, and system monospace for code.

## 4. Spacing and layout

Use a consistent 4 px base scale:
- `space-xs`: 4 px
- `space-sm`: 8 px
- `space-md`: 12–16 px
- `space-lg`: 20–24 px
- `space-xl`: 32–40 px

Responsive behavior:
- **Desktop ≥1280 px:** persistent repository navigation (about 260–280 px), main work area, optional evidence inspector.
- **Tablet 768–1279 px:** collapse inspector into a drawer or tab; keep main workflow fluid.
- **Mobile <768 px:** single-column layout; repository tree and evidence become drawers or stacked sections.

Use 8 px corners for panels/cards, 4 px for tags and dense controls, and 12 px for dialogs/drawers. Avoid excessive pill-shaped controls except status indicators.

## 5. Surface and elevation

1. **Canvas:** `#1A050F`, optional subtle 24 px grid at very low opacity.
2. **Recessed panels:** `#2A0918` with a 1 px `#541931` border.
3. **Cards / code panels:** `#3B0E23` with subtle top highlight and restrained blur only where supported.
4. **Overlays:** `#4E132E` with clear border and strong text contrast.
5. **Focus / active:** 1 px blush border and a subtle rose halo. Never rely on glow alone to indicate state.

Avoid using blur effects on every panel; prioritize legibility and performance.

## 6. Components

### Primary button
- Rose gradient or solid `#FB7185`.
- Dark wine text.
- Semibold label.
- Hover: modest brightness/glow increase.
- Disabled: visibly muted and non-interactive.
- Use for primary actions such as Scan repository or Ask RepoPilot.

### Secondary button
- Transparent or `#2A0918` surface.
- Border `#541931`.
- Text `#FCE7F3`.
- Hover border shifts toward `#F472B6`.

### Inputs
- Background `#2A0918`.
- Border `#541931`.
- Text `#FFF1F2`.
- Placeholder `#D4A5B8`.
- Focus border `#F472B6` plus visible keyboard focus ring.
- Always show a visible label; placeholder is not a label.

### Status badges
- Small uppercase JetBrains Mono label.
- Background `#3B0E23`, border `#541931`.
- Use semantic labels: `INDEXED`, `LOCAL MODEL`, `WARNING`, `ERROR`.
- Do not imply a model is connected or repository indexed until verified.

### Repository tree
- Compact rows with file-type icons and readable paths.
- Hover surface `#3B0E23`.
- Selected row: blush text and 2 px left indicator.
- Indent nested files consistently.
- Provide accessible names and keyboard navigation where supported.

### Search result
- File path and line range in monospace.
- Highlight matched term without obscuring syntax.
- Show a short excerpt, not a full file.
- Clicking opens the source viewer at the relevant lines.

### Answer panel
- Separate AI explanation from evidence.
- Show uncertainty and limitations visibly.
- Each citation is a clickable control that opens the exact source range.
- Never render unvalidated model-supplied paths as trusted links.

### Code viewer
- Dark recessed surface.
- JetBrains Mono.
- Stable line-number gutter.
- Syntax highlighting is optional for MVP; source correctness and readable line numbers take priority.
- Long lines may scroll horizontally; do not silently truncate source evidence.

### Empty, loading, error states
- Explain what happened and the next action.
- Loading state must reflect a real operation.
- Errors must not expose stack traces or secrets to end users.
- Provide retry where safe.

## 7. Information architecture

Primary navigation:
1. Overview
2. Repository Tree
3. Code Search
4. Ask RepoPilot
5. Reports / Export
6. Settings (model endpoint and scan exclusions)

Keep the active repository visible at all times. On small screens, use a drawer or segmented tabs rather than squeezing three columns together.

## 8. Motion and interaction

- Use 120–200 ms transitions for hover and drawer changes.
- Avoid animations that suggest background indexing unless indexing is actually happening.
- Respect reduced-motion preferences in web-based UI.
- Focus rings must remain visible.
- Every icon-only button needs an accessible label.

## 9. Product copy

Preferred:
- “Scan repository”
- “Search source”
- “Ask RepoPilot”
- “Evidence”
- “Open source”
- “Not enough evidence to answer confidently”

Avoid:
- “100% accurate”
- “Understands every codebase”
- “Zero risk”
- “Fully private” unless every data path has been verified.

## 10. Notes for implementation

The supplied Stitch reference uses a polished website/dashboard aesthetic and remote Google Fonts / Tailwind assets. For the actual local-first application, prioritize the same palette and hierarchy while ensuring the UI works without external font or asset requests where practical. Streamlit can approximate the design with custom CSS, but complex multi-pane behavior may require a custom frontend later.
