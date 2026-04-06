"use client";

import { useState, useMemo } from "react";
import { useGameProgress } from "@/lib/useGameProgress";
import { BOSSES } from "@/data/bosses";
import { ItemWikiIcon } from "./ItemWikiIcon";

interface BossListProps {
  filterStage?: string;
  searchQuery?: string;
}

export function BossList({ filterStage, searchQuery = "" }: BossListProps) {
  const { progress, isBossDefeated, markBossDefeated, unmarkBossDefeated } =
    useGameProgress();
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);

  const filteredBosses = useMemo(() => {
    const allBosses = Object.values(BOSSES);

    return allBosses
      .filter((boss) => {
        if (filterStage && boss.stage !== filterStage) return false;
        if (
          searchQuery &&
          !boss.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const stageOrder: Record<string, number> = {
          "pre-hardmode": 1,
          "early-hardmode": 2,
          "mid-hardmode": 3,
          "late-hardmode": 4,
          "post-moon-lord": 5,
        };
        return (stageOrder[a.stage] || 0) - (stageOrder[b.stage] || 0);
      });
  }, [filterStage, searchQuery]);

  const selectedBossData = selectedBoss ? BOSSES[selectedBoss] : null;

  if (!progress) return null;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Boss grid */}
      <div className="md:col-span-2">
        <div className="grid gap-3">
          {filteredBosses.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-(--foreground)/60">No se encontraron bosses</p>
            </div>
          ) : (
            filteredBosses.map((boss) => {
              const isDefeated = isBossDefeated(boss.id);
              const difficultyColors: Record<string, string> = {
                easy: "border-l-green-500",
                medium: "border-l-yellow-500",
                hard: "border-l-red-500",
                extreme: "border-l-purple-600",
              };

              return (
                <div
                  key={boss.id}
                  onClick={() => setSelectedBoss(boss.id)}
                  className={`card border-l-4 cursor-pointer ${
                    difficultyColors[boss.difficulty]
                  } ${selectedBoss === boss.id ? "ring-2 ring-(--primary-light)" : ""} ${
                    isDefeated
                      ? "opacity-70 bg-linear-to-r from-green-900/10 to-transparent"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 flex items-start gap-2">
                      <ItemWikiIcon
                        itemName={boss.name}
                        size={28}
                        fallbackIcon="•"
                        className="mt-0.5"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-(--accent-light)">
                          {isDefeated ? "Derrotado" : "Pendiente"} · {boss.name}
                        </h3>
                        <p className="text-xs text-(--foreground)/60">
                          {boss.stage}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${boss.difficulty}`}>
                      {boss.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-(--foreground)/70 mb-3">
                    {boss.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDefeated) {
                        unmarkBossDefeated(boss.id);
                      } else {
                        markBossDefeated(boss.id);
                      }
                    }}
                    className={`btn text-xs w-full ${
                      isDefeated ? "btn-secondary" : "btn-primary"
                    }`}
                  >
                    {isDefeated ? "Derrotado" : "Marcar derrotado"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Boss details panel */}
      {selectedBossData && (
        <div className="card border-(--accent-light) animate-slide-in-up">
          <div className="flex items-center gap-3 mb-4">
            <ItemWikiIcon
              itemName={selectedBossData.name}
              size={34}
              fallbackIcon="•"
            />
            <h3 className="text-2xl font-bold text-(--primary-light) mb-0">
              {selectedBossData.name}
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-(--secondary-light) mb-1">
                Descripción
              </p>
              <p className="text-(--foreground)/70">
                {selectedBossData.description}
              </p>
            </div>

            {selectedBossData.drops.length > 0 && (
              <div>
                <p className="font-bold text-(--secondary-light) mb-2">Drops</p>
                <ul className="list-disc list-inside space-y-1 text-(--foreground)/70">
                  {selectedBossData.drops.map((drop, idx) => (
                    <li key={idx} className="list-none flex items-center gap-2">
                      <ItemWikiIcon
                        itemName={drop}
                        size={16}
                        fallbackIcon="•"
                      />
                      <span>{drop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedBossData.prerequisites.length > 0 && (
              <div>
                <p className="font-bold text-(--secondary-light) mb-2">
                  Pre-requisitos
                </p>
                <div className="space-y-1">
                  {selectedBossData.prerequisites.map((prereqId) => {
                    const prereq = BOSSES[prereqId];
                    return (
                      <div
                        key={prereqId}
                        className={`text-xs p-2 rounded bg-(--border) ${
                          isBossDefeated(prereqId)
                            ? "line-through text-(--success)"
                            : "text-(--foreground)/70"
                        }`}
                      >
                        {isBossDefeated(prereqId) ? "✓" : "○"}{" "}
                        {prereq?.name || prereqId}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Class recommendations preview */}
            <div>
              <p className="font-bold text-(--secondary-light) mb-2">
                Recomendaciones para {progress.preferredClass.toUpperCase()}
              </p>
              <div className="bg-(--background) p-3 rounded border border-(--border) text-xs">
                <p className="text-(--foreground)/80 italic">
                  {
                    selectedBossData.recommendations[progress.preferredClass]
                      .tips
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
