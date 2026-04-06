"use client";

import React from "react";
import { Class } from "@/lib/types";

interface ClassGuideProps {
  className: Class;
  icon: string;
  description: string;
  playStyle: string;
  strengths: string[];
  weaknesses: string[];
}

const classEmojis: Record<Class, string> = {
  melee: "⚔️",
  ranger: "🏹",
  mage: "✨",
  summon: "👻",
  rogue: "🗡️",
};

const classLegend: Record<Class, string> = {
  melee: "Combatiente Cercano",
  ranger: "Tirador a Distancia",
  mage: "Lanzador de Magia",
  summon: "Invocador",
  rogue: "Pícaros Furtivos",
};

export function ClassGuide({
  className,
  description,
  playStyle,
  strengths,
  weaknesses,
}: ClassGuideProps) {
  const emoji = classEmojis[className];
  const title = classLegend[className];

  return (
    <div className="card border-l-4 border-l-(--accent-light) hover:border-l-(--primary-light)">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{emoji}</div>
        <div className="flex-1">
          <h3 className="font-bold text-(--accent-light)">{title}</h3>
          <p className="text-sm text-(--foreground)/70">{description}</p>
        </div>
      </div>

      <div className="bg-(--background) p-3 rounded mb-4 border border-(--border)">
        <p className="text-sm font-semibold text-(--secondary-light) mb-1">
          Estilo de Juego
        </p>
        <p className="text-sm text-(--foreground)/80 italic">{playStyle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-(--success) mb-2 uppercase tracking-wide">
            💪 Fortalezas
          </p>
          <ul className="space-y-1">
            {strengths.map((strength, idx) => (
              <li key={idx} className="text-xs text-(--foreground)/70">
                • {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold text-(--danger) mb-2 uppercase tracking-wide">
            ⚠️ Debilidades
          </p>
          <ul className="space-y-1">
            {weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-xs text-(--foreground)/70">
                • {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
