# Source research

Every URL supplied for this work, read on 2026-10-27. Repository facts come
from the GitHub API; page facts come from the page itself; licence facts come
from the licence file or the page that states the licence.

**Verified** means read at the source in this session. **Not stated** means
the pages read did not say, which is different from "no licence". Star counts
are omitted: they measure attention, not fitness.

The nine `t.co` links were followed to their destinations first; the
destinations are named under each entry.

## Verdicts

| Source | Verdict |
|---|---|
| EnchStyle/ui-ux-audit-skill | Adapt — severity model and the measure-before-judging rule |
| andrew-shwetzer/human-experience | Adapt — the journey walk table and its evidence rule |
| coreyhaines31/marketingskills, customer-research | Adapt — evidence bands; refer to the skill for the method |
| Leonxlnx/taste-skill | Reference — the deeper playbook for a public page |
| pbakaus/impeccable | Reference — one idea taken; the engine is not installed here |
| nextlevelbuilder/ui-ux-pro-max-skill | Reference — its numbers already reached us through blueprint |
| shadcn-ui/ui | Integrate — the registry spec, the CLI and the public directory |
| coss.com/ui (cosscom/ui) | Integrate — curated source, with its mixed licence recorded |
| reui.io, kibo-ui, magicui, react-bits, uiarc, 23rd.dev, aceternity | Integrate — curated sources, licence recorded per entry |
| tremorlabs/tremor | Reference — listed with a staleness warning |
| 21st.dev | Reference — a library index; its MCP needs a paid plan |
| component.gallery | Reference — read it to decide what a component should do |
| transitions.dev | Exclude from sources.json — no licence, no price stated |
| rareui.com, originkit.dev, beautifului.dev, libraries.dev orbs | Exclude — no licence, or nothing on the page to act on |
| agentation.com | Exclude — not a component source |

## Design intelligence, visual quality and critique

### pbakaus/impeccable

- **Identity**: `pbakaus/impeccable`, Apache-2.0, default branch `main`,
  last pushed 2026-10-27, 4,422 files, site impeccable.style. Verified.
- **What it is**: a design skill with 24 commands (`shape`, `critique`,
  `audit`, `polish`, `bolder`, `quieter`, `harden`, `animate`, `live`…),
  each with its own reference file, plus a `craft-floor.md` read before any
  UI edit. It splits surfaces into four modes — Persuade, Operate, Read,
  Experience — by what success looks like for the visitor. Verified in
  `.agent/skills/impeccable/SKILL.md`.
- **Install**: `npx impeccable install`, or in Claude Code
  `/plugin marketplace add pbakaus/impeccable`. Verified in the README.
- **Dependency worth knowing**: the skill ships a launcher that runs "a
  self-contained binary that either sits next to the launcher or is
  downloaded once on first run into `~/.impeccable/bin/`" (README, verbatim).
  Its `impeccable context` step is expected once per session.
- **Unique contribution**: the surface-mode idea, and the breadth of its
  command set.
- **Overlap**: large with taste-skill and ui-ux-audit on visual quality; its
  numeric defaults already reached this machine through the blueprint skill,
  which credits it.
- **Verdict**: **reference**. One idea was taken and credited in NOTICE. The
  binary download makes installing it a decision for the user, not for a
  skill to assume, and Apache-2.0 attribution applies if more is taken.

### andrew-shwetzer/human-experience

- **Identity**: `andrew-shwetzer/human-experience`, MIT (LICENSE verified),
  last pushed 2026-03-10, 19 files. Verified.
- **What it is**: `skill.md`, a Playwright capture script (`capture.mjs`) and
  `ux-research.md` of thresholds. It renders a target at three viewports,
  clicks through it, maps CTA destinations, optionally records video and
  tests a signup flow, then scores seven dimensions out of 35 and writes an
  HTML report.
- **Install and dependencies**: no plugin manifest; the skill expects itself
  at `~/.claude/skills/human-experience/` and the capture script at that
  path. `package.json` declares `playwright ^1.58.2` and `"license": "ISC"`
  while the repository's LICENSE is MIT — an inconsistency worth noting.
  Signup testing needs an AgentMail API key, an external paid service. The
  frontmatter pins `model: claude-opus-4-6`.
- **Unique contribution**: the step-by-step walk table, the friction
  inventory by severity, the confidence rating tied to what was actually
  captured, and the self-check that every reported feeling must name its
  cause.
- **Limitations**: its own description claims it "replaces manual user
  testing" and "a 1000-person user testing panel". It does not; it is a
  simulation. The composite score out of 35 invites arguing about the number.
  Last pushed over seven months ago.
- **Verdict**: **adapt**. The walk table and the evidence rule are taken and
  credited; the score, the HTML report, the loop and AgentMail are not. The
  overclaim is contradicted in this skill rather than repeated.

### nextlevelbuilder/ui-ux-pro-max-skill

- **Identity**: `nextlevelbuilder/ui-ux-pro-max-skill`, MIT, last pushed
  2026-10-26, 698 files, site uupm.cc. Verified.
- **What it is**: a Claude Code plugin (`ui-ux-pro-max` 2.15.0) holding seven
  skills: `ui-ux-pro-max`, `design`, `design-system`, `brand`, `ui-styling`,
  `banner-design`, `slides`. Its plugin.json claims a local searchable
  database of 79 styles, 192 palettes, 74 font pairings, 25 charts and 22
  stacks. Verified: the skill paths and plugin.json; the database counts are
  the vendor's claim, not independently counted here.
- **Install**: Claude Code plugin marketplace, `.claude-plugin/`.
- **Unique contribution**: token architecture (primitive, semantic,
  component) and coverage well beyond the web — SwiftUI, Flutter, Compose,
  WPF.
- **Overlap**: its numeric thresholds already reached this machine through
  the blueprint skill's rules.md, which credits it.
- **Verdict**: **reference**. Nothing further taken.

### EnchStyle/ui-ux-audit-skill

- **Identity**: `EnchStyle/ui-ux-audit-skill`, MIT (LICENSE verified), last
  pushed 2026-09-27, 23 files. Verified.
- **What it is**: a skill with three modes (full audit, quick review, build),
  16 category references, five product profiles (marketing, SaaS dashboard,
  analytics report, e-commerce, children's app), and `scripts/uicheck.py`, a
  Python Playwright script that measures the render at 360, 768 and 1280px.
  Severity is Blocker 12, Critical 8, Warning 4, Polish 1, scored out of 100.
- **Install**: copy the `ui-ux-audit` folder to `~/.claude/skills/` or
  `.claude/skills/`; a `.skill` bundle exists for claude.ai. Verified in the
  README. **Dependencies**: Python 3 with Playwright and Chromium.
- **Unique contribution**: the strongest material of everything read here.
  Severity judged by harm rather than effort, an explicit list of what not to
  flag, per-finding defaults, and a deterministic measuring script.
- **Limitations**: the Python Playwright dependency is a second browser stack
  on a machine that already has the Playwright MCP server. The score out of
  100 has the usual problem.
- **Verdict**: **adapt**, and recommend installing it alongside. The severity
  model and the what-not-to-flag discipline are taken and credited; the score
  is dropped; `uicheck.py` is not copied — `scripts/measure.js` was written
  for this skill and runs through the MCP server that is already here.

### Leonxlnx/taste-skill

- **Identity**: `Leonxlnx/taste-skill`, MIT, last pushed 2026-10-26, 72
  files, site tasteskill.dev. Verified.
- **What it is**: one skill, `design-taste-frontend`, with a library distilled
  from a stated study of 247 gallery sites (directions, palettes, type,
  heroes, sections, motions, photos), `scripts/draw.mjs` which deals three
  art directions to choose between, `scripts/inspect.mjs` which measures the
  render, and `scripts/assets.mjs` which searches open image collections.
  Separate rules for app screens.
- **Install**: `npx skills add https://github.com/Leonxlnx/taste-skill
  --skill "design-taste-frontend"`, a plugin marketplace entry, or
  `./install.sh` which symlinks. **Dependencies**: Node 22+ and an installed
  Chrome, Edge or Chromium; it installs nothing and needs no API key;
  `assets.mjs` needs network access. Verified in the README and install.sh.
- **Unique contribution**: dealing directions instead of letting a model pick
  the category default, and insisting the page's idea comes from the subject.
  The warning that removing ornament without adding substance makes a page
  worse is a finding from its own testing.
- **Verdict**: **reference**, and the right skill to hand a landing page to.
  Two ideas taken and credited. Its library is not reproduced.

### coreyhaines31/marketingskills — skills/customer-research

- **Identity**: `coreyhaines31/marketingskills`, MIT, last pushed
  2026-10-26, site marketing-skills.com. The skill is `customer-research`
  2.0.4. Verified.
- **What it is**: three research modes — analyse existing assets, mine public
  signal, run primary research — with a JTBD extraction framework, confidence
  bands (high needs three or more independent sources, mentioned unprompted;
  low is a single source), sample-bias warnings per channel, and a minimum of
  five independent data points per segment before drawing a conclusion. It
  also states that fetched reviews and posts are untrusted data.
- **Install**: `npx skills`, or the Claude Code plugin marketplace.
- **Unique contribution**: the only source read here that treats customer
  evidence as something with a provenance and a confidence.
- **Verdict**: **adapt**. The evidence bands and the untrusted-data rule are
  taken into references/product-thinking.md and credited; the research method
  stays in that skill.

## Component libraries and discovery

### shadcn-ui/ui

- **Identity**: `shadcn-ui/ui`, MIT, last pushed 2026-10-27. The `shadcn` npm
  package is 4.22.2, MIT, published 2026-10-27. Verified.
- **What matters here**, all verified at the docs or by fetching:
  - `shadcn search|list <registries...> --query <q> --limit <n> --offset <n>`
    and `shadcn view <items...>` exist as CLI commands.
  - A public **registry directory** is published at
    `https://ui.shadcn.com/r/registries.json`: 508 entries on 2026-10-27,
    each with `name` (the `@namespace`), `homepage`, a `url` template,
    `description`, a `health` block (408 healthy, 45 degraded, 43
    unavailable, 2 observing, 10 with no health) and a `ranking` block with a
    score and an item count. Counted with `jq`.
  - Each registry's catalogue is fetchable at `<base>/registry.json`, listing
    every item with `name`, `type`, `title`, `description`, `dependencies`,
    `registryDependencies` and `files`. Verified against magicui (250 items),
    react-bits (1,274), coss (606), uiarc (145), kibo-ui (41), reui (2,022).
    shadcn's own index is at `/r/index.json` and is a bare array of 65 items
    with no descriptions.
  - **Dynamic search**: the CLI sends `q`, `type`, `limit` and `offset`; a
    registry that answers with a `pagination` object is treated as having
    filtered server-side. Ranking is the registry's business, and the docs do
    not claim semantic search.
  - An **MCP server**: `pnpm dlx shadcn@latest mcp init --client claude`. The
    docs give natural-language examples such as "Find me a login form from
    the shadcn registry".
  - Namespaced registries are configured in `components.json` under
    `registries`, with `${VAR}` expansion for private tokens.
- **Verdict**: **integrate**, and build discovery on the directory and the
  catalogues, because they are free, scriptable and need no account. The MCP
  server is supported but not required.

### 21st.dev — the community libraries page

- **Identity**: 21st.dev, operator not stated on the pages read.
- **What it is**: an index of **167 component libraries** plus 10 icon
  families, listed by name on `/community/libraries`. Verified by reading the
  page.
- **Cost**: Free (Hobby) is "2 free copies / day" and 5 Design Bug Bot
  reviews. Builder is $6/month billed yearly or $8/month quarterly and
  includes "unlimited MCP component retrieval"; the free tier is not listed
  for MCP. Builder + AI adds credits from $15/month. Team is from $7.50 per
  seat per month. Verified on `/pricing`.
- **Licence**: no component licence is stated on either page.
- **Overlap**: most of the libraries it indexes are also in the shadcn
  directory, which is free and scriptable.
- **Verdict**: **reference**, recorded in sources.json under `screens` as a
  library index. Search the free directory first.

### 23rd.dev

- **Identity**: 23rd.dev, "Opinionated UI components for shippers", linked to
  `github.com/radiumcoders/23rd.dev`; the page does not name an operator.
- **What it is**: shaders, gradients, orbs and typographic effects for React,
  added with the shadcn CLI. In the shadcn directory as `@23rd`, healthy, 20
  items. Verified.
- **Licence**: not stated on the home page.
- **Verdict**: **integrate** as a curated source for a public page, with the
  unstated licence recorded. No MCP or API is advertised.

### DavidHDev/react-bits

- **Identity**: `DavidHDev/react-bits`, licence reported by GitHub as
  NOASSERTION; `LICENSE.md` is "MIT + Commons Clause License Condition v1.0".
  Last pushed 2026-10-19. Verified by reading LICENSE.md.
- **The clause, verbatim in part**: "You may use this Software, including for
  any commercial purpose, so long as you do not sell, sublicense, or
  redistribute the components themselves". The same restriction covers its
  tools, sounds and exports, and offering them as a hosted service.
- **In the directory**: `@react-bits`, healthy, 1,274 items, the largest
  catalogue of the sources read here.
- **Verdict**: **integrate**, with the clause recorded in sources.json. It is
  fine inside a product and rules itself out of anything resold as
  components, a template pack included.

### magicuidesign/magicui

- **Identity**: `magicuidesign/magicui`, MIT (repository licence verified),
  last pushed 2026-10-17.
- **Install**: `pnpm dlx shadcn@latest add @magicui/<name>`, the same process
  as shadcn/ui. In the directory as `@magicui`, healthy, 250 items, of which
  170 are `registry:example` demos. Verified.
- **Cost**: the components are free; Magic UI Pro is a separate paid product
  at $199 once. The installation page does not state the component licence,
  so the repository licence is the one of record.
- **Verdict**: **integrate**, for public pages rather than consoles.

### coss.com/ui

- **Identity**: `cosscom/ui`, described on the site as "the official design
  system of Cal.com", built on Base UI. Last pushed 2026-10-25. Verified.
- **Licence, and a correction**: the repository default is **AGPL-3.0**, but
  `LICENSING.md` states that `apps/origin/` and `apps/ui/` are licensed under
  their original licence, and `apps/origin/LICENSE.md` is MIT, "Originally
  Copyright (c) 2025 Origin UI". So the UI packages are MIT and Origin UI
  lives on inside this repository. Verified by reading both files.
  This **supersedes** the line in the blueprint skill's sources-read.md that
  rejected coss.com/ui because "the UI package states no licence"; that was
  read on 2026-10-17 and the file now says otherwise.
- **In the directory**: `@coss`, healthy, 606 items.
- **Verdict**: **integrate**, with the mixed licence recorded, and check
  which directory a component comes from before shipping it.

### tremorlabs/tremor

- **Identity**: `tremorlabs/tremor`, Apache-2.0, last pushed **2025-10-10**.
  `@tremor/react` is 3.18.7 on npm, Apache 2.0, last modified **2025-01-13**,
  not deprecated. Verified against the GitHub API and the npm registry.
- **What it is**: 35+ React components for charts and dashboards on Tailwind
  and Radix. Not in the shadcn registry directory, so it cannot be searched
  with the rest.
- **Verdict**: **reference**, listed in sources.json with the staleness
  recorded and a note to prefer `@reui` charts or Recharts for new work.

## The nine shortened links

Each was followed with `curl -I -L` to its final destination and the
destination was then read.

| Short link | Destination | Verdict |
|---|---|---|
| t.co/3ZNz5Rj3rd | rareui.com | Exclude |
| t.co/PAj2XcPYIF | uiarc.dev | Integrate |
| t.co/iYyKVCQWE5 | orbs.jakubantalik.com → libraries.dev/orbs | Exclude |
| t.co/reBVrC6Lhr | originkit.dev | Exclude |
| t.co/xrq0nyk7IK | transitions.dev | Exclude from sources; its motion check may still be useful |
| t.co/qKBCMczxgC | beautifului.dev | Exclude |
| t.co/xHQ2IRmVAf | ui.aceternity.com | Integrate |
| t.co/DdA3oBeScp | agentation.com | Exclude: not a component source |
| t.co/A0C17jwDbs | component.gallery | Reference |

### uiarc.dev (Arc)

"The React UI library your AI agents can build with": 188 components and 113
blocks, of which 120 components and 22 blocks are free with no account. Arc
Pro is **$249 once**. It ships an `llms.txt`, Markdown per component, and an
MCP server added with
`claude mcp add --transport http arc https://uiarc.dev/api/mcp`. Install is
`npx shadcn@latest add @uiarc/button`. In the directory as `@uiarc`, healthy,
145 items. The licence is not stated on the pages read; there is a separate
licence page that was not opened. **Integrate**, licence recorded as not read.

### ui.aceternity.com

Free tier is "100+ free components" with MCP access; paid tiers are $169 for
a year, $199 lifetime and $1,590 for ten seats, all one-time payments. No
licence terms on the pricing page. In the directory as `@aceternity`, **health
"degraded"** on 2026-10-27, 310 items. **Integrate**, with both the unstated
licence and the degraded health recorded.

### component.gallery

"An up-to-date repository of interface components" by Iain Bean: **60
components, 95 design systems, 2,671 examples**, searchable with Pagefind. No
API and no MCP. It shows how real design systems build each component and
what they call it. **Reference** — the right place to settle what a component
should do before searching for code.

### rareui.com

"A free, open-source collection of rare animated React components", 27+
components, installed with `npx shadcn@latest
add swamimalode07/rare-ui/fluid-orb` or over MCP. No licence is named; "open
source" is not a licence. Not in the shadcn registry directory. **Exclude**
until a licence is stated. (The blueprint skill recorded this site as
returning HTTP 429 on 2026-10-17; it answered normally today.)

### libraries.dev — Thinking orbs

`orbs.jakubantalik.com` is now a relocation notice pointing at
`libraries.dev/orbs`, "High-crafted UI libraries for AI agents" by Jakub
Antalik. Thinking orbs are loading indicators for AI interfaces with nine
animated states, no runtime dependencies, React 18+, installed with
`npm install thinking-orbs`. No licence is stated. The site has a "Skill" page
that was not read. **Exclude** from sources.json; worth a second look if a
product needs exactly that component and the licence is published.

### originkit.dev

The page carries one line: "Free Animated component library for modern
websites". No components, licence, install method or pricing. **Exclude** —
there is nothing to act on. Recorded rather than guessed at.

### transitions.dev

"UI transitions for AI agents": a library of 43+ transitions, a builder, a
"Motion Agent" run as `npx transitions-agent` which the page describes as
"Local and deterministic: no AI, no account" and which returns a motion score
and can gate a pull request, and a "Motion Skill" that teaches a coding agent
the transitions. Some transitions are "Pro only"; no prices and no licence are
stated. **Exclude** from sources.json. The motion check may be worth running
on its own merits, as a separate decision by the user.

### beautifului.dev

"Crafted primitives for AI-native interfaces": 21 components for agent
products — loading states, streaming text, approval cards, diff tables. The
footer links to an MIT licence page, which was not opened. No install route
and no registry entry. By Turbo, a design studio. **Exclude** from
sources.json; copy a component by hand if one fits.

### agentation.com

Not a component source. A dev dependency (`npm install agentation -D`) whose
toolbar turns clicks on your own UI into structured context — selectors,
source paths, component trees, computed styles — for an agent to act on, with
an optional MCP integration, webhooks and an API. "Free for individuals and
companies for internal use"; commercial redistribution needs a licence.
Desktop only. **Exclude** from sources.json, and worth knowing about for a
different problem: getting a human's pointing finger into an agent's context.

## A second round: the craft layer

Read on 2026-10-27, after the first build was judged competent but not
memorable. The route in was `https://www.skill-issue.in/?domain=design`, a
ranked catalogue of agent skills supplied by the user. The catalogue is an index, not a source. It lists names, one-line
descriptions, and install or star counts. For at least one entry it states
that the link is "Unverified link — not individually opened and checked by
hand". Its repository links were extracted from the page. Each skill below
was then read at its own repository.

**What the first build was missing.** The skill had teeth for defects —
measure, severity, evidence — and none for craft. It could prove a screen was
not wrong. It could not stop the screen being forgettable. The two sources
below are the ones that close that, and both are about the layer under
layout: depth, motion, optical correctness.

### jakubkrehel/make-interfaces-feel-better

- **Identity**: MIT, last pushed 2026-08-29, 12 files. Verified.
- **What it is**: one skill and five references, covering typography,
  surfaces, animations, icons and performance. It holds 19 numbered
  principles with exact values, a common-mistakes table, and a review format
  with severity, Before and After columns, and a verdict.
- **Unique contribution**: the specific numbers almost nobody writes down.
  `outer = inner + padding` for nested radii. A three-layer shadow in oklch
  standing in for a border. The rule that its colour is pure black and never
  a tinted near-black, "because a tinted outline picks up the surface colour
  underneath it and reads as dirt on the image edge". `scale(0.96)` on press,
  and never below `0.95`. Icon stroke matched to the weight of the text
  beside it. Hit areas extended past the visible control, and never
  overlapping.
- **Its best instruction** is a review method, not a value. Replay motion at
  10% speed and walk every state. "What feels off at 10% speed is what's
  subtly wrong at full speed."

- **Verdict**: **adapt**. Reduced to `references/craft.md` in our own words
  and credited in NOTICE. Its five reference files and its review format are
  not reproduced.

### emilkowalski/skills

- **Identity**: MIT, last pushed 2026-10-11, ~24 skills including `animate`,
  `improve-animations`, `animation-performance`, `apple-design`, `break-ui`
  and `emil-design-eng`. Verified.
- **What it is**: Emil Kowalski's design-engineering philosophy, encoded. The
  skill read here is `emil-design-eng`.
- **Unique contribution**: the reasoning behind motion values rather than the
  values alone. Why `ease-in` is wrong for interface motion — "it starts
  slow, which makes the interface feel sluggish… the exact moment the user is
  watching most closely". Duration bands per interaction: 100–160ms for press
  feedback, 150–250ms for a dropdown, under 300ms for everything. Why nothing
  animates from `scale(0)`: "nothing in the real world appears from nothing".
  Transitions for interruptible state against keyframes for sequences.
- **Verdict**: **adapt**. The motion section of `references/craft.md` comes
  from it, credited in NOTICE. None of its recipes or component guidance is
  reused.

### Read and not adopted, from the same catalogue

- `anthropics/skills/skills/frontend-design` — Anthropic's own, the highest
  install count in the design domain. Not read in full this round; recorded
  as a gap rather than summarised from the catalogue's one-line description.
- `nutlope/hallmark` (MIT), `vercel-labs/agent-skills/skills/web-design-guidelines`,
  `Appllama/appllama-skills`, `Owl-Listener/designer-skills` — located and
  their licences checked, contents not read. Recorded as unread, not judged.

**Honesty note on this round**: four of the twenty entries in the catalogue's
design domain were opened. The rest are named above or not at all. A verdict
is given only where the source itself was read.

## What could not be verified

- Licence pages for uiarc.dev, aceternity, beautifului.dev and 23rd.dev were
  not opened; sources.json records them as not read rather than as absent.
- The vendor counts in ui-ux-pro-max's plugin.json (79 styles, 192 palettes…)
  and taste-skill's study of 247 sites are the vendors' claims. Neither was
  counted here.
- `pnpm dlx shadcn@latest --help` could not be run in this session, so the
  CLI's command list comes from the vendor's documentation rather than from
  the binary. The registry directory and the catalogues, which the discovery
  script actually uses, were fetched and parsed directly.
- No component was installed into a project during this research.
