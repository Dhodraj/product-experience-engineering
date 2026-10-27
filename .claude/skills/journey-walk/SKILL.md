---
name: journey-walk
description: "Use the running application as a customer would, in a real browser, and report where it confuses or blocks them. Use when asked whether a flow works, to test signup, onboarding, checkout or any multi-step journey, to check a screen on mobile, or before claiming a change works. Drives the live product with Playwright, enters realistic input, tries the likely mistakes, checks the empty, loading, error and recovery states, captures screenshots and separates what was observed from what was inferred."
---

# Journey walk

A DOM is not an experience. This walk is done as the customer: from the real
entry point, with real input, including the mistakes they will make.

It finds friction. It is not customer research, and a report that blurs the
two is wrong. Say "the walk found" and never "customers find".

## 1. Get the real thing running

[references/playwright.md](../product-experience-engineering/references/playwright.md)
covers the mechanics: which browser tooling is available here, starting the
project's own server, authentication, seeding data, and viewport sizes.

Before starting anything, look for a server that is already running, and for
the project's own script: `dev`, `start`, `preview`, `e2e`. Reuse it. Record
the port and how to stop whatever you start. Stop it when the walk ends.

The application may not start or may not be reachable: no server, no
credentials, no data, a build that fails. Stop there. Say which of those it
was, and mark every journey claim in the report unverified. Do not substitute
reading the source.

## 2. Write the journey down before walking it

One block per journey, before touching the browser, so that what you expected
is recorded independently of what happened:

```
JOURNEY: reassign a late run
ENTRY:   /runs, signed in as a dispatcher, 40 open runs seeded
GOAL:    the late run is assigned to another operator
STEPS:   1 find the late run  2 open it  3 choose an operator  4 confirm
MISTAKES TO TRY: confirm with nobody chosen; reassign a finished run;
         lose the connection mid-save
```

## 3. Walk it

At each step record what the customer meets, not what the code intends:

```
STEP 2: open the late run
  SEES:      <what is on screen, from the snapshot or the screenshot>
  EXPECTS:   <what a customer would assume happens next>
  HAPPENS:   <what actually happened>
  EVIDENCE:  <the screenshot file, or the snapshot line>
  FRICTION:  none | low | high | blocker
  WHY:       <what caused it: a label, a missing state, a dead control>
```

Rules for this table:

- Every row needs evidence that exists. A row with no screenshot and no
  snapshot behind it does not go in the report.
- "The customer would feel confused" is only usable when the row says what
  confused them. Cut any feeling that has no cause next to it.
- A control that does nothing, a label that changes without the data
  changing, and a success message for something that failed are blockers, not
  polish.

## 4. The states a happy path hides

Walk these too, for the surface under test. Each one is a separate
observation, and "not reachable here" is a valid result as long as it is
recorded.

- **Empty**: no rows yet, first use. Does it say what to do next?
- **Loading**: is there feedback inside a few hundred milliseconds, and does
  the layout hold its size?
- **One item**, and the **densest real case**: the real row count, the longest
  identifier, the deepest nesting.
- **Failure**: a request that fails, a validation that rejects, a timeout. Is
  the message specific, next to the thing that failed, and recoverable?
- **Recovery**: can the customer get back to a good state without starting
  over or reloading?
- **No permission**: what does a customer who may not do this see?

## 5. Widths

Walk the whole journey at a phone width, not only look at it. 375 × 812 and a
desktop width at the least; add 1024 where the product has a tablet layout. A
journey that works on desktop and dead-ends on a phone is a blocker.

Check at the phone width: every control on screen without horizontal
scrolling, targets at least 24 × 24 and comfortably 44 × 44, the primary
action reachable with a thumb, and text that is still readable.

## 6. Try the mistakes

The paths a customer takes that the build did not plan for:

- Submit the form empty, and with one field wrong.
- Press the primary action twice.
- Go back mid-flow, then forward again.
- Reload halfway through.
- Paste a long value, a value with spaces, an emoji, a very large number.
- Open a link in a new tab and carry on in the first.

## 7. Report

```
JOURNEY: <name> — completed | blocked at step N
WALKED:  <widths, states, browser, with or without authentication>
STOOD IN FOR: <fixtures for live data, a seeded account, a local font>

FRICTION
  blocker: <what, which step, the evidence file>
  high:    ...
  low:     ...

STATES: empty <result> · loading <result> · dense <result> · error <result>
        · recovery <result> · permission <result | not reachable>

NOT VERIFIED: <what the environment could not reach, and why>
```

Then the fixes worth making, in order of harm to the customer, each tied to
the step it came from. Where a fix is applied, walk the journey again and say
so; a fix nobody re-walked is a claim, not a result.
