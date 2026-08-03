import type { ReactNode } from "react";

export function StickyAside({
  children,
  top = 88,
  className,
}: {
  children: ReactNode;
  top?: number;
  className?: string;
}) {
  return (
    <div className={["emcydocs-sticky-aside", className ?? ""].filter(Boolean).join(" ")}>
      <div style={{ position: "sticky", top }}>{children}</div>
    </div>
  );
}
