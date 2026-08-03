import type { ReactNode } from "react";

interface StepsProps {
  children: ReactNode;
}

export default function Steps({ children }: StepsProps) {
  return <div className="emcydocs-steps">{children}</div>;
}

interface StepProps {
  title: string;
  children: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="emcydocs-step">
      <h4 className="emcydocs-step-title">{title}</h4>
      <div className="emcydocs-step-content">{children}</div>
    </div>
  );
}
