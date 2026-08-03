import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Mermaid from "../src/components/mdx/Mermaid";
import { DocsMdx, getDefaultMdxComponents } from "../src/mdx";

const mocks = vi.hoisted(() => ({
  mdxRemote: vi.fn((_props: unknown) => null),
}));

vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: mocks.mdxRemote,
}));

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async (_id: string, chart: string) => ({
      svg: `<svg data-chart="${chart.replaceAll('"', "&quot;")}"></svg>`,
    })),
  },
}));

describe("MDX rendering", () => {
  it("allows trusted MDX expression props while keeping dangerous expressions blocked", async () => {
    const element = await DocsMdx({ content: '<Probe value={3}>{`hello`}</Probe>' });

    render(element);

    expect(mocks.mdxRemote).toHaveBeenCalled();
    expect(mocks.mdxRemote.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          blockJS: false,
          blockDangerousJS: true,
        }),
      })
    );
  });

  it("renders JSX Mermaid chart props", async () => {
    const mermaid = (await import("mermaid")).default;
    vi.mocked(mermaid.render).mockClear();
    const { container } = render(<Mermaid chart={`graph LR\n  A --> B\n`} />);

    await waitFor(() => expect(container.querySelector("svg")).toBeInTheDocument());
    expect(mermaid.render).toHaveBeenCalledWith(expect.any(String), "graph LR\n  A --> B");
  });

  it("promotes fenced Mermaid code blocks to diagrams", async () => {
    const mermaid = (await import("mermaid")).default;
    vi.mocked(mermaid.render).mockClear();
    const components = getDefaultMdxComponents();
    const Pre = components.pre;
    const Figure = components.figure;
    const { container } = render(
      <Figure data-rehype-pretty-code-figure="">
        <Pre data-language="mermaid">
          <code>{"graph LR\n  A --> B"}</code>
        </Pre>
      </Figure>
    );

    await waitFor(() =>
      expect(container.querySelector(".emcydocs-mermaid")).toBeInTheDocument()
    );
    expect(container.querySelector("[data-rehype-pretty-code-figure]")).not.toBeInTheDocument();
    await waitFor(() => expect(container.querySelector("svg")).toBeInTheDocument());
    expect(mermaid.render).toHaveBeenCalledWith(expect.any(String), "graph LR\n  A --> B");
  });

  it("restores prose list markers after CSS resets", () => {
    const styles = readFileSync(join(process.cwd(), "src/styles.css"), "utf8");

    expect(styles).toMatch(/\.emcydocs-prose ul\s*\{[^}]*list-style-type:\s*disc;/s);
    expect(styles).toMatch(/\.emcydocs-prose ol\s*\{[^}]*list-style-type:\s*decimal;/s);
  });
});
