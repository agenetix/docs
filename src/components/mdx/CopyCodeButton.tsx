"use client";

import { useState } from "react";

export default function CopyCodeButton({
  value,
}: {
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy code", value);
    }
  };

  return (
    <button
      type="button"
      className="emcydocs-codeblock-copy"
      onClick={copy}
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
