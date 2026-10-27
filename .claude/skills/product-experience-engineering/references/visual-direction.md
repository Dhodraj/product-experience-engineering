# Visual direction

Loaded at stage E. It decides what the surface looks like, and it is a
different decision inside a live product than on a new surface.

## Which job this is

| Situation | The job |
|---|---|
| A new screen inside a live product | Match. Read the nearest screen, take its tokens, scale and patterns, and change nothing that is not the point of this work |
| A new surface with an existing brand | The brand fixes type and colour. Quality comes from hierarchy, rhythm, density and alignment inside it |
| A new product with nothing fixed | Decide a direction and write it down as values, before any component |
| A redesign | The old look is evidence, not a starting point. Keep the product truth, the content and the function; replace the look as a whole rather than polishing it |

The commonest failure is the third job being done when it was the first.
Inventing a second visual system inside a product that already has one costs
more than the screen is worth.

## The numbers

The numeric defaults live in the installed `blueprint` skill's `rules.md`.
It covers body text size and line height, line length, type sizes per screen,
contrast ratios and target sizes. It also covers the spacing scale, grouping,
primary action count, greys, shadows, and the rules for dense screens. Read
that file rather than a copy of it, and name any number the brief
overrules.

Where `blueprint` is not installed, the floor is:

- body text 16px or larger, line height 1.5;
- at most five type sizes and two weights on a screen;
- 4.5:1 contrast for body text, 3:1 for large text and for the parts that
  identify a control;
- targets of 24 × 24 minimum, and 44 × 44 where touch is likely;
- a spacing scale whose steps each rise at least 25%;
- more space above a heading than below it;
- one primary action per view;
- status never carried by colour alone.

## What to decide, and write down as values

- **Identity and audience.** Who the surface is for and what it should feel
  like to them, in one line each. A freight console and a children's app are
  not the same product even when both are tables.
- **The direction**, from the product's own world: its material, its data, its
  place, what it produces. A palette taken from the subject beats a palette
  taken from the category.
- **Information architecture**: what the screen is about, what is secondary,
  and what is one step away.
- **Type**: the scale as values, the two weights, the display and body
  families, and what carries emphasis.
- **Spacing and density**: the scale, and the density decision for this
  surface, made once.
- **Colour**: the roles — ground, ink, accent, surfaces, status — as values,
  with the light and dark variants if the product has both.
- **Layout**: the frame, the grid, the regions, and how each breaks at 1024
  and 375.
- **Composition and interaction patterns**: which components compose the
  screen, and how selection, filtering and detail work.
- **Motion**: where it carries meaning, and nowhere else. Transform and
  opacity, 150 to 300ms, honouring `prefers-reduced-motion`.
- **Accessibility**: the contrast floor, the focus treatment, the keyboard
  path through the screen.

## No default aesthetic

A product does not need, and does not get by default:

- a dark theme;
- a gradient, or glassmorphism;
- an animated or particle background;
- a bento grid, or a grid of equal cards;
- a coloured left stripe;
- a soft shadow on everything at rest;
- an icon in a tinted rounded square;
- a numbered section chip;
- a monospace caption under a centred headline.

Each of those is a choice that has to earn its place on this surface for this
audience. The reason to name them is that they are what a model reaches for
when nothing was decided, and together they are the look people now recognise
as machine-made.

The same applies in reverse. Taking the ornaments away is half the job. A page
stripped of its cards and rules and given nothing in their place reads as
unfinished. What replaces them is substance: larger type, whole fields of
colour, real pictures of this subject, real data, and every section carrying
its full content.

## Using a reference

A reference is read for its principles, not copied for its surface.

- Prefer a **finished screen that already solves this job** over a component
  gallery. A gallery leaves out what goes in the header, what a row does when
  it fails, and where the secondary action sits.
- Take from it: what it chose to make dominant, what it left out, how it
  handles the dense case and the failure, its density decision, how it labels
  things.
- Do not take: its palette, its brand, its illustration style or its layout
  wholesale into an unrelated product.
- Where the project keeps a reference list (`.claude/screen-references.md`),
  start there and add to it.
- Record which references were used, in the report.

## Critique: six kinds, kept apart

When judging an existing design, a finding belongs to exactly one of these,
and mixing them is why design feedback gets ignored:

1. **Product and information architecture** — wrong problem, or the system's
   internals on display instead of the customer's task.
2. **Journey and usability** — the customer cannot get from entry to outcome.
3. **Visual design** — hierarchy, rhythm, density, type, colour,
   distinctiveness.
4. **Interaction and state** — missing or lying states, controls with no
   response.
5. **Accessibility** — contrast, naming, keyboard, focus, colour-only status.
6. **Implementation** — the code behind one of the above.

Then recommend a specific change and say which customer problem it removes.
"Improve the hierarchy" is not a recommendation. "Make the late-run count the
one dominant figure, drop the other eleven tiles to a single row of labels"
is. `experience-audit` holds the severity model and the report format.

## Preserve what is sound

Say what is working before changing anything, and keep it. A redesign that
silently drops a control a customer used every day has caused more harm than
the look it fixed. Where a decision looks wrong but deliberate — a dense
control row, a zoomed axis, a domain convention — ask rather than overrule.
