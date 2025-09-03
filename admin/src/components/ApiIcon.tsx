import React from "react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof Icons;

interface ApiIconProps extends LucideProps {
  apiName: string;
}

function apiNameToLucideName(apiName: string): IconName | null {
  const pascal = apiName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return pascal in Icons ? (pascal as IconName) : null;
}

export function ApiIcon({ apiName, ...props }: ApiIconProps) {
  const lucideName = apiNameToLucideName(apiName);
  const LucideIcon = lucideName ? Icons[lucideName] as React.ComponentType<LucideProps> : Icons.HelpCircle;

  return <LucideIcon {...props} />;
}