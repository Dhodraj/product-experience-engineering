#!/usr/bin/env node
// Searches shadcn-spec component registries for items matching search terms.
//
// Two sources of registries, in this order:
//   1. sources.json next to this script: the curated list, with a read licence.
//   2. https://ui.shadcn.com/r/registries.json: the public directory, 500+
//      registries with a health score. Used for the long tail.
//
// Each registry publishes a catalogue at <base>/registry.json holding every
// item with its name, type, title, description and dependencies. This script
// fetches those catalogues, scores items against the terms, and prints the
// candidates with the exact command to read each one.
//
// It reports matches and facts. It does not judge suitability: ranking a
// candidate needs its code, its API and the project's stack, which is the
// caller's job.
//
// Usage:
//   find-components.js <term> [term...] [options]
//
//   --type <t>        registry item type, repeatable. Default registry:ui.
//                     Pass "any" for every type.
//   --limit <n>       items to print. Default 20.
//   --registries <n>  extra directory registries to search. Default 12.
//   --curated-only    search only sources.json, no directory.
//   --refresh         ignore the cache and fetch again.
//   --json            print JSON instead of a table.
//   --cache-dir <d>   where to cache catalogues. Default
//                     ${XDG_CACHE_HOME:-~/.cache}/product-experience.
//
// Exit 0 with results, 1 with none, 2 on a usage or network error.
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const DIRECTORY_URL = "https://ui.shadcn.com/r/registries.json";
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 20000;

function parseArgs(argv) {
  const options = {
    terms: [],
    types: [],
    limit: 20,
    registries: 12,
    curatedOnly: false,
    refresh: false,
    json: false,
    cacheDir: path.join(
      process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"),
      "product-experience",
    ),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      i += 1;
      return value;
    };
    if (arg === "--type") options.types.push(next());
    else if (arg === "--limit") options.limit = Number(next());
    else if (arg === "--registries") options.registries = Number(next());
    else if (arg === "--cache-dir") options.cacheDir = next();
    else if (arg === "--curated-only") options.curatedOnly = true;
    else if (arg === "--refresh") options.refresh = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg.startsWith("-")) throw new Error(`unknown option ${arg}`);
    else options.terms.push(arg);
  }
  if (options.types.length === 0) options.types = ["registry:ui"];
  if (!Number.isFinite(options.limit) || options.limit < 1) throw new Error("--limit must be a positive number");
  if (!Number.isFinite(options.registries) || options.registries < 0) throw new Error("--registries must be 0 or more");
  return options;
}

// A registry's catalogue sits beside its item template:
// https://x.dev/r/{name}.json -> https://x.dev/r/registry.json
// A source may override that with its own `catalogue` url, which shadcn's own
// registry needs: its index is at /r/index.json and /r/registry.json is a 404.
function catalogueUrl(template) {
  // A {style} segment is part of the path, so it has to be resolved before
  // the item name is dropped: reui serves /r/{style}/{name}.json.
  const withoutQuery = template.split("?")[0].replace("{style}", "default");
  const slash = withoutQuery.lastIndexOf("/");
  if (slash === -1) return null;
  return `${withoutQuery.slice(0, slash)}/registry.json`;
}

function cachePath(cacheDir, key) {
  const safe = key.replace(/[^a-zA-Z0-9.-]+/g, "_").slice(0, 120);
  return path.join(cacheDir, `${safe}.json`);
}

async function fetchJson(url, { cacheDir, refresh, key }) {
  const file = cachePath(cacheDir, key || url);
  if (!refresh) {
    try {
      const stat = fs.statSync(file);
      if (Date.now() - stat.mtimeMs < CACHE_MAX_AGE_MS) {
        return { data: JSON.parse(fs.readFileSync(file, "utf8")), cached: true };
      }
    } catch {
      // No usable cache entry. Fall through to the network.
    }
  }
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  const data = await response.json();
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data));
  return { data, cached: false };
}

function readSources(scriptDir) {
  const file = path.join(scriptDir, "..", "sources.json");
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return (data.components || []).filter((entry) => entry.registry);
  } catch {
    return [];
  }
}

// Scores a string against the terms. A term in the name counts for more than
// the same term in the description, because a registry's descriptions are
// written by its author and vary in length.
function scoreText(item, terms) {
  const name = String(item.name || "").toLowerCase();
  const title = String(item.title || "").toLowerCase();
  const description = String(item.description || "").toLowerCase();
  let score = 0;
  let matched = 0;
  for (const term of terms) {
    let termScore = 0;
    if (name === term) termScore = 10;
    else if (name.includes(term)) termScore = 6;
    if (title.includes(term)) termScore += 3;
    if (description.includes(term)) termScore += 2;
    if (termScore > 0) matched += 1;
    score += termScore;
  }
  // Every term present beats a single term present many times.
  if (matched === terms.length && terms.length > 1) score += 4 * terms.length;
  return { score, matched };
}

function isDemo(item) {
  const name = String(item.name || "");
  return /(^|-)(demo|example|preview)(-|$)/.test(name) || item.type === "registry:example";
}

async function registriesFromDirectory(options, limit) {
  if (limit === 0) return [];
  const { data } = await fetchJson(DIRECTORY_URL, {
    cacheDir: options.cacheDir,
    refresh: options.refresh,
    key: "registries-directory",
  });
  const terms = options.terms;
  return data
    .filter((entry) => entry.health && entry.health.status === "healthy" && entry.url)
    .map((entry) => {
      const text = `${entry.name} ${entry.description || ""}`.toLowerCase();
      const hits = terms.filter((term) => text.includes(term)).length;
      return { entry, hits };
    })
    // A keyword hit in the registry's own blurb is a weak signal, so a
    // registry's health and size break the tie.
    .sort((a, b) =>
      b.hits - a.hits ||
      (b.entry.ranking?.score || 0) - (a.entry.ranking?.score || 0))
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.name,
      url: entry.homepage,
      registry: entry.url,
      licence: "not read: check at the source",
      health: entry.health.status,
      healthScore: entry.health.score,
      items: entry.ranking?.itemCount,
      origin: "directory",
    }));
}

async function searchRegistry(source, options) {
  const url = source.catalogue || catalogueUrl(source.registry);
  if (!url) return { source, error: `cannot derive a catalogue url from ${source.registry}` };
  let catalogue;
  try {
    ({ data: catalogue } = await fetchJson(url, {
      cacheDir: options.cacheDir,
      refresh: options.refresh,
      key: `catalogue-${source.id}`,
    }));
  } catch (error) {
    return { source, error: error.message };
  }
  // Most registries wrap their items in `items`; shadcn's own index is a
  // bare array.
  const items = Array.isArray(catalogue)
    ? catalogue
    : Array.isArray(catalogue.items) ? catalogue.items : [];
  const wantAnyType = options.types.includes("any");
  const results = [];
  for (const item of items) {
    if (!wantAnyType && !options.types.includes(item.type)) continue;
    const { score, matched } = scoreText(item, options.terms);
    if (matched === 0) continue;
    results.push({
      registry: source.id,
      name: item.name,
      type: item.type,
      title: item.title || null,
      description: item.description || null,
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: Array.isArray(item.files) ? item.files.length : 0,
      licence: source.licence,
      health: source.health || null,
      origin: source.origin,
      homepage: source.url || (Array.isArray(catalogue) ? null : catalogue.homepage) || null,
      docs: item.meta?.links?.base?.docs || item.meta?.links?.docs || null,
      itemUrl: source.registry.replace("{name}", item.name).replace("{style}", "default"),
      read: `pnpm dlx shadcn@latest view ${source.id}/${item.name}`,
      install: `pnpm dlx shadcn@latest add ${source.id}/${item.name}`,
      score: score - (isDemo(item) ? 5 : 0),
      demo: isDemo(item),
    });
  }
  return { source, results };
}

function printTable(rows, notes) {
  const width = (key, min) => Math.max(min, ...rows.map((row) => String(row[key] ?? "").length));
  const registryWidth = width("registry", 8);
  const nameWidth = width("name", 4);
  for (const row of rows) {
    const flag = row.demo ? " [demo]" : "";
    console.log(
      `${row.registry.padEnd(registryWidth)}  ${row.name.padEnd(nameWidth)}  ` +
      `${String(row.score).padStart(3)}  ${row.licence}${flag}`,
    );
    if (row.description) console.log(`    ${row.description}`);
    const deps = row.dependencies.length ? ` deps: ${row.dependencies.join(", ")}` : " deps: none";
    console.log(`   ${deps}; files: ${row.files}`);
    console.log(`    read: ${row.read}`);
  }
  for (const note of notes) console.log(note);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`${error.message}\nRun with --help for usage.`);
    process.exit(2);
  }
  if (options.help || options.terms.length === 0) {
    console.log(fs.readFileSync(__filename, "utf8").split("\n").slice(1, 30).join("\n").replace(/^\/\/ ?/gm, ""));
    process.exit(options.help ? 0 : 2);
  }
  options.terms = options.terms.map((term) => term.toLowerCase());

  const curated = readSources(__dirname);
  let directory = [];
  const notes = [];
  if (!options.curatedOnly) {
    try {
      directory = await registriesFromDirectory(options, options.registries);
    } catch (error) {
      notes.push(`directory unavailable (${error.message}); searched the curated sources only`);
    }
  }
  const seen = new Set(curated.map((entry) => entry.id));
  const sources = [...curated, ...directory.filter((entry) => !seen.has(entry.id))];
  if (sources.length === 0) {
    console.error("no registries to search: sources.json has no entry with a registry url and the directory was unreachable");
    process.exit(2);
  }

  const searched = await Promise.all(sources.map((source) => searchRegistry(source, options)));
  const failed = searched.filter((result) => result.error);
  const rows = searched
    .flatMap((result) => result.results || [])
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit);

  for (const result of failed) notes.push(`not searched: ${result.source.id} (${result.error})`);
  notes.push(`searched ${sources.length - failed.length} registries for: ${options.terms.join(", ")}`);
  notes.push("licences marked \"check at the source\" were not read; read one before shipping a component");

  if (options.json) {
    console.log(JSON.stringify({ terms: options.terms, results: rows, notes }, null, 2));
  } else if (rows.length === 0) {
    console.log("no match");
    for (const note of notes) console.log(note);
  } else {
    printTable(rows, notes);
  }
  process.exit(rows.length ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(2);
});
