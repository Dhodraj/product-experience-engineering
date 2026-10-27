---
name: component-find
description: "Find a component that already exists instead of writing a new one. Use when the user describes a UI need in words (\"a workflow timeline with running, failed and retrying states and expandable logs\"), asks what component to use, asks for alternatives to one, or asks whether something is already in the project. Searches the project first, then 500+ shadcn-spec registries, reads the candidates' real code and dependencies, ranks them against the project's stack and licence needs, and returns exact names and links."
---

# Component find

A described component is not a component to invent. Most of what gets
described already exists, with its states, its keyboard handling and its edge
cases worked out by someone who shipped it.

## 1. Turn the words into requirements

Split the request before searching. Example request: "a modern workflow
execution timeline with running, failed, retrying and completed states,
expandable logs, and links to job details."

| Kind | From that request |
|---|---|
| What it is | A vertical list of ordered events with per-event detail |
| States it must carry | running, failed, retrying, completed, and the empty list |
| Behaviour | expand and collapse a row, keyboard reachable, a link out of each row |
| Data shape | an ordered array with status, timestamps, a log body, a job id |
| Density | the real case: how many steps does a long run have? |
| Visual | matches the product's existing list and status conventions |

Name the component category in the words other people use for it. The
request's words are often not the catalogue's. A "workflow execution
timeline" is catalogued as a timeline, a stepper, an activity feed or a log
viewer. Search all the plausible names. `https://component.gallery` settles
what a component is usually called and what it usually does.

## 2. Search the project first

A second copy of a component the product already has is a defect, not a
choice.

```bash
rg -l --glob '!node_modules' -i 'timeline|stepper|activity' --glob '*.tsx' --glob '*.jsx' --glob '*.vue'
```

Where the repository has a graft index, `graft ask "where are list and status
components defined"` is faster and cheaper than grepping.

Read the project's `components.json` too: its `registries` field names the
registries this project has already accepted.

## 3. Search the registries

```bash
node ../product-experience-engineering/scripts/find-components.js \
  timeline stepper activity --limit 20
```

Options that matter:

- `--curated-only` searches only the read-and-licensed sources in
  [sources.json](../product-experience-engineering/sources.json);
- `--registries <n>` widens the long tail;
- `--type any` includes blocks, hooks and whole pages, not only
  `registry:ui`;
- `--json` returns a machine-readable result.

Read the output for what it is. The script fetches the public registry
directory at `https://ui.shadcn.com/r/registries.json`, which held 508
registries on 2026-10-27, each with a health status and an item count. It
then fetches each candidate registry's own catalogue. It scores items by
where the search terms appear: name first, then title, then description. It
caches for a day under `${XDG_CACHE_HOME:-~/.cache}/product-experience`.

**The score is a text match, not a judgement.** It says a candidate is worth
reading. It says nothing about whether the component is any good, and the
directory's own `ranking.score` tracks availability and catalogue size, so a
registry of 12,000 icons outranks a carefully built set of 40 components. Never
present either number to the user as quality.

Other routes, when the script's coverage is not enough:

- `pnpm dlx shadcn@latest search @namespace --query <term>` asks one registry
  directly, and reaches a registry that filters server-side.
- The shadcn MCP server (`pnpm dlx shadcn@latest mcp init --client claude`)
  exposes the same registries to natural-language requests. Use it when it is
  already configured; it is not needed for the script to work.
- Registries with their own MCP server, such as
  `claude mcp add --transport http arc https://uiarc.dev/api/mcp`. An added
  server is an installed dependency: ask before adding one.
- `https://21st.dev/community/libraries` indexes 167 libraries by name, which
  helps when the user names a library rather than a component. Its free plan
  allows two copies a day and its MCP retrieval starts at a paid plan, so
  search the free directory first.

## 4. Read the candidates

Do not rank from a name and a one-line description. For each serious
candidate, read the real thing:

```bash
pnpm dlx shadcn@latest view @namespace/name     # the files, deps and code
curl -s "https://<registry>/r/<name>.json" | jq '.dependencies, .files[0].content' | head -60
```

What to look for in the code:

- the states it actually implements;
- whether status is carried by colour alone;
- keyboard and focus handling;
- whether it owns its own data fetching;
- how much of the project's stack it assumes;
- how many new dependencies it drags in.

Look at the live preview on the source's own page as well. A screenshot shows
the dense case and the failure state that a description omits.

## 5. Rank by suitability

In this order. An earlier row beats a later one; a component that fails one of
the first three is out whatever it looks like.

| # | What | How to judge it |
|---|---|---|
| 1 | Does it do the job | Every state and behaviour from step 1, or a clear seam to add the missing one |
| 2 | Licence and cost | Read at the source. MIT or Apache-2.0 is clear. A Commons Clause, an AGPL default, a paid tier or an unstated licence needs the user's decision before it ships |
| 3 | Stack fit | Same framework, styling system and component base. A Base UI component inside a Radix product is a second system |
| 4 | Design-system fit | Uses tokens, or can be made to. A component that hard-codes its own palette and radii spreads drift |
| 5 | Accessibility | Keyboard operable, named controls, status never by colour alone, focus visible |
| 6 | Responsive behaviour | Check at 375px, not only on the desktop preview |
| 7 | Customer usability | Does it suit the real density and the real labels, or only the demo's six tidy rows |
| 8 | Source quality | Readable code, a maintained repository, a stated version. Record the last push date where it is old |
| 9 | Install cost | New dependencies, peer versions, a build step, a font, a licence key |
| 10 | Maintenance | Code copied into the project is code the project now owns. Prefer fewer, larger, well-built pieces |

Then recommend one, with two to four lines on why. Name the runner-up, and
what would make it the better choice. Where nothing fits, say what each
candidate lacked and propose building it. Compose it from primitives the
project already has wherever that is possible.

## 6. Install, integrate, verify

```bash
pnpm dlx shadcn@latest add @namespace/name --dry-run   # see what it writes
pnpm dlx shadcn@latest add @namespace/name
```

Installing a component writes files into the project and may add
dependencies: confirm with the user before the first install from a source the
project has not used before.

Then map it onto the project's tokens, render it with the real data and the
dense case, and walk it with `journey-walk`. A component that was never
rendered in this product has not been evaluated.

## Report

- The requirement, as split in step 1.
- What the project already had.
- The candidates read, with exact names and links: the source page, the
  registry item url, and the install command.
- The ranking, and the one recommended, with its licence as read.
- Which links were verified by fetching them, and which are inferred.
- What remains unverified: a preview not opened, a licence page not read, a
  licence not stated anywhere.
