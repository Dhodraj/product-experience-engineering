# Testing report

Run on 2026-10-27, macOS arm64, Node v24.22.1, Playwright MCP 0.0.83 with
Chromium. Every number below came from a command or a browser in this session.
Where something was not executed, it says so.

## The automated suite

```
.claude/skills/product-experience-engineering/tests/run.sh             36 passed, 0 failed
.claude/skills/product-experience-engineering/tests/run.sh --network   39 passed, 0 failed
```

The network run also fetched every url in `sources.json` and every one
answered, and ran a live search against the curated registries.

`node scripts/check-sources.js` reports: `sources.json: 16 sources
(9 searchable), 6 rejected, no problems`.

Two defects were found by the suite and fixed while writing it: `grep`
treating a pattern starting with a dash as an option, and the search script
deriving a registry's catalogue url without resolving a `{style}` segment,
which made `@reui` unsearchable.

## Scenario B — an existing bad dashboard

**Input**: `tests/fixtures/dashboard-before.html`, a plausible machine-built
freight dispatch dashboard, served at `http://127.0.0.1:8731` because the
Playwright MCP server blocks `file:` urls.

**Process**: measured with `scripts/measure.js` through `browser_evaluate` at
1440 and 375, screenshots at both widths, then both images were opened and
read.

**Measured, before:**

| | 1440 | 375 |
|---|---|---|
| Text below its contrast floor | 37 | 37 |
| Targets below 24 × 24 | 3 of 10 flagged | same |
| Controls with no accessible name | 3 | 3 |
| Placeholder as the only label | 1 | 1 |
| Heading skips | 1 (h1 → h3) | 1 |
| Media with no reserved space / no alt | 1 / 1 | 1 / 1 |
| Text below 12px | 13 | 13 |
| Distinct type sizes / radii / shadows | 10 / 8 / 2 | same |
| Page scrolls sideways | no | **yes, 780px in a 375px viewport** |

The worst contrast was `p.sub` at **2.44:1** where 4.5 is required, and the
tile labels at **2.64:1**. The overflow traced to `table { min-width: 760px }`.

**Found by looking, which the script cannot see**: twelve equal tiles with
nothing dominant, so the screen does not say what to do first; run status
carried by a coloured dot alone; two identical blue buttons side by side,
"Create run" and "New run"; a grey placeholder image carrying nothing; and
"Updated a while ago" where a dispatcher needs a time.

**Fixed**, in `tests/fixtures/dashboard-after.html`: status became a word
plus its own shape, the table became one block per run below 760px, the greys
were darkened, the two header controls and every row control were named and
grown past 24px, the search field got a real label, the twelve tiles became
one dominant figure — 38 runs are late — plus six quiet ones, the duplicate
button went, the heading skip was closed, the type scale went from ten sizes
to four, and the decorative image was removed rather than given alt text it
did not deserve.

**Measured, after:** contrast failures **37 → 0**; targets below 24 × 24
**3 → 0**; unnamed controls **3 → 0**; placeholder-only fields **1 → 0**;
heading skips **1 → 0**; unsized media and images with no alt **1 → 0**; text
below 12px **13 → 0**; type sizes **10 → 4**; radii **8 → 3**; shadows
**2 → 0**; and at 375 the document width went **780 → 375**, so the page no
longer scrolls sideways.

Nine controls remain between 36 and 40px tall, below the 44px comfortable
target and above the 24px WCAG 2.5.8 floor. The skill's own rules say not to
flag a target that passes on a pointer-first console, so they are reported
and not treated as findings.

**Evidence**: `.pxe-audit/before/` and `.pxe-audit/after/`, each holding the
measurement JSON and the screenshots.

## Scenario E — a regression-sensitive change

Run as part of scenario B, because that is where regressions happen.

The before fixture had ten interactive controls; the after fixture has nine.
The one that went is the duplicate "New run" button, removed deliberately and
named here. Every other control survived, and the test suite asserts it: each
of the five runs is checked by id for its own row control, by name
(`Actions for run RUN-2026-10-27-000418-GLA` and the rest). The 375px
screenshot was then read to confirm every row control is on screen and
reachable without horizontal scrolling.

A second regression appeared during scenario D and is recorded there,
including the fact that the first fix caused it.

## Scenario D — a landing page and its conversion journey

**Input**: a brief for a freight dispatch product, written into
`tests/fixtures/landing.html`. The page's idea comes from the subject — the
run sheet the dispatcher already keeps — rather than from the SaaS category,
and the page's one large figure is a real sheet rather than a stock
illustration. Every run, depot and figure on it is sample content, and the
footer says so. No customer, logo, quotation or statistic appears, because
there are none.

**The journey, walked at 375 × 812 with real clicks and typing:**

| Step | What happened |
|---|---|
| Hero "Start a 14-day trial" | Moved to the trial form |
| Submit empty | Rejected. Two messages beside their own fields, `aria-invalid="true"`, `aria-describedby` extended to the error, focus moved to the first bad field |
| Submit `dispatch@yourdepot` | Rejected with "That address is missing an @ or a domain", and an example |
| Submit a valid address and depot | Success state shown, form hidden, focus moved to the result, which names the depot and the address and says nothing is charged |

Console messages during the walk: **0 errors, 0 warnings**.

**Measured at 1440**: 0 contrast failures, 0 unnamed controls, 0 placeholder-
only fields, 0 heading skips, one h1, five type sizes, one radius value, no
shadows.

**Three findings on my own page, and what happened to each:**

1. The three header links measured **23px tall**, below the 24px WCAG 2.5.8
   floor. Fixed with padding rather than a larger font; re-measured at 32px,
   and nothing is below the floor.
2. The look — not the measurement — found the right half of the first screen
   empty while the words sat in the left half. The sheet was moved beside the
   words at 900px and above. The first attempt made it worse in two ways a
   measurement cannot see: the grid stretched the rows apart, and the sheet's
   columns squeezed until "14:20" wrapped to "14:2 / 0". The screenshot
   caught both; the second attempt fixed them.
3. That second attempt introduced `white-space: nowrap` on two columns, which
   pushed the page to **444px in a 375px viewport**. Scoping the rule to
   desktop brought it to 413px — still scrolling, which showed the overflow
   was partly pre-existing and not only my own doing. The sheet now becomes
   one block per run below 760px, as the dashboard does, and the document
   width at 375 is **375**. The whole conversion journey was then walked
   again at 375 and still completes.

This is the clearest result in the report: a measurement said one thing, the
picture said another, a fix caused a new fault, and only re-running both
checks found it.

**Evidence**: `.pxe-audit/landing/`.

## Scenario C — natural-language component discovery

**Input**, verbatim from the brief: "a modern workflow execution timeline with
running, failed, retrying, and completed states, expandable logs, and links to
job details."

**Translated** to requirements and then to catalogue words: an ordered list of
events with per-event detail; states running, failed, retrying, completed and
empty; expand and collapse, keyboard reachable, a link out of each row. The
catalogue words are `timeline`, `stepper`, `activity`, not "workflow
execution timeline".

```
node scripts/find-components.js timeline stepper activity --limit 10 --registries 16
```

Searched 24 registries and returned 10 candidates in about two seconds, each
with its dependencies, file count, licence as recorded, and the exact command
to read it.

**Two candidates were then read, not guessed at**, by fetching their registry
items:

| | `@uiarc/timeline` | `@reui/timeline` |
|---|---|---|
| Shape | an event log grouped by day | a stepper with an `activeStep` |
| Expandable detail | yes: `aria-expanded`, `aria-controls`, a `detail` slot per row | no |
| Status | a `tone` per event, with a comment in the source saying "Always say the outcome in the title too, so it never rests on color" | none |
| Keyboard | `onKeyDown` on the list, `role="region"` with a label | not present |
| Motion | `motion`, honouring `useReducedMotion` | none |
| Dependencies | `lucide-react`, `motion`, plus a motion-tokens item | `@base-ui/react`, `cn` |
| Size | 18.6 KB in one file, plus a CSS module | one file |
| Licence | **not stated** on the pages read | **MIT**, verified at the repository |

**Recommendation produced**: `@uiarc/timeline` fits the request — it is the
only candidate that already does expandable per-row detail and status that is
not colour alone — but its licence is not stated anywhere that was read, which
is a blocker under the ranking rules, and it is the user's decision. The
runner-up is to compose one from `@shadcn` primitives, because `@reui/timeline`
is a stepper and would have to be rewritten to become an event log.

Nothing was installed. The skill requires asking before a first install from
a new source, and that question was not raised with the user in this session.

## Scenario A — a new SaaS dashboard

**Partly executed, and reported as such.** The build artefact exists —
`dashboard-after.html` is a dashboard with a stated customer outcome, a
dominant figure, a real scale and a phone layout, verified in a browser — but
it was produced by fixing the before fixture under scenarios B and E, not by
running stages A to C from a fresh brief with a user to approve the proposal.

What was therefore **not** exercised: the approval gate at stage C, the
blueprint hand-off for a screen proposal, component installation into a real
project, and a build on a real stack with a dev server. These remain
unverified.

## Scenario A, second attempt — a dispatch console and its public page

Run after the first build was judged "fine, not great". The first attempt is
recorded above as partly executed; this one starts from a direction rather
than from repairing a bad fixture.

**Direction, decided before any markup.** First an inventory of the subject:
run sheets, depot clocks, planned against actual times, kraft and signal
amber. From that: ink on warm paper, one accent, and display numerals
carrying the hierarchy. The signature element on both surfaces is the
product's own output, the planned window drawn against where the run has got
to. Rejected by name: a dark theme as the default, and the grid of equal
cards.

**Built**: `demo/console.html` and `demo/landing.html`, one visual system
across both. Two earlier states are kept beside them, so the difference can
be looked at rather than described. `demo/console-plain.html` is the console
before the craft pass. `demo/console-light.html` is the craft pass before the
dark band.

### What the measurement found, and what only the look found

The split is the whole result. Across both pages the script returned clean
numbers at every stage, including on the stages where the screen was wrong.

| # | Fault | Found by |
|---|---|---|
| 1 | Planned window and empty track the same grey, so the figure's entire point was invisible | the look |
| 2 | Right half of the first screen empty while the words sat left | the look |
| 3 | The fix for 2 stretched the grid rows apart and squeezed the sheet until `14:20` wrapped to `14:2 / 0` | the look, on the re-render |
| 4 | `.row` had five children in a four-column grid, so the slip figure wrapped below | the look |
| 5 | `white-space: nowrap` added in the fix for 3 pushed the page to 444px in a 375px viewport | the measurement |
| 6 | After scoping that rule to desktop, still 413px — so the overflow was partly pre-existing, not only the new fix | the measurement |
| 7 | Three header links at 23px, below the 24px WCAG 2.5.8 floor | the measurement |

Four of seven were invisible to the script. Two of seven were caused by an
earlier fix. That is the case for doing both, and for re-running both after
every change.

### The craft pass

Applied from `references/craft.md`, written in the same session from
`jakubkrehel/make-interfaces-feel-better` and `emilkowalski/skills`.

| Before | After |
|---|---|
| `1px solid` border on cards and buttons | three-layer `box-shadow` in oklch: 1px ring, short lift, ambient |
| one `--r: 6px` everywhere | `--r-panel: 12px` / `--r-row: 8px`, concentric |
| display figure at 88px on paper | 156px on one dark band |
| no motion | staged enter, 100ms per region, `opacity + translateY(10px) + blur(4px)`, 460ms ease-out |
| static route bars | `scaleX` draw-in from `transform-origin: left`, staggered 80ms |
| static count | counts up once over 900ms, ease-out cubic, tabular figures |
| row hover tints the row | row hover also lifts that run's route line onto its own surface |
| no `:active` | `scale(.96)` |

The last one is the only move in the list that is not polish. A row and a
route line are the same run, and pointing at either marks both. It costs nine
lines of JavaScript, it is keyboard-reachable through `focusin`, and the
link is carried by lift and weight rather than colour alone.

### Measured after the craft pass

Both pages, 1440 and 375, through `browser_evaluate`:

| | console | landing |
|---|---|---|
| Contrast failures | **0** | **0** |
| Text that could not be measured | 0 | 0 |
| Targets below 24 × 24 | **0** | **0** |
| Controls with no accessible name | **0** | **0** |
| Heading skips | 0 | 0 |
| Type sizes / radii / shadow values | 6 / 3 / 1 | 7 / 4 / 0 |
| Document width at 375 | **375** | **375** |

The contrast result is the one worth naming. It holds on the dark bands too,
where a light-surface palette goes dim. The slip figures had to be re-picked
for the band: `#f06a76`, `#f58a4b`, `#6fc99a`. The first version inherited
the paper colours. It failed by eye before it failed by measurement.

`prefers-reduced-motion: reduce` was emulated in the browser with
`browser_emulate_media` and both pages were re-read under it. Every animated element reports `animation-duration: 0.001s`,
`animation-delay: 0s`, `transition-duration: 0.001s` and `opacity: 1`, and
none has zero width. The reduced path shortens motion without leaving
anything invisible, which is how this rule is usually got wrong. The
console's count-up skips to its final value rather than animating. On the
landing page all 4 scroll reveals are marked seen on load, so nothing waits
for a scroll that will not come. All 10 headline words are present and
visible.

### Journeys walked, after all of it

- Landing, 375 × 812, with real clicks and typing. The hero action reaches
  the form. An empty submit is rejected, with a message beside each field,
  `aria-invalid` set, `aria-describedby` extended to the error, and focus
  moved to the first bad field. `dispatch@yourdepot` is rejected with an
  example. A valid submit reaches a success state that names the depot and
  says nothing is charged. Console: **0 errors, 0 warnings**.
- The landing page's live element, driven at 07:00, 11:00, 16:00 and 20:00.
  The headline count reads "every run will make its window", then "1 run will
  miss its window", then "2 runs will miss their window". Each row's standing
  and slip change with it.
- Console filters at 1440 and 375; the row-to-line link under both hover and
  keyboard focus.

### Still not done on these two pages

- The console's empty state exists in the markup and no filter in the sample
  data empties the list, so **it was never rendered**.
- No screen reader was used. Names and aria wiring were read from the DOM.
- Both are static files with sample data. No dev server, no sign-in, no real
  rows.

## What was not verified at all

- **`pnpm dlx shadcn@latest` was never run.** The sandbox declined to execute
  it. Every shadcn CLI command in the skill therefore comes from the vendor's
  documentation, not from the binary. The discovery script does not need the
  CLI: it fetches the public directory and the catalogues directly, and that
  path was exercised end to end.
- **No component was installed** into any project, so the integrate-and-test
  half of `component-find` step 6 is untested.
- **No real application** was driven: both fixtures are static pages. Starting
  a project's own dev server, signing in, and seeding data are all documented
  in `references/playwright.md` and none of them was performed here.
- **`measure.js` was not tested against a page with a background image or a
  gradient behind text.** Its `contrastUnmeasured` path returned zero on both
  fixtures, so that branch is unproven.
- **No screen reader was used.** Accessible names and aria wiring were read
  from the DOM, which is not the same as hearing what is announced.
- **The companion skills were not invoked by name through the Skill tool.**
  Their instructions were followed by hand in this session, which tests the
  content and not the routing.
- **`references/craft.md` is unenforced.** The demo was built to it by hand.
  Nothing checks that a later session reads it, and an agent that skips it
  produces `console-plain.html`, which passes every automated check.
- **Simulation is not research.** Everything above is a walk by an agent. It
  found friction. It says nothing about what customers do.
