# OG card mockups

Design exploration for recipe Open Graph title cards (Satori → PNG).

```bash
npm install
node scripts/og-mockups/generate.mjs
```

Outputs land in `scripts/og-mockups/out/` (gitignored). Fonts are vendored under `fonts/` for offline CI/local runs.

## Layouts

| Key | Idea |
| --- | --- |
| `a-photo-veil` | Full-bleed featured photo + bottom gradient veil + title stack |
| `b-split-ledge` | Forest-green text panel left, photo right |
| `c-type-plate` | No photo — ink/navy archival type plate with inset frame |
| `d-bottom-bar` | Photo-forward with cream metadata bar (brand + category + title) |
| `e-soft-cover` | Dimmed full-bleed photo, centered cookbook-cover typography |
