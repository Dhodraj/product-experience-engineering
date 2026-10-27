---
name: product-experience-engineering
description: "Build a product surface the way the business, the customer and a designer would want it, not the way a ticket is worded. Use when building or changing a SaaS screen, dashboard, landing page, onboarding flow, form or any customer-facing interface, and when asked to improve, critique or audit one. Establishes the customer outcome, maps the journey and its states, sets a visual direction, finds existing components before writing new ones, then drives the running application in a browser and reports what was verified. Companions: component-find, journey-walk, experience-audit."
---

# Product experience engineering

An agent asked for a screen writes the screen. The gap this skill closes sits
before and after that: deciding what the customer needs to get done, and
finding out whether the thing built actually does it.

Order of work, and the rule that governs it: **state the customer outcome
before the first file, and drive the running product before saying it works.**

## Pick the depth first

The stages below scale. Do not run all of them on a copy change.

| The change | Stages |
|---|---|
| Copy, a colour, one prop | B, G, then look at the result once (H) |
| One component, one state | B, D, F, G, H, K |
| A screen, a form, a flow | A to L, briefly |
| A new product, a new surface, a workflow nobody has designed | A to L, in full, with the proposal in C approved before G |
| "Audit this" | Use `experience-audit`; do not start editing |
| "Find me a component for…" | Use `component-find` |
| "Does the signup flow work?" | Use `journey-walk` |

Say which depth you chose in one line before starting. Where a stage is
skipped, the reason is that the change cannot reach what the stage protects,
not that it is slow.

## A. Understand the task and the product

Read what exists before asking anything: the repository's own product notes
(`PRODUCT.md`, `README.md`, `.claude/`, an existing brief), the routes, and
the screens next to this one.

Then establish the three answers in [references/product-thinking.md](references/product-thinking.md):
the business outcome, the customer and their job, and the smallest useful
solution. Two lines each. Where there is no evidence, write the assumption and
label it as one. Never write a persona, a conversion figure or a research
finding that nobody measured; `references/product-thinking.md` sets out what
counts as evidence and what does not.

Ask the user only where a different answer changes what gets built. One
question, with the interactive question tool, not a list.

## B. Inspect the current implementation

What is already there decides most of the work. Find, by reading:

- The stack, the styling system and the component library in use.
- The design tokens or scales that exist, and whether screens obey them.
- The nearest existing screen. A new screen inside a live product is a
  matching job before it is a design job.
- The tests that cover this area, and how they run.

A screen that contradicts the product's own system is a finding, not a
licence to invent a third system.

## C. Name the customer outcome and the acceptance criteria

Write the outcome as something observable:

> A dispatcher with 40 open runs can see which run is late and reassign it
> without leaving the list.

Then the acceptance criteria, each one checkable in a browser. "Looks good"
is not a criterion. "At 375px every run's status and its reassign control are
reachable without horizontal scroll" is.

For a new surface or a redesign, stop here and put the proposal to the user:
the outcome, the criteria, the layout skeleton, the components with their
sources, and what it costs. Build on a yes. The installed `blueprint` skill
owns this proposal step for a single screen; use it rather than repeating it.

## D. Map the journey and the states

[references/journey-and-states.md](references/journey-and-states.md) holds the
method. The short form: the trigger, each step with what the customer knows
and decides at it, what happens when they get it wrong, and what follows
success.

Then list the states this surface really has: empty, one item, many, the
densest real case, loading, partial failure, error, no permission. A screen
built on one fixture hides every other one, and that is the commonest reason
a finished screen fails on contact with a customer.

## E. Set the visual direction

[references/visual-direction.md](references/visual-direction.md). Inside a live
product, the direction is already set and the job is to match it. For a new
surface, decide the direction from the product's own world and audience, and
write it down as values: type scale, spacing scale, palette, density.

The numbers to build to live in the installed `blueprint` skill's `rules.md`.
Read that rather than restating it. No aesthetic is the default: a product
does not need a dark theme, a gradient, glass, an animated background or a
grid of cards unless its own audience and content call for one.

## F. Find components before writing them

Run `component-find`, or its script directly:

```bash
node .claude/skills/product-experience-engineering/scripts/find-components.js \
  <terms> --limit 15
```

Search the project's own components first; a second implementation of a
component the product already has is a defect. Then the registries.
[component-find](../component-find/SKILL.md) holds the translation, ranking
and licence rules. Write a component from scratch only after saying which
candidates were read and why each was unsuitable.

## G. Implement

Build the states from stage D, not only the happy path. Use the product's
existing tokens and components. Keep each change small enough that stage H
can tell what caused what.

Read [references/craft.md](references/craft.md) immediately before the first
UI edit, every time, including a small one. The numbers in `blueprint`'s
`rules.md` stop a screen being wrong. That file is what stops it being
forgettable:

- depth as a shadow rather than a border, and concentric radii;
- ease-out under 300ms, and staged entrances that never fire on a repeated
  interaction;
- tabular figures, and optical rather than geometric alignment;
- two parts of a screen connected, so the customer sees they are one thing.

## H. Run it and walk the journey

Not a source review. Start the application and open it in a browser. Use it
as the customer would, from the real entry point.

- [journey-walk](../journey-walk/SKILL.md) holds the procedure and the
  honesty rules.
- [references/playwright.md](references/playwright.md) holds the browser
  mechanics, and what to do when the application will not start here.

Look at the screenshots. Reading a file list is not looking. The installed
`inspect` skill covers the render-and-look pass at fixed widths and its seven
checks; use it and report against its names.

## I. Audit what you built

Measure, then judge. `scripts/measure.js` returns numbers from the live page.
It reports overflow, contrast, target sizes, controls with no name, heading
order and unsized media. It also returns the page's real census of type
sizes, radii and shadows.
[experience-audit](../experience-audit/SKILL.md) holds the severity model and
the report format. Separate, as that file requires:

1. Product and information-architecture problems.
2. Journey and usability problems.
3. Visual design problems.
4. Interaction and state problems.
5. Accessibility problems.
6. Implementation problems.

A measurement is a candidate, not a finding. Confirm it on the render, decide
whether it harms a customer, and group one cause into one finding.

## J. Fix what matters

Fix in severity order. Preserve decisions that are sound: a change you cannot
justify against the outcome in stage C is scope you were not asked for. Say
what you left alone and why.

## K. Check for regressions

[references/regression.md](references/regression.md). Identify the journeys
that already worked before touching the code, run the project's own checks for
the area you changed, and separate failures your change caused from failures
that were already there. Run the broader suite once, at the end, not after
every edit.

## L. Report

State, in this order:

- The customer outcome and whether it is met.
- What was built or changed, by file.
- What was verified, by what means, at which widths, and in which states.
- What was not verified, and why.
- Findings fixed, and findings left with their reason.
- Assumptions that are still assumptions.

Compilation is not completion. A screen nobody opened is not finished, and
walking a journey yourself is not evidence from a customer — say so in the
words of [references/product-thinking.md](references/product-thinking.md)
whenever a report could be read as research.

## Honesty, which outranks every stage above

- Never report a measurement you did not take, or a screen you did not render.
- Name the stand-in when something stood in for the real thing: a fixture for
  live data, a static page for the application, a local font for the brand's.
- When the application cannot be started or reached, say so in the report and
  mark every journey claim unverified. Do not describe the source as though
  you had seen it run.
- Simulating a customer finds friction. It does not measure what customers do.

## What this skill borrows, and from where

[NOTICE](NOTICE) records it. The component sources and their licences, as read
on 2026-10-27, are in [sources.json](sources.json); `scripts/check-sources.js`
validates that file and `tests/run.sh` tests the scripts.
