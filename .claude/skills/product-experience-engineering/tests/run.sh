#!/usr/bin/env bash
# Tests for this skill's scripts.
#
#   ./tests/run.sh            the offline tests: no network, no browser
#   ./tests/run.sh --network  also search the real registries
#
# The browser checks are not here: measure.js runs inside a page, and the
# testing report records what it returned against the fixtures in
# tests/fixtures/.
# No `-e`: a failing assertion must be counted and reported, not abort the run.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill="$here/.."
check="$skill/scripts/check-sources.js"
find_components="$skill/scripts/find-components.js"
network=0
[[ "${1:-}" == "--network" ]] && network=1

pass=0; fail=0
tmp="$(mktemp -d)"
[[ -n "$tmp" && -d "$tmp" ]] || { echo "could not make a temporary directory"; exit 2; }
trap '[[ -n "${tmp:-}" && -d "$tmp" ]] && rm -rf "$tmp"' EXIT

ok()  { if [[ "$2" == "$3" ]]; then pass=$((pass+1)); else fail=$((fail+1)); printf 'FAIL %s\n  want: %s\n  got:  %s\n' "$1" "$3" "$2"; fi; }
# -- so a pattern that starts with a dash is a pattern, not an option.
has() { if grep -q -- "$3" <<<"$2"; then pass=$((pass+1)); else fail=$((fail+1)); printf 'FAIL %s (missing %s)\n  got: %s\n' "$1" "$3" "$2"; fi; }
hasnt() { if grep -q -- "$3" <<<"$2"; then fail=$((fail+1)); printf 'FAIL %s (unexpected %s)\n' "$1" "$3"; else pass=$((pass+1)); fi; }

run()  { node "$check" "$1" 2>&1; }
code() { node "$check" "$1" >/dev/null 2>&1; echo $?; }

# ---------------------------------------------------------------- sources.json

good='{"version":1,"updated":"2026-10-27",
 "components":[{"id":"@a","url":"https://a.test","registry":"https://a.test/r/{name}.json",
   "for":["table"],"stack":"react","licence":"MIT","licence-read":"a/LICENSE, 2026-10-27"}],
 "screens":[{"id":"b","url":"https://b.test","for":["dashboard"],"stack":"react",
   "licence":"MIT","licence-read":"b/LICENSE, 2026-10-27"}],
 "rejected":[{"url":"https://c.test","reason":"paid"}]}'

printf '%s' "$good" > "$tmp/good.json"
ok  "a good file passes" "$(code "$tmp/good.json")" "0"
has "it counts the sources" "$(run "$tmp/good.json")" "2 sources (1 searchable), 1 rejected"

bad() { python3 -I -c "
import json,sys
d=json.loads(open('$tmp/good.json').read())
exec(sys.argv[1])
open('$tmp/bad.json','w').write(json.dumps(d))
" "$1"; }

bad "d['components'][0].pop('licence')"
ok  "a missing licence fails" "$(code "$tmp/bad.json")" "1"
has "it names the field" "$(run "$tmp/bad.json")" "has no licence"

bad "d['components'][0].pop('licence-read')"
has "a licence with no reading note is caught" "$(run "$tmp/bad.json")" "no licence-read note"

bad "d['components'][0]['registry']='https://a.test/r/button.json'"
has "a registry url without {name} is caught" "$(run "$tmp/bad.json")" "must contain {name}"

bad "d['components'][0]['catalogue']='r/index.json'"
has "a catalogue that is not a url is caught" "$(run "$tmp/bad.json")" "catalogue is not a url"

bad "d['screens'][0]['id']='@a'"
has "a repeated id is caught" "$(run "$tmp/bad.json")" "repeats"

bad "d['screens'][0]['url']='https://a.test'"
has "a repeated url is caught" "$(run "$tmp/bad.json")" "repeats"

bad "d['rejected'].append({'url':'https://a.test','reason':'x'})"
has "a source that is also rejected is caught" "$(run "$tmp/bad.json")" "also listed"

bad "d['components'][0]['url']='a.test'"
has "a url without a scheme is caught" "$(run "$tmp/bad.json")" "not a url"

bad "d['components'][0]['for']=[]"
has "an empty for list is caught" "$(run "$tmp/bad.json")" "is empty"

bad "d['components'][0]['for']='table'"
has "a for that is not an array is caught" "$(run "$tmp/bad.json")" "must be an array"

bad "d['updated']='27-10-2026'"
has "a bad date is caught" "$(run "$tmp/bad.json")" "YYYY-MM-DD"

bad "d['version']=2"
has "a wrong version is caught" "$(run "$tmp/bad.json")" "version must be 1"

bad "d['rejected'][0].pop('reason')"
has "a rejection without a reason is caught" "$(run "$tmp/bad.json")" "has no reason"

printf 'not json' > "$tmp/broken.json"
ok "an unreadable file exits 2" "$(code "$tmp/broken.json")" "2"
ok "a missing file exits 2" "$(code "$tmp/absent.json")" "2"

ok "the shipped file is valid" "$(code "$skill/sources.json")" "0"

# ------------------------------------------------------------- find-components

usage="$(node "$find_components" 2>&1; echo "exit=$?")"
has "no terms prints the usage" "$usage" "Usage:"
has "no terms exits 2" "$usage" "exit=2"
has "an unknown option is rejected" "$(node "$find_components" x --nope 2>&1)" "unknown option"
has "a bad limit is rejected" "$(node "$find_components" x --limit 0 2>&1)" "--limit must be"

# An empty curated file and no directory leaves nothing to search.
printf '{"version":1,"updated":"2026-10-27","components":[],"screens":[],"rejected":[]}' > "$tmp/empty-sources.json"
mkdir -p "$tmp/skill/scripts"
cp "$find_components" "$tmp/skill/scripts/"
cp "$tmp/empty-sources.json" "$tmp/skill/sources.json"
out="$(node "$tmp/skill/scripts/find-components.js" button --curated-only 2>&1; echo "exit=$?")"
has "no registries to search is an error, not a silent pass" "$out" "no registries to search"
has "and it exits 2" "$out" "exit=2"

# ------------------------------------------------------------------- fixtures

for fixture in dashboard-before.html dashboard-after.html; do
  if [[ -f "$here/fixtures/$fixture" ]]; then pass=$((pass+1)); else
    fail=$((fail+1)); printf 'FAIL fixture %s is missing\n' "$fixture"; fi
done

before="$(cat "$here/fixtures/dashboard-before.html")"
after="$(cat "$here/fixtures/dashboard-after.html")"
has   "the before fixture carries colour-only status" "$before" 'class="dot'
hasnt "the after fixture has no colour-only status"   "$after"  'class="dot'
has   "the before fixture scrolls sideways by design" "$before" 'min-width: 760px'
has   "the after fixture names its row controls"      "$after"  'aria-label="Actions for run'
# Every run in the before fixture still has its row control in the after one.
for id in 000418-GLA 000419-EDI 000420-ABD 000421-INV 000422-GLA; do
  has "run $id kept its row control" "$after" "Actions for run RUN-2026-10-27-$id"
done

# --------------------------------------------------------------------- network

if (( network )); then
  out="$(node "$find_components" data table --curated-only --limit 5 2>&1)"
  has "a curated search returns results" "$out" "searched"
  has "it names the licence it read" "$out" "MIT"
  out="$(node "$check" "$skill/sources.json" --links 2>&1; echo "exit=$?")"
  has "every source url answers" "$out" "exit=0"
else
  printf 'skipped: the network tests. Run with --network.\n'
fi

printf '%s passed, %s failed\n' "$pass" "$fail"
(( fail == 0 ))
