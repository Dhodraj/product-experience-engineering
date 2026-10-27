# Craft

Loaded at stage G, immediately before any UI edit. The numbers in the
`blueprint` skill's `rules.md` stop a screen being wrong. These stop it being
forgettable. A correct screen and a screen people like are not the same
screen, and the difference is almost always a pile of small things.

Express every fix in the project's own styling system. Never introduce a
second one to apply a polish fix.

## Depth is a shadow, structure is a border

A border drawn only to make a card look raised reads as a line, not as lift.
It also breaks the moment the surface behind it changes. Use three layers: a
1px ring, a short lift, and an ambient pool. Pure black at low alpha, never a
tinted near-black. A tinted one picks up the surface under it and reads as
dirt.

```css
--lift:
  0 0 0 1px oklch(0 0 0 / .055),
  0 1px 2px -1px oklch(0 0 0 / .06),
  0 2px 4px 0  oklch(0 0 0 / .035);
--lift-hover:
  0 0 0 1px oklch(0 0 0 / .085),
  0 2px 4px -2px oklch(0 0 0 / .08),
  0 8px 20px -6px oklch(0 0 0 / .09);
```

On a dark surface the ambient layers are invisible: drop to a single white
ring, `0 0 0 1px oklch(1 0 0 / .1)`.

Keep a border where it separates: dividers, table rules, input outlines,
selected and focus states.

## Concentric radii

`outer = inner + padding`. Equal radii on nested surfaces make the inner one
look pinched. It is the commonest reason a screen feels off while every value
in it is defensible. Above about 24px of padding the two are separate
surfaces, and each picks its own radius.

## Motion

- ease-out, never ease-in. `ease-in` delays the first frame, which is the
  frame the eye is on. Use `cubic-bezier(.23, 1, .32, 1)` for interface
  motion and `cubic-bezier(.2, 0, 0, 1)` for a cross-fade.
- Under 300ms. Press feedback 100 to 160ms, tooltips 125 to 200ms, dropdowns
  150 to 250ms, a drawer up to 500ms. A 180ms transition feels faster than a
  400ms one, because it is.
- Transitions for state, keyframes for sequences. A CSS transition can be
  interrupted mid-flight; a keyframe restarts from zero. So anything the
  customer can reverse is a transition: hover, open, select.
- Never `transition: all`. Name the properties. Animate `transform`,
  `opacity` and `filter`, which the GPU composites. Animating `height`,
  `top` or `width` costs layout on every frame.
- Never from `scale(0)`. Nothing in the world appears from nothing. Start at
  `0.9` to `0.96`, with opacity.
- Press gives `scale(.96)`. Exactly that: below `0.95` reads as a flinch.
- Exits are shorter than enters, 150ms against 300ms, and softer. Use a small
  fixed `translateY`, never the element's full height.
- Honour `prefers-reduced-motion` by collapsing durations to 1ms, not by
  leaving elements invisible.

## Entrances, and where they are allowed

Stagger a staged entrance by ~100ms per region, combining `opacity`,
`translateY(10–12px)` and `blur(4–5px)` over 400–560ms. For a headline,
split it into words at ~70–80ms each.

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
  to   { opacity: 1; transform: none;             filter: blur(0); }
}
```

That is for an infrequent arrival: a first paint, a success state, an empty
state. Never for a repeated interaction. A row hover, a keystroke or a tab
change that animates costs the customer attention on every trigger. Those get
instant feedback, or a colour or opacity change under 150ms.

Below the first screen, reveal a section the first time it arrives and never
again, with an `IntersectionObserver` that unobserves on the first hit. The
first screen animates on load and must not wait for a scroll.

## Type and numbers

- `font-variant-numeric: tabular-nums` on anything that changes: a count, a
  timer, a column of figures. Proportional digits shift the layout under the
  reader.
- Keep one type scale per screen, and let scale carry the hierarchy.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body text.
- `-webkit-font-smoothing: antialiased` at the root on macOS.
- Scale contrast is the cheapest way to make a screen feel designed. A
  display figure at 8 to 12 times the body size says what matters. Twelve
  things at 1.2 times say nothing.

## Optical, not geometric

- A button with a trailing icon takes 2px less padding on the icon side.
- A play triangle sits 2px right of centre.
- Fix an asymmetric icon in its SVG rather than with a margin in every
  component that uses it.

## Icons

Match the stroke to the text it sits beside: 1.5px next to regular, 2px next
to semibold. One icon set per surface. One SVG per icon, coloured through
`currentColor`, with states from CSS — never a second asset. Outline is the
default; fill marks the active state.

## Hit areas

Visible size and hit area are different numbers. A 36px control in a dense
console is fine if its hit area reaches 44px through a pseudo-element, and no
two hit areas may overlap.

```css
.control { position: relative; }
.control::after { content: ""; position: absolute; inset: -4px -2px; }
```

## Connect the surfaces

The strongest moment in a screen is usually not an effect. It is two parts of
the screen turning out to be the same thing. Hover a row and the bar that
represents it lights up. Select a point and the list filters. It costs a few
lines, it teaches the customer how the screen is wired, and it is the thing
people remember.

Colour alone must never carry it. The link also moves, lifts or changes
weight.

## Reviewing craft

Slow the interface down: replay motion at 10% in the browser's animation
panel and walk hover, focus, active, loading and empty. What looks wrong at
10% is what feels wrong at full speed.

Report findings as a table with Before, After and Why columns, never as loose
`Before:` and `After:` lines.

## Attribution

The values on this page are adapted from
`jakubkrehel/make-interfaces-feel-better` and `emilkowalski/skills`, both
MIT. [NOTICE](../NOTICE) records what was taken and what was changed.
