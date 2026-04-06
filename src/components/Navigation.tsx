"use client";

import { useMemo } from "react";
import { useGameProgress } from "@/lib/useGameProgress";
import { Class } from "@/lib/types";

type TabValue =
  | "home"
  | "classes"
  | "bosses"
  | "items"
  | "progress"
  | "settings";

interface NavigationProps {
  children?: React.ReactNode;
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
}

export function Navigation({
  children,
  activeTab = "home",
  onTabChange,
}: NavigationProps) {
  const { progress, toggleTheme, setPreferredClass, restartSetup } =
    useGameProgress();

  const tabs: { id: TabValue; label: string }[] = useMemo(
    () => [
      { id: "home", label: "Inicio" },
      { id: "classes", label: "Clases" },
      { id: "bosses", label: "Bosses" },
      { id: "items", label: "Items" },
      { id: "progress", label: "Progreso" },
      { id: "settings", label: "Ajustes" },
    ],
    [],
  );

  const classOptions: { value: Class; label: string }[] = useMemo(
    () => [
      { value: "melee", label: "Melee" },
      { value: "ranger", label: "Ranger" },
      { value: "mage", label: "Mage" },
      { value: "summon", label: "Summon" },
      { value: "rogue", label: "Rogue" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      <header className="border-b border-(--border) bg-(--card-bg)">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-(--primary-light)">
                Calamity Guide
              </h1>
              <p className="text-xs text-(--foreground)/60">
                Terraria Calamity progression assistant
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded border border-(--border) bg-(--background)"
              >
                Tema: {progress?.theme === "dark" ? "Claro" : "Oscuro"}
              </button>
              <button
                onClick={restartSetup}
                className="px-3 py-2 rounded border border-(--border) bg-(--background)"
              >
                Reiniciar Startup
              </button>
            </div>
          </div>

          <nav className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-3 py-2 rounded border text-sm font-semibold ${
                  activeTab === tab.id
                    ? "bg-(--primary) text-white border-(--primary)"
                    : "bg-(--background) border-(--border)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {classOptions.map((classOpt) => (
              <button
                key={classOpt.value}
                onClick={() => setPreferredClass(classOpt.value)}
                className={`px-2 py-2 rounded border text-xs font-bold ${
                  progress?.preferredClass === classOpt.value
                    ? "bg-(--accent) text-white border-(--accent)"
                    : "bg-(--background) border-(--border)"
                }`}
              >
                {classOpt.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-(--foreground)/70 flex flex-wrap gap-3">
            <span>
              Bosses derrotados: {progress?.defeatedBosses.length ?? 0}/16
            </span>
            <span>
              Mundo:{" "}
              {progress?.worldEvil === "crimson" ? "Crimson" : "Corrupción"}
            </span>
            <span>Dificultad: {progress?.gameDifficultyMode}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
