"use client";

import React from "react";

interface EducationalCardProps {
  icon?: string;
  title: string;
  content: string;
  hint?: string;
  variant?: "info" | "success" | "warning" | "danger";
}

const variantColors: Record<
  string,
  { bg: string; border: string; title: string }
> = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-l-4 border-l-blue-500",
    title: "text-blue-600 dark:text-blue-400",
  },
  success: {
    bg: "bg-green-500/10",
    border: "border-l-4 border-l-green-500",
    title: "text-green-600 dark:text-green-400",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-l-4 border-l-yellow-500",
    title: "text-yellow-600 dark:text-yellow-400",
  },
  danger: {
    bg: "bg-red-500/10",
    border: "border-l-4 border-l-red-500",
    title: "text-red-600 dark:text-red-400",
  },
};

export function EducationalCard({
  icon,
  title,
  content,
  hint,
  variant = "info",
}: EducationalCardProps) {
  const colors = variantColors[variant];

  return (
    <div className={`card ${colors.border} ${colors.bg}`}>
      <div className="flex gap-3">
        {icon ? <div className="text-2xl shrink-0">{icon}</div> : null}
        <div className="flex-1">
          <h4 className={`font-bold ${colors.title} mb-1`}>{title}</h4>
          <p className="text-sm text-(--foreground)/80 mb-2">{content}</p>
          {hint && (
            <div className="text-xs text-(--foreground)/60 italic bg-(--background) p-2 rounded border border-dashed border-(--border)">
              {hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
