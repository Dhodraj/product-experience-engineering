# Maintenance

Three things go stale here: the component sources, the research behind the
verdicts, and what the browser tooling allows. Each has an owner in the files
below.

## Add a component source

One object in `sources.json`, under `components`, `screens` or `patterns`:

```json
{
  "id": "@example",
  "url": "https://example.dev",
  "registry": "https://example.dev/r/{name}.json",
  "for": ["table", "filter"],
  "stack": "react+tailwind+shadcn",
  "licence": "MIT",
  "licence-read": "example-org/ui LICENSE, 2026-11-14",
  "install": "pnpm dlx shadcn@latest add @example/<name>",
  "notes": "What it is good for, and what it is not."
}
```

Rules the validator enforces, and why each exists:

- `licence-read` is required. A licence with no note saying where it was read
  cannot be told apart from a guess, and a guessed licence is the one that
  reaches a client.
- `registry` must contain `{name}`; it is a template the search fills in.
  Leave it out for a source you copy from by hand, like hyperui.
- `catalogue` overrides where the catalogue is fetched from. Only needed when
  it is not `<base>/registry.json` — shadcn's own index is at `/r/index.json`.
- A url cannot be both listed and rejected.

Then:

```bash
node .claude/skills/product-experience-engineering/scripts/check-sources.js
node .claude/skills/product-experience-engineering/scripts/check-sources.js --links
./.claude/skills/product-experience-engineering/tests/run.sh --network
```

Check the new source is actually reachable before trusting it:

```bash
node .claude/skills/product-experience-engineering/scripts/find-components.js \
  button --curated-only | grep '@example'
```

If it says `not searched: @example`, the catalogue url is wrong. Fetch it by
hand to find out where it really is:

```bash
curl -sL https://example.dev/r/registry.json | jq '.items | length'
```

## Is the source even needed?

Before adding one, check whether it is already in the public directory:

```bash
curl -s https://ui.shadcn.com/r/registries.json \
  | jq -r '.[] | select(.name | test("example")) | "\(.name) \(.health.status) \(.ranking.itemCount) \(.homepage)"'
```

The directory held 508 registries on 2026-10-27 and the search already covers
the healthy ones. `sources.json` is for sources worth **curating**: where the
licence has been read, where the notes carry something the catalogue does not,
or where the source should be searched first. A registry that is in the
directory and has nothing special to say about it does not need an entry.

## Refresh a source evaluation

Every entry records a date. Re-read a source when:

- The date is more than about three months old.
- `--links` reports a non-200, or `find-components.js` reports it as not
  searched.
- The directory marks it `degraded` or `unavailable`:

  ```bash
  curl -s https://ui.shadcn.com/r/registries.json \
    | jq -r '.[] | select(.health.status != "healthy") | "\(.name) \(.health.status)"'
  ```

- Someone proposes using it at a client. Licences change, and the one in
  `sources.json` is what was visible on a date, not a promise.

When re-reading, update `licence`, `licence-read` and the top-level `updated`
date together. Where a licence has changed, say so in `notes` rather than
quietly overwriting it: the old reading explains decisions already made.

**One correction is already pending.** The `blueprint` skill's
`sources-read.md`, read on 2026-10-17, rejects coss.com/ui because "the
repository is AGPL-3.0 and states no licence for the UI package". On
2026-10-27 `cosscom/ui`'s `LICENSING.md` puts `apps/origin/` and `apps/ui/`
under MIT. That file belongs to another skill, whose source of record is
`~/Documents/Raw by Dhodraj/blueprint-ui`, so it is recorded here and in
docs/source-research.md rather than edited.

## Refresh the research

`docs/source-research.md` carries one date and every verdict. Revisit a
verdict when:

- A source read as **exclude** publishes a licence. rareui.com, originkit.dev,
  beautifului.dev and libraries.dev are all excluded for that reason alone,
  and any of them could become usable tomorrow.
- A skill read as **reference** changes in a way that matters: if
  `ui-ux-audit` stopped needing Python Playwright, the argument in
  ADR 0001 for writing `measure.js` would weaken.
- A free route appears for something currently paid, or a free route closes.
  21st.dev's two-copies-a-day free tier and its paid MCP are both subject to
  change.

Keep the shape: identity, what it is, install and dependencies, cost, licence,
unique contribution, overlap, limitations, verdict. And keep the distinction
between what was read and what was inferred — it is the only thing that makes
the document worth re-reading in six months.

## When the browser tooling changes

`references/playwright.md` states what Playwright MCP 0.0.83 allowed on
2026-10-27: `file:` urls blocked, output paths confined to the workspace root,
no filesystem access inside `browser_run_code_unsafe`. All three are version
behaviour, not laws. Re-check them after an upgrade:

```bash
claude mcp list
```

If `browser_evaluate` ever gains a way to load a function from a file,
`measure.js` stops needing to be pasted and the note about
`window.pxeMeasure` can go.

## Extending measure.js

It returns measurements, never verdicts. Keep it that way: a check that
decides whether something is a problem belongs in `experience-audit`, where a
human-readable rule can say who it hurts.

Worth adding, in rough order of value, each absent today: card rows off a
shared line; sibling control heights; inner and outer corner radii that are
not concentric; padding asymmetry; grid rows with one lone item; focus
indicators removed with nothing in their place. The last one needs driving
focus through the page, so it belongs with the journey walk rather than with a
single evaluation.

Add the count to `counts`, the sample to the top level, and keep both capped
at `SAMPLE`. The whole return value has to stay small enough to read.

## Extending craft.md

`references/craft.md` holds values, not opinions. A line earns its place
there only if it is a number, a named property, or a rule a reviewer can
apply without arguing. For example: `outer = inner + padding`, `scale(.96)`,
ease-out under 300ms, and never a staged entrance on a repeated
interaction.

Keep three things out. Anything that reduces to taste. Anything that applies
to one framework only. Anything `measure.js` already enforces, since it owns
the measurable parts.

When a value is added, say where it was read. The page's attribution section
and `NOTICE` both name its two sources. A value with no provenance cannot be
told apart from a preference.

**Known gap, recorded rather than fixed.** Nothing enforces this file. Stage
G tells the agent to read it before every UI edit, then relies on that. The
demo in `demo/` was built to it by hand. `demo/console-plain.html` is the
same screen without it, and both pass every automated check. To close this,
copy the shape `taste-skill` uses: make the agent produce three directions,
choose one with a written reason, then judge the result cold against a list
of default looks before calling it done.

## When the entry point gets long

The twelve stages are the skill. Anything that grows past a short section
belongs in `references/` and is loaded when its stage runs. A companion skill
is justified only when someone would invoke it on its own: that is the test
`component-find`, `journey-walk` and `experience-audit` each pass, and the one
that kept product thinking as a reference document rather than a fourth skill.
