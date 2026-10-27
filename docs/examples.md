# Four worked invocations

Each shows what to say, what the skill does, and what comes back. The
component search output is from a real run on 2026-10-27; the rest is the
shape of the exchange.

## 1. A new product surface

> Build the operations console for Consign. Dispatchers watch runs against a
> schedule and move the ones that are slipping.

**Depth**: a new surface, so every stage, with the proposal approved before
any code.

**Stage A** reads the repository first, then writes three answers, two lines
each, with assumptions marked:

```
Business  Fewer late deliveries explained after the fact. (assumption: no
          figures were supplied, so this is not measured here.)
Customer  A dispatcher with 40 open runs, watching for slippage all day.
Smallest  One screen: which runs are slipping, and reassign.
Not now   Reporting, billing, the driver's own app.
```

**Stage C** turns that into something checkable:

```
Outcome    A dispatcher sees which run is late and reassigns it without
           leaving the list.
Accept  1  The late count is the largest thing on the screen.
        2  Every run's status is readable without colour.
        3  At 375px every run's reassign control is reachable, no sideways
           scroll.
        4  The empty state says what to do first.
```

Then it stops and puts the proposal — skeleton, components with sources,
scales as values, states, cost, one alternative — to the user, through
`blueprint` where a single screen is in question. Nothing is built on silence.

**Stages D to G** map the journey and its states, set the direction from the
product's own world, search for components before writing any, and build
every state rather than the happy path. Stage G reads
`references/craft.md` first, every time: depth as a shadow rather than a
border, concentric radii, ease-out under 300ms, an entrance that fires once
and never on a repeated interaction, tabular figures. `demo/console.html` is
what that stage produced here, and `demo/console-plain.html` is the same
screen without it.

**Stages H to L** start the application, walk the journey, measure, fix, run
the project's checks, and report what was verified and what was not.

## 2. Find a component

> I need a modern workflow execution timeline with running, failed, retrying
> and completed states, expandable logs, and links to job details.

`component-find` splits that into requirements, searches the project, then:

```
$ node .claude/skills/product-experience-engineering/scripts/find-components.js \
    timeline stepper activity --limit 10 --registries 16

@stepper   stepper              15  not read: check at the source
    A lightweight, composable stepper primitive for shadcn/ui-style multi-step flows.
   deps: @radix-ui/react-slot; files: 1
    read: pnpm dlx shadcn@latest view @stepper/stepper
@reui      timeline             13  MIT
   deps: @base-ui/react, cn; files: 1
    read: pnpm dlx shadcn@latest view @reui/timeline
@uiarc     timeline             13  not stated on the site's pages that were read
    Follow what happened, newest first, grouped by day.
   deps: lucide-react, motion; files: 2
    read: pnpm dlx shadcn@latest view @uiarc/timeline
...
searched 24 registries for: timeline, stepper, activity
licences marked "check at the source" were not read; read one before shipping a component
```

Then it reads the two serious candidates, rather than ranking from the
descriptions, and reports:

> `@uiarc/timeline` is the only candidate that already does what you
> described: a `detail` slot per row wired with `aria-expanded` and
> `aria-controls`, a status tone per event, keyboard handling on the list, and
> motion that honours `prefers-reduced-motion`. Its source even carries the
> rule you would otherwise have to add: "Always say the outcome in the title
> too, so it never rests on color."
>
> One thing stops me recommending it outright: **its licence is not stated**
> on any page I read, and it brings `motion` and a motion-tokens item with it.
> https://uiarc.dev/r/timeline.json
>
> `@reui/timeline` is MIT, verified at `keenthemes/reui`, but it is a stepper
> with an `activeStep`, not an event log, and has no status and no expandable
> detail. Using it means rewriting most of it.
> https://reui.io/r/default/timeline.json
>
> Which do you want: Arc with its licence question settled first, or a
> timeline composed from the `@shadcn` primitives this project already has?

## 3. Audit something that exists

> This dashboard looks off. Can you check it?

`experience-audit` opens with the mode, because that is the thing most easily
got wrong:

> Mode: audit only. I will not change any files.

Then it measures at 1440, 1024 and 375, opens every screenshot, walks the main
journey, and reports findings in severity order, each with its kind and its
evidence:

```
C1. Run status shown by colour alone  (.run-row .dot, 40 rows)  [accessibility]
Found:  a coloured dot with no word or shape; amber measures 2.9:1 against
        the row background
Why:    a colour-blind dispatcher cannot tell a late run from a running one,
        which is the screen's whole job
Fix:    add the status word beside the dot, and give each status its own shape
Evidence: .pxe-audit/shot-1440.png, measure-1440.json contrastFailures[3]

W2. Twelve equal tiles, nothing dominant  (.tiles)  [product]
Found:  twelve figures at one size; the late count is the fourth of twelve
Why:    the screen does not say what to do first, so the dispatcher scans
        instead of acting
Fix:    make the late count the dominant figure; the rest become one quiet row
```

It ends with what is sound, so the next session does not undo it, and at most
three questions. It does not start editing.

## 4. Walk a journey

> Does the trial signup work on a phone?

`journey-walk` finds or starts the application, writes the journey down
before walking it, then drives it at 375 × 812:

```
JOURNEY: start a 14-day trial — completed
WALKED:  375x812 and 1440x900, signed out, Chromium via the MCP server

STEP 1  hero "Start a 14-day trial"   -> moves to the form           friction none
STEP 2  submit empty                  -> two messages beside their
                                         own fields, focus moves to
                                         the first                    friction none
STEP 3  submit dispatch@yourdepot     -> "missing an @ or a domain",
                                         with an example              friction none
STEP 4  submit a valid address        -> success, names the depot,
                                         says nothing is charged      friction none

STATES: empty n/a · loading not reachable (no request) · error verified ·
        recovery verified · permission n/a
CONSOLE: 0 errors, 0 warnings
NOT VERIFIED: the email is never sent — there is no endpoint on this page, so
              "we have sent the link" is unproven from here
```

That last line is the point of the skill. The journey completes, the claim on
screen is not verified, and the report says which is which.
