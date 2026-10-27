import type { DocsLayoutCommonProps } from "../types.js";
import DocsShell from "./DocsShell.js";

export default function DocsLayout(props: DocsLayoutCommonProps) {
  return <DocsShell {...props} />;
}
