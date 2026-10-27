# Installing and invoking

## What is here

```
.claude/skills/
  product-experience-engineering/
    SKILL.md                     the entry point and the twelve stages
    NOTICE                       what was borrowed, from where, under which licence
    sources.json                 component sources, with the licence as read
    references/
      product-thinking.md        business, customer and product questions; evidence rules
      visual-direction.md        direction, the numbers, critique, no default aesthetic
      craft.md                   depth, motion, optical correctness: the layer under layout
      journey-and-states.md      the journey table and the states a fixture hides
      playwright.md              browser mechanics, and what is blocked here
      regression.md              not breaking what worked
    scripts/
      find-components.js         searches 500+ registries, prints candidates
      measure.js                 measures a rendered page, in the browser
      check-sources.js           validates sources.json
    tests/
      run.sh                     36 offline tests, 39 with --network
      fixtures/                  the dashboard before and after, and a landing page
  component-find/SKILL.md        find a component instead of writing one
  journey-walk/SKILL.md          use the running product as a customer
  experience-audit/SKILL.md      audit what exists, in two modes
docs/
  source-research.md             every supplied url, read on 2026-10-27
  adr-0001-architecture.md       why this shape
  testing-report.md              what was run and what came back
  examples.md                    four worked invocations
  maintenance.md                 adding a source, refreshing the research
demo/
  console.html                   a dispatch console built through the stages
  landing.html                   its public page, same direction
  console-shot.png               the console, used as the landing page's proof
  console-plain.html             the same console before the craft pass
  console-light.html             the craft pass before the dark band
```

`demo/` is not part of the skill. It is what the skill produced, kept so the
output can be looked at, and so `console-plain.html` can be put beside
`console.html` to see what the craft pass changed. Serve it over HTTP — the
Playwright MCP server blocks `file:` urls:

```bash
cd demo && python3 -I -m http.server 8731 --bind 127.0.0.1
```

## Install

### This project

Nothing to do. Claude Code reads `.claude/skills/` in the working directory.
Confirm with `/skills` or by asking for one by name.

### Every project on this machine

```bash
cp -R "$REPO/.claude/skills/product-experience-engineering" ~/.claude/skills/
cp -R "$REPO/.claude/skills/component-find" ~/.claude/skills/
cp -R "$REPO/.claude/skills/journey-walk" ~/.claude/skills/
cp -R "$REPO/.claude/skills/experience-audit" ~/.claude/skills/
```

On this machine `~/.claude` is installed from `~/Claude-System`, so the right
move there is to copy into `~/Claude-System/claude/skills/` and run
`./install.sh`. That is a change to a shared runtime: ask first.

### What it needs

| Need | Why | Without it |
|---|---|---|
| Node 20 or newer | the two scripts | no component search, no measuring |
| Network | the registry directory and catalogues | `--curated-only` still works from the cache; the rest of the skill is unaffected |
| A Playwright MCP server | stages H and I, and both companion skills that use a browser | fall back to headless Chrome for renders; interaction is not possible, and the report says so |

Check the browser before relying on it:

```bash
claude mcp list                     # playwright: ... ✔ Connected
ls ~/Library/Caches/ms-playwright   # a chromium build
```

To add the server if it is missing:

```bash
claude mcp add playwright -- pnpm dlx @playwright/mcp@latest
```

Adding an MCP server is a dependency. Ask the user first.

### Better with, not required

| Skill | What it adds | Install |
|---|---|---|
| `blueprint` | the numeric defaults in `rules.md`, and the screen proposal | already on this machine |
| `inspect` | the render-and-look pass and its seven checks | already on this machine |
| `ui-ux-audit` | a deeper measuring script and 16 category references | `cp -r ui-ux-audit ~/.claude/skills/` from EnchStyle/ui-ux-audit-skill; needs Python Playwright |
| `design-taste-frontend` | art direction for a public page, from a researched library | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| `customer-research` | the method for real customer evidence | the marketingskills plugin marketplace |

Each is the user's decision, and each is referenced rather than required.

## Invoke

By name:

```
/product-experience-engineering
/component-find
/journey-walk
/experience-audit
```

Or in plain words, which is what the descriptions are written for:

| Say | What runs |
|---|---|
| "Build the run list screen for dispatchers" | the entry point, at screen depth |
| "Find me a timeline component with expandable logs" | `component-find` |
| "Does the signup flow work on a phone?" | `journey-walk` |
| "Audit this dashboard" | `experience-audit`, audit-only |
| "Audit this dashboard and fix what you find" | `experience-audit`, audit and fix |

## Run the scripts directly

```bash
S=.claude/skills/product-experience-engineering

node $S/scripts/find-components.js timeline stepper --limit 15
node $S/scripts/find-components.js data table filter --curated-only
node $S/scripts/find-components.js chart --type any --registries 25 --json
node $S/scripts/find-components.js button --refresh        # ignore the day-old cache

node $S/scripts/check-sources.js                            # shape only
node $S/scripts/check-sources.js --links                    # also ask every url

$S/tests/run.sh
$S/tests/run.sh --network
```

The search caches the directory and each catalogue for a day under
`${XDG_CACHE_HOME:-~/.cache}/product-experience`.

## Measuring a page

1. Start the application, or serve a static page over HTTP: the MCP server
   blocks `file:` urls.
2. `browser_navigate` to it, then `browser_resize` to 1440 × 900.
3. `browser_evaluate` with the whole contents of `scripts/measure.js`, and a
   `filename` inside the workspace such as `.pxe-audit/measure-1440.json`.
   Paths outside the workspace root are rejected.
4. For each further width: `browser_resize`, then `browser_evaluate` with
   `() => window.pxeMeasure()`. A page reload clears it; paste the file again.
5. `browser_take_screenshot` at each width, and open every image.

Add `.pxe-audit/` to the project's `.gitignore`.
