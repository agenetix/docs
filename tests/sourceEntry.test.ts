import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as source from "../src/source";

/*
 * `@agenetix/docs/source` is the framework-free entry: a consumer that is not
 * a Next.js app (an Expo Router loader, an Express handler, a build script)
 * imports it to read the same content folders. These tests pin two things:
 * the entry resolves content, and nothing in its import graph pulls in
 * Next.js, React DOM or a component.
 */

const srcDir = path.join(process.cwd(), "src");

function moduleGraphOf(entry: string): string[] {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/^\s*(?:import|export)\s[^'"]*?from\s+["'](\.[^"']+)["']/gm)) {
      const isTypeOnly = /^\s*(?:import|export)\s+type\s/.test(match[0]);
      if (isTypeOnly) continue;
      queue.push(resolveLocal(path.dirname(file), match[1]));
    }
  }
  return [...seen];
}

function resolveLocal(fromDir: string, specifier: string): string {
  const base = path.resolve(fromDir, specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`Cannot resolve ${specifier} from ${fromDir}`);
}

describe("@agenetix/docs/source", () => {
  it("resolves content without a framework", () => {
    const docs = source.createDocsSource({
      contentDir: path.join(process.cwd(), "tests/fixtures/docs"),
      basePath: "/docs",
      defaultLocale: "en",
      locales: ["en", "es"],
      hideDefaultLocaleInUrl: true,
    });
    const resolved = docs.resolveRoute(["getting-started"]);
    expect(resolved?.entry?.title).toBeTruthy();
    expect(source.extractHeadings("## One\n\ntext\n\n### Two").map((heading) => heading.text)).toEqual(["One", "Two"]);
  });

  it("imports nothing from Next.js, React DOM or the component shell", () => {
    const files = moduleGraphOf(path.join(srcDir, "source.ts"));
    const offenders = files.filter((file) => {
      const text = fs.readFileSync(file, "utf8");
      const isComponent = file.includes(`${path.sep}components${path.sep}`) || file.endsWith(".tsx");
      return isComponent || /from\s+["'](next|next\/[^"']*|next-mdx-remote[^"']*|react-dom[^"']*)["']/.test(text);
    });
    expect(offenders.map((file) => path.relative(srcDir, file))).toEqual([]);
    // A runtime `import ... from "react"` would also tie the entry to a renderer.
    const reactRuntime = files.filter((file) => /^\s*import\s+(?!type\s)[^;]*from\s+["']react["']/m.test(fs.readFileSync(file, "utf8")));
    expect(reactRuntime.map((file) => path.relative(srcDir, file))).toEqual([]);
  });
});
