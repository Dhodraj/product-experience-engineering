---
name: experience-audit
description: "Audit an interface that already exists and report what harms its customers, with evidence and severity. Use when asked to audit, review, critique or check a page, screen, dashboard or flow, or when the user says it looks off, looks AI-generated, feels confusing or asks whether it is ready to ship. Measures the live render, walks the journey, separates product, journey, visual, interaction, accessibility and implementation problems, and prioritises them. Two modes: audit only, which changes no files, and audit and fix."
---

# Experience audit

Two modes, and the mode is settled before anything else.

| Mode | Triggered by | What it may do |
|---|---|---|
| **Audit only** | "audit", "review", "critique", "what is wrong with", "is this ready" | Read, render, measure, report. **It changes no files.** |
| **Audit and fix** | "audit and fix", "find and fix", "improve", or an explicit yes to an offer | Everything above, then the approved fixes, then verification |

State the mode in the first line of the reply. An audit-only request never
becomes a redesign because the findings were bad. Where fixing is the obvious
next step, finish the report and offer it.

## 1. Measure the render

Open the running product in a browser and measure it at 1440, 1024 and 375.
[references/playwright.md](../product-experience-engineering/references/playwright.md)
has the mechanics.

Pass the whole contents of
`.claude/skills/product-experience-engineering/scripts/measure.js` as the
`function` argument of `browser_evaluate`, once per width. It returns
overflow, text contrast, target sizes, controls with no accessible name,
heading order, unsized media and text below 12px. It also returns a census of
the type sizes, radii, shadows and font families the page really uses.

Then look at the screenshots yourself, at every width. The script cannot see
hierarchy, rhythm, crowding, visual weight or whether the page is any good.
The installed `inspect` skill covers that look and its seven checks; use it.

Every number the script returns is a candidate. Confirm it on the render,
decide whether it harms a customer, and fold one cause into one finding.

## 2. Walk it as the customer

Run `journey-walk` on the main journey before sweeping categories. Only the
walk finds dead ends, controls that relabel without acting, and a flow that
exists only for the happy path. Skip it for a single static element.

## 3. Sort every finding into its kind

The kinds matter because they go to different people and cost different
amounts to fix. Give each finding exactly one.

1. **Product and information architecture** — the screen solves the wrong
   problem, exposes the system's internals rather than the customer's task,
   or buries what the job needs behind what the database holds.
2. **Journey and usability** — the customer cannot get from the entry point
   to the outcome without confusion, a dead end or a detour.
3. **Visual design** — hierarchy, rhythm, density, type, colour,
   distinctiveness. Nothing dominates; twelve equal tiles; a page that could
   belong to any other product.
4. **Interaction and state** — missing empty, loading, error or recovery
   state; feedback that lies; a control with no response.
5. **Accessibility** — contrast, naming, keyboard operability, focus, status
   carried by colour alone, heading structure.
6. **Implementation** — the code behind one of the above: a hard-coded
   palette, a fixture that hides the dense case, a layout that cannot hold
   long content.

## 4. Severity, by harm to the customer

Never by how easy the fix is.

| Severity | Meaning |
|---|---|
| **Blocker** | Stops a core task, loses data, misleads: the primary action unreachable, a keyboard trap, a chart or figure that misstates the data, a success message for a failure |
| **Critical** | Major harm on a common path: body or action text below 4.5:1, horizontal scroll at 375, a missing empty or error state on a primary flow, a control with no accessible name, a placeholder used as the only label |
| **Warning** | Degrades the experience: off-system spacing, values off a shared line, weak hierarchy, duplicated actions, a forgettable public page |
| **Polish** | Refinement: a widow, nested corners, a few pixels of asymmetry |

Torn between two, take the lower and say why. An inflated audit gets ignored.

Prioritise the report by harm first, then by how many customers meet it, then
by how often, then by business consequence. Where two findings share a cause,
the cause is the finding and the occurrences are its evidence.

## 5. What not to flag

- **Deliberate, consistent choices.** A dense 32px control row on a
  pointer-first console, a labelled zoomed axis, an established domain
  convention. Ask about it; do not score it.
- **Wiring a static page cannot have**: a `#` link, a form with no endpoint.
  List those once, unscored, as wiring to confirm. The exception is a result
  that is false — a filter that relabels the view but not the data.
- **House rules that are not standards.** 12px labels and table headers are
  normal in dense data interfaces. Flag reading copy below 16px on a reading
  page; do not invent a floor.
- **Missing dark mode**, unless the product has or promises one.
- **Taste.** Every finding names who it hurts and how.
- **The same cause twice.**

## 6. Finding format

```
C2. Run status shown by colour alone  (.run-row .status, 40 rows)
Found:  status is a coloured dot with no word or shape; green and amber
        measure 2.9:1 against the row background
Why:    a colour-blind dispatcher cannot tell a late run from a running one,
        which is the screen's whole job
Fix:    add the status word beside the dot and give each status its own shape
Evidence: shots/1440-runs.png, measure-1440.json contrastFailures[3]
```

One line each for polish items. Keep `Found` and `Why` to one or two lines.

## 7. The report

```
# Experience audit: <surface>
Mode: audit only | audit and fix
Checked: <widths, states, journeys walked, browser; what stood in for what>
Not checked: <what the environment could not reach>

Top three: <three ids, one line each>

## Blockers / Critical / Warnings / Polish
<findings in the format above, grouped by severity, each with its kind>

## What is sound
<the decisions worth keeping, so a later session does not undo them>

## Questions
<at most three, each with the assumption made meanwhile>
```

Record what is sound. An audit that lists only faults invites a rewrite of
things that were right.

No score out of 100. A number invites arguing about the number instead of
fixing the blocker, and the severity list already carries the order.

## 8. In audit-and-fix mode

1. Get the fix list agreed, or fix only blockers and critical findings and
   say that is what you did.
2. Identify the journeys that already work, before editing. `journey-walk`
   again afterwards.
3. Fix one cause at a time. Re-measure and re-render after each.
4. Run the project's checks for the area changed, then the broader suite once.
   [references/regression.md](../product-experience-engineering/references/regression.md)
   has the rules, including how to tell your failures from the ones that were
   already failing.
5. Report each finding as fixed, left with a reason, or not verified.
