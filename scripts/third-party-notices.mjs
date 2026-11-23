// Writes plugin/lib/THIRD_PARTY_LICENSES.txt for the packages bundled into plugin/lib/domain-preflight.cjs.
import { readFileSync, writeFileSync } from "node:fs";

const bundled = ["tldts", "tldts-core"];
const sections = bundled.map((name) => {
  const pkg = JSON.parse(readFileSync(new URL(`../node_modules/${name}/package.json`, import.meta.url), "utf8"));
  const license = readFileSync(new URL(`../node_modules/${name}/LICENSE`, import.meta.url), "utf8").trim();
  return `${name}@${pkg.version} (${pkg.license})\n\n${license}`;
});
writeFileSync(new URL("../plugin/lib/THIRD_PARTY_LICENSES.txt", import.meta.url), `domain-preflight.cjs bundles the following packages.\n\n${sections.join("\n\n" + "-".repeat(72) + "\n\n")}\n`);
