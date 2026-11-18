import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("css/portfolio.css", "utf8");
const js = readFileSync("js/portfolio.js", "utf8");

assert.match(html, /^<!doctype html>/i, "Missing HTML5 doctype");
assert.match(html, /<html lang="en">/, "Missing document language");
assert.match(html, /<meta name="description"/, "Missing description meta tag");
assert.match(html, /<meta name="viewport"/, "Missing viewport meta tag");
assert.match(html, /class="skip-link"/, "Missing keyboard skip link");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate HTML id values");
const known = new Set(ids);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(known.has(match[1]), "Missing anchor target #" + match[1]);
}
for (const match of html.matchAll(/(?:src|href)="(\.\/[\w./-]+)"/g)) {
  assert.ok(existsSync(match[1]), "Local asset not found: " + match[1]);
}
for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  assert.match(match[0], /rel="noopener noreferrer"/, "External new-tab link missing rel protection");
}
for (const section of ["home", "projects", "experience", "about", "contact"]) {
  assert.ok(known.has(section), "Missing " + section + " section");
}
assert.ok(css.length > 1000, "Stylesheet unexpectedly short");
assert.ok(js.includes("aria-expanded"), "Missing accessible mobile menu behavior");
console.log("Portfolio checks passed: metadata, navigation, anchors, assets, external links.");
