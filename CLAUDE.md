# OneHealth — working notes

Static marketing site. Plain HTML per page, Tailwind v4, Alpine.js from CDN.
No build framework and no templating: each page is a standalone `.html` file.

## Build

```
npm run dev      # watch + rebuild on save — run this while working
npm run build    # one-off minified build
```

`assets/css/app.css` is **generated** and gitignored. Nothing in `src/input.css`
or any new Tailwind class reaches the browser until one of the above runs.

## Design system — use the defined values, never new ones

Everything below is defined in `src/input.css` and demonstrated in
`ui-kit.html`. **Read `ui-kit.html` before building a new page or component** —
it is the source of truth, and copy-pasting a block from it is the intended
workflow.

### Typography — always a `type-*` class

Never write `text-[20px]`, `font-aktiv text-3xl`, or a bare `tracking-*` on
body copy. The scale comes from Figma (Typography_390 + Typography_1680) and
ramps from the mobile value at base to the desktop value at `2xl`:

| Class | Face | mobile → 2xl | Use for |
|---|---|---|---|
| `type-title` | Aktiv | 40 → 80 | page `<h1>` |
| `type-heading` | Aktiv | 24 → 56 | section headings |
| `type-subheading` | Aktiv | 18 → 28 | card titles, sub-headings |
| `type-button` | DIN DemiBold | 16 | every button label |
| `type-body` | DIN | 16 | all body copy, captions, small labels |
| `type-helper` | DIN | 12 | form error / helper text |
| `type-label` | DIN | 10 | floating input labels |

There is no 14px step and no Aktiv below 18px — 16px and under is DIN. If a
design seems to need a size outside this scale, ask rather than inventing one.

Colour, `leading-*` and layout utilities are still written at the call site;
they sit in the utilities layer and correctly override the `type-*` component
class.

### Colour — tokens only, never hex

`bg-brand` `#233D7C` · `bg-brand-hover` `#183373` · `bg-brand-disabled`
`#7A8BB4` · `text-error` `#B26120`

`hover:bg-brand-hover` is a real second colour — do **not** substitute
`bg-brand/90`, which is lighter and shifts with whatever is behind it.

### Recurring patterns

- **Corner fold** — the brand signature. Buttons use an absolutely positioned
  14px SVG at `top-[4px] right-[4px]`; image frames use
  `clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)`.
- **Page gutters** — always `container-page`, never ad-hoc `px-*` on a section.
- **`lg` (1024px) is the mobile/desktop boundary** for behaviour, not just
  layout: sticky/pinned scroll scenes, the floating lab widget and the scroll
  scrubs are all `lg:`-gated, and their JS is gated behind a matching
  `matchMedia('(min-width: 1024px)')`. A pinned scene must never run on a phone.
- **Motion** — every animation needs a `prefers-reduced-motion: reduce` escape.
  Reveals use an IntersectionObserver that unobserves after firing.

## Known constraints

- **Fonts are TRIAL files.** DIN 2014 substitutes a watermark icon for 28
  codepoints (`! " # $ % & ' ( ) * + - / 4 < = > @ [ \ ] ^ _ \` { | } ~`), which
  the `unicode-range` on those `@font-face` rules works around by falling back.
  Aktiv Grotesk is clean. Re-verify with a glyph-outline hash if the files are
  swapped. The real fix is licensed files.
- **Header and footer are copy-pasted into every page.** There is no include
  mechanism. Changing navigation means editing every `.html` file. Treat this as
  the main structural debt. The **page header** was reconciled and its class
  strings are now identical across all ten pages (only the logo `src` and
  `bg-white` on `<header>` vary, per `ui-kit.html`) — `ivd-life-sciences.html`
  and `medical-products.html` had been missing the search button entirely.
  Verify with:
  `for f in *.html; do awk '/<header/,/<\/header>/' $f | grep -o 'class="[^"]*"' | md5sum; done`
  The **footer** has not been reconciled.
  The one exception is the **nav overlay** — the `<!-- component: nav-overlay -->`
  block holding the menu and search panels sits immediately after `<body>` on
  every page and is currently **byte-identical across all of them**. Keep it that
  way: edit `index.html` and copy the whole block over, rather than patching each
  file. It lives at the top level, not inside the header, because `.hero-pinned`
  is `position: sticky` from lg up and so forms a stacking context that would
  bury anything nested inside it. State comes from the `nav` Alpine store in
  `assets/js/nav.js`, which also holds the search index — that file is scanned by
  Tailwind (see the `@source` in `src/input.css`) because it builds class strings.
- `careers.html` is still the untouched starter scaffold ("Institute", `/about`
  links) and is not wired into the nav system.
- `index.html`, `about.html`, `contact.html` and `article.html` are migrated to
  the type scale and colour tokens. The other pages are not yet.
- `article.html` also carries a copy of `index.html`'s footer and
  `articles-section`, so those two are the reconciled reference pair — copy from
  either when reconciling the rest.
