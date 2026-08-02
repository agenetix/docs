import type { ReactNode } from "react";

interface StepsProps {
  children: ReactNode;
}

export default function Steps({ children }: StepsProps) {
  return <div className="agenetixdocs-steps">{children}</div>;
}

interface StepProps {
  title: string;
  children: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="agenetixdocs-step">
      <h4 className="agenetixdocs-step-title">{title}</h4>
      <div className="agenetixdocs-step-content">{children}</div>
    </div>
  );
}
