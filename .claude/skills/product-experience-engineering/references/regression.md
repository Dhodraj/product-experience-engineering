# Not breaking what worked

Loaded at stage K. An experience improvement that removes a control somebody
used every day has cost more than the look it fixed.

## Before touching the code

1. **Find the tests that already cover this area**, and how the project runs
   them. Read `package.json`, the CI workflow, and any `e2e` or `playwright`
   directory. Note which of them pass right now: a failure that was already
   there is not yours, and finding that out afterwards wastes an hour.
2. **List the journeys that already work** on the surface you are about to
   change, in one line each. This list is what stage K checks against. Where
   the surface has no tests, walk the journeys once with `journey-walk` first,
   so there is a recorded before.
3. **Inventory the controls.** Every interactive element on the screen, with
   what it does. The commonest regression in a redesign is a control that
   quietly disappears, and the commonest way it is missed is that nobody wrote
   down that it was there.

## While changing it

- One cause at a time, measured and looked at after each, so it stays clear
  what caused what.
- Keep the accessible names and the roles. Renaming a button breaks both the
  muscle memory of a daily user and every selector that finds it.
- Where a control is deliberately removed, say so in the report with the
  reason. A removal nobody announced reads as a bug.

## Checking afterwards

Scale the checks to the change, rather than running everything after every
edit:

| Change | Check |
|---|---|
| Copy, a token, one style | Render the screen, look at it, run the unit tests for that file if any exist |
| One component | That component's tests, the screens that use it, a walk of the journey it sits on |
| A screen or a flow | The journey walk at 1440 and 375, the area's tests, then the full suite once |
| A shared component or a token | Every screen that uses it. Find them: `rg -l '<ComponentName>' --glob '!node_modules'` |

Then, once, at the end: the project's own full check — type check, lint,
tests, build. Not after every edit.

## Add a test where the fix deserves one

Add or update a test when the fix is for something a customer met: a
blocker, a broken journey, a state that was missing. The test fails without
the fix; confirm that by running it against the unfixed code, otherwise it
proves nothing.

End-to-end tests belong to journeys that matter, not to every screen. Use the
project's own harness rather than introducing a second one. Where the project
has no end-to-end harness, say so and propose one rather than adding a
dependency on your own.

## Reporting what was checked

State all four, plainly:

- What was run, by name, and the result.
- What failed before your change and still fails. Name it as pre-existing,
  and say how you established that — the commit you checked against.
- What your change broke, and whether it is fixed.
- What was not checked, and why. An unverified area that is named costs far
  less than one that is assumed.

Never report a suite as passing because part of it passed, and never present a
skipped test, a mocked boundary or a lenient gate as a verified result. If
the only thing that ran was a fixture, the check is partial and the report
says partial.
