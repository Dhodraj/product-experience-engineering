# The journey and its states

Loaded at stage D. A screen is a point on a journey, and most screens that
satisfy their ticket fail because the journey around them was never drawn.

## Map the journey before designing the screen

Write it as a table, one row per step. Fill every column; a blank column is
the gap the customer will fall into.

| # | The customer does | They know | They must decide | They see | Can go wrong |
|---|---|---|---|---|---|
| 0 | Trigger: a run goes late | an alert arrived | whether it matters | the alert | the alert is noise |
| 1 | opens the run list | the run id | which run is late | 40 rows | late is not visible |
| 2 | opens the run | its id and state | who to reassign to | operator list | nobody is free |
| 3 | confirms | the new operator | nothing | a confirmation | the save fails |
| 4 | after | it is reassigned | what next | the updated row | no sign it worked |

Then answer three questions about the whole journey:

- **What triggers it?** Nobody opens a screen for its own sake. The trigger
  decides the entry point, and the entry point decides what has to be on
  screen first.
- **What does success look and feel like?** Not a toast. What the customer can
  now see or do that they could not before.
- **What follows success?** The next action belongs on the screen that
  completes the last one.

## The states, listed before the first file

A screen built on one fixture is a screen with one state. List the real ones:

| State | The question it answers |
|---|---|
| **Empty, first use** | What is this, and what do I do first? The onboarding lives here |
| **Empty, filtered to nothing** | Different from first use. Say which filter emptied it and offer to clear it. Never show an empty result as zeros |
| **One item** | Does the layout hold with one row? Does the summary still make sense? |
| **Many** | The real count. 40 runs, 5,000 rows, not the fixture's six |
| **The densest real case** | The longest identifier, the deepest nesting, the longest label in the locale |
| **Loading** | Feedback inside a few hundred milliseconds, holding its space so nothing jumps |
| **Partial failure** | One widget failed and the rest works. Does the page say which, in place? |
| **Error** | Specific, next to what failed, and recoverable |
| **No permission** | What a customer who may not do this sees. Not a dead control and not a crash |
| **Disabled** | Why it is disabled, said somewhere the customer can find |
| **Stale** | Data that is older than it looks. Say when it was fetched |

Build each state that the surface can really reach. Where a state cannot be
reached in this environment, record that rather than assuming it works.

## Realistic data

Fixtures decide what gets designed, so make them real:

- The real row count, not six tidy rows.
- Real identifiers, including the long ugly one.
- Real names, including the one with an apostrophe and the one that is 60
  characters long.
- Real numbers, including zero, a negative, and one that needs five digits
  plus a currency.
- Real timestamps, including today, yesterday and two years ago.
- Real failure: at least one row in every state the system can produce.

Where sample content fills a gap in the brief, list it in the report as
sample content for the user to confirm. Proof is never sampled: no invented
customers, quotations, logos, review scores or business figures.

## The first-time customer

Walk the journey as someone who has never seen it. What they meet is the empty
state, not the populated screenshot in the design. Check:

- The screen says what it is without the customer knowing the product.
- The one next action is obvious and is a real control, not a hint.
- Nothing requires a value they do not have yet.
- Time to the first useful result, and what stands in the way.

## Acceptance criteria from the journey

Turn each row of the table into something checkable in a browser. These are
what stage L reports against.

Good: "At 375px, a dispatcher can see which of 40 runs is late and reach its
reassign control without horizontal scrolling."

Not: "The run list is clear and easy to use."
