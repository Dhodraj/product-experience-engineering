# Driving the browser

The mechanics behind stage H and the `journey-walk` and `experience-audit`
skills. Everything stated as observed here was run on 2026-10-27 against
Playwright MCP 0.0.83; check it again rather than trusting this page if a tool
behaves differently.

## Check what is available before planning around it

Installing a skill does not give an agent a browser. Check:

```bash
claude mcp list                 # is a playwright server connected?
ls ~/Library/Caches/ms-playwright   # macOS: is a browser downloaded?
ls -d "/Applications/Google Chrome.app"
```

Three routes, in order of preference:

1. **The Playwright MCP tools** (`browser_navigate`, `browser_snapshot`,
   `browser_click`, `browser_type`, `browser_fill_form`, `browser_resize`,
   `browser_take_screenshot`, `browser_evaluate`, `browser_console_messages`,
   `browser_network_requests`). Nothing to install, and it clicks and types,
   which a screenshot tool cannot.
2. **The project's own end-to-end tooling**, where it has some. It already
   knows the routes, the sign-in and the fixtures. Prefer it for anything that
   should become a regression test.
3. **Headless Chrome**, for a render when there is no MCP server:

   ```bash
   CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
   for w in 1440 1024 375; do
     "$CHROME" --headless --disable-gpu --hide-scrollbars \
       --screenshot="shots/shot-$w.png" --window-size="$w,2000" "$URL"
   done
   ```

   This renders. It does not interact, so a journey walked this way is a
   series of pictures and the report says so.

If none is available, say that in the report and mark every journey claim
unverified. Reading the source instead is not a substitute and must never be
written up as though the page had been seen.

## Constraints observed with the MCP server

- **`file:` URLs are blocked.** Serve a static page over HTTP instead:

  ```bash
  python3 -I -m http.server 8731 --bind 127.0.0.1 >/tmp/pxe-server.log 2>&1 &
  ```

  Record the port and the process, and stop it when the walk ends.
- **Output paths must sit inside the workspace root.** `browser_evaluate`'s
  and `browser_take_screenshot`'s `filename` is rejected for a path outside
  it, `/tmp` included. Write to something like `.pxe-audit/` in the repository
  and add it to `.gitignore`.
- **`browser_run_code_unsafe` cannot read files.** Its sandbox has no
  `require`, no `process`, no `__dirname` and no dynamic `import`, so a
  Node-side driver that loads a script from disk does not work. It is also
  RCE-equivalent by its own description; there is no reason to reach for it
  here.
- **`browser_evaluate` takes the function as a string.** Pass the whole
  contents of `scripts/measure.js`, which leaves itself on the page as
  `window.pxeMeasure`. Every later measurement in the same page is then
  `() => window.pxeMeasure()`. A full page load clears it: paste the file
  again after one.
- Pass `filename` on both tools so the JSON and the images go to files
  instead of into the conversation.

## Starting the application

Look for a server that is already running before starting one:

```bash
lsof -nP -iTCP -sTCP:LISTEN | grep -E 'node|python|ruby'
```

Then the project's own script: `dev`, `start`, `preview`, `serve`. Read
`package.json` rather than guessing. Give it a moment and check it answers
before navigating:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000
```

Record the process and the port, and stop whatever you started when the walk
ends. Never start a watcher that outlives the task.

## Authentication and data

Both decide whether a journey can be walked at all, and both are commonly
assumed and then missing.

- Find the project's own test credentials or seeding script. Do not invent an
  account, and never put a real credential into a command whose text is shown.
- Where sign-in is required and no credential is available, say so, walk what
  is reachable signed out, and mark the rest unverified.
- Seed the data the journey needs, including the dense case and at least one
  row in every state. A walk over six tidy fixture rows proves the layout for
  six tidy fixture rows.

## Widths

1440 for desktop, 1024 where the product has a tablet layout, and 375 × 812
for the phone. Walk the journey at the phone width; do not only photograph it.

```
browser_resize(width: 375, height: 812)
browser_evaluate(function: "() => window.pxeMeasure()", filename: ".pxe-audit/measure-375.json")
browser_take_screenshot(filename: ".pxe-audit/shot-375.png", fullPage: true, scale: "css")
```

## Interacting

- `browser_snapshot` is the accessibility tree and is the right input for
  deciding what to click; it also shows what a screen reader would announce.
- `browser_take_screenshot` is for judging what the page looks like. Open
  every image with the Read tool. A file list is not a look.
- `browser_console_messages` and `browser_network_requests` catch the failure
  a screenshot hides: a 500 behind a spinner, an uncaught error after a click.
- Realistic input means the long name, the apostrophe, the five-digit number
  and the empty submit, not `test test`.

## Capturing a state that needs setting up

Drive the application into the state rather than mocking it where you can: an
empty list by filtering to nothing, an error by submitting what the server
rejects, loading by throttling. Where a state can only be reached by faking a
response, say in the report that it was faked.

## Cleaning up

Close the page when the walk is finished, and stop every server and process
started for it. Leave the repository as it was apart from the files the task
was meant to change; add the audit output directory to `.gitignore` rather
than committing screenshots nobody asked for.
