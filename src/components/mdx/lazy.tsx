import type { ComponentType } from "react";
import dynamic from "next/dynamic";

type AnyComponent = ComponentType<any>;

export const LazyMermaid = dynamic(() => import("./Mermaid.js")) as AnyComponent;

export const LazyTabs = dynamic(() => import("./Tabs.js")) as AnyComponent;

export const LazyTabsList = dynamic(() =>
  import("./Tabs.js").then((module) => ({ default: module.TabsList }))
) as AnyComponent;

export const LazyTabsTrigger = dynamic(() =>
  import("./Tabs.js").then((module) => ({ default: module.TabsTrigger }))
) as AnyComponent;

export const LazyTabsContent = dynamic(() =>
  import("./Tabs.js").then((module) => ({ default: module.TabsContent }))
) as AnyComponent;

export const LazyAccordion = dynamic(() => import("./Accordion.js")) as AnyComponent;

export const LazyAccordionItem = dynamic(() =>
  import("./Accordion.js").then((module) => ({ default: module.AccordionItem }))
) as AnyComponent;
