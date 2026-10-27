# ADR 0001 — One orchestrator, three companions, two scripts

Date: 2026-10-27
Status: accepted

## Context

The brief asks for a skill that makes an agent think like a business owner, a
product manager, a customer, a designer, a critic, a frontend engineer and a
QA engineer, rather than like someone implementing a ticket. Twenty-two
sources were supplied to draw on; the reading is in
[source-research.md](source-research.md).

Two facts about this machine shaped the design more than anything in the
brief.

1. **Two of the jobs are already done here.** The `blueprint` skill plans a
   screen and carries the numeric defaults in its `rules.md`; the `inspect`
   skill renders a screen at three widths and reads the images against seven
   named checks. Both are the user's own work. A new skill that restated
   either would create a second source of truth for the same numbers.
2. **A browser is already connected.** The Playwright MCP server answers
   here, with Chromium installed. Anything that needs a second browser stack —
   Python Playwright, a downloaded binary — is a dependency this machine does
   not need.

The gaps the existing skills leave are: deciding what the customer needs
before the first file; finding a component that already exists instead of
writing one; using the running product as a customer rather than looking at
it; auditing something that already exists with a severity order; and not
breaking what worked.

## Decision

One entry-point skill, `product-experience-engineering`, with twelve stages
that scale to the size of the change, and three companion skills that are
worth invoking on their own:

| Skill | Why it is separate |
|---|---|
| `product-experience-engineering` | The entry point and the order of work |
| `component-find` | "Find me a component for X" is a request on its own, often with no build attached |
| `journey-walk` | "Does signup work?" is a request on its own, and is the verification step for every other skill |
| `experience-audit` | "Audit this" must not start editing; a separate skill makes the two modes explicit |

Everything else is a reference document under the entry point, loaded when
the stage needs it: product thinking, visual direction, craft, the journey
and its states, browser mechanics, regression checks.

`references/craft.md` was added after the first build. The skill as first
written could prove a screen was not wrong. It could not stop the screen
being forgettable, which is a different failure, and the one the brief cares
about. The file is loaded at stage G before every UI edit, including a small
one. Craft is applied while the code is written; it cannot be added at review
time.

Two scripts, because both do something no instruction can do reliably:

- `scripts/find-components.js` searches the public shadcn registry directory
  and each registry's catalogue, and prints candidates with the exact command
  to read each one.
- `scripts/measure.js` measures a rendered page in the browser and returns
  numbers.

Plus `scripts/check-sources.js` and `tests/run.sh`, following the shape the
`blueprint` skill already uses on this machine.

## Why not the alternatives

| Alternative | Why not |
|---|---|
| One large skill | The brief's twelve stages, the component rules, the browser mechanics and the audit model come to several thousand words. Loading all of it to change a label is waste, and a skill nobody can read is a skill nobody follows |
| A skill per stage, ten or more | Most stages are never invoked alone. A stage that is only ever reached through the workflow is a reference document, not a skill |
| Vendor ui-ux-audit's `uicheck.py` | MIT allows it, and it is the best measuring script read in this research. But it needs Python Playwright, a second browser stack beside the MCP server that is already connected. `measure.js` runs through what is here. The severity model from that skill is adapted and credited instead |
| Copy blueprint's `rules.md` numbers in | Two copies of a number drift. This skill points at that file and states a floor only for the case where it is not installed |
| Build discovery on the 21st.dev MCP | Its component retrieval starts at a paid plan, and the free tier is two copies a day. The shadcn directory is free, scriptable and covers 508 registries including most of what 21st indexes |
| Require the shadcn MCP server | It is supported and useful, but a skill that only works with an MCP server configured does not work on a fresh machine. The script needs only Node and the network, and `--curated-only` keeps it useful with neither |
| Install impeccable or taste-skill as dependencies | Both are good, and both are the user's decision: impeccable downloads a binary on first run, and taste-skill is a large asset library. They are referenced where they are the better tool |
| Put the craft values in `visual-direction.md` | That file answers "what should this look like"; craft answers "how is it built so it feels right". They are read at different stages — E for the direction, G for every edit — so they are separate files |
| A craft linter instead of a reference | Most of it cannot be measured. A shadow standing in for a border, an entrance on a repeated interaction, an optical mis-centre: each needs the judgement of someone looking. `measure.js` already takes the parts that are numbers |

## Consequences

**Good**

- Nothing is duplicated: the numbers stay in `blueprint`, the look stays in
  `inspect`, the research method stays in `customer-research`.
- The core — product thinking, journey mapping, visual direction, the audit —
  works with no network and no registry: only `component-find` needs either.
- Component discovery is deterministic and free, and its output names its own
  limits.
- Adding a component source is one object in `sources.json`, validated by a
  script and a test.

**Bad, and accepted**

- Referring to `blueprint`, `inspect`, `taste-skill` and `customer-research`
  means a machine without them gets less. Each reference says what to do
  instead, but the fallback is thinner than the real thing.
- `measure.js` has to be passed to `browser_evaluate` as a string, which
  costs tokens on the first measurement of each page. It leaves itself on the
  page as `window.pxeMeasure` so the later widths cost one line, but a page
  reload means pasting it again.
- `measure.js` measures less than `uicheck.py` does. It does not check
  card-row alignment, baselines, gutters, concentric corners or padding
  asymmetry. Those are left to the look, and to that skill where it is
  installed.
- Nothing enforces `craft.md`. It is read at stage G and then relied on. The
  demo in `demo/` was built to it by hand, and the difference is visible
  against `demo/console-plain.html`. An agent that skips the file produces
  the plain version and still passes every automated check.
- Nothing forces a distinctive direction either. `visual-direction.md` bans
  the default look and names the values to decide. It does not make the agent
  produce three options and choose among them, which is how `taste-skill`
  solves the same problem. This is the largest known gap.
- Four skills mean four descriptions competing to be matched. The
  descriptions were written to be disjoint, but overlap is possible.

## What would change this decision

- If the Playwright MCP server stopped being available by default, the
  browser route would have to be reconsidered and `uicheck.py`, or something
  like it, would earn its dependency.
- If a free registry index with real semantic search appeared, step 3 of
  `component-find` would change.
- If `blueprint` and `inspect` were removed from this machine, the floor
  stated in `references/visual-direction.md` would have to become the full
  set of numbers.
