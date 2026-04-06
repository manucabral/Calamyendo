'use client';

import { useEffect, useState } from 'react';
import { useGameProgress } from '@/lib/useGameProgress';
import { BOSSES } from '@/data/bosses';
import { EducationalCard } from './EducationalCard';
import { EquipmentTracker } from './EquipmentTracker';
import { ItemWikiIcon } from './ItemWikiIcon';
import { Boss, Class } from '@/lib/types';

const CLASS_ORDER: Class[] = ['melee', 'ranger', 'mage', 'summon', 'rogue'];
const CLASS_META: Record<Class, { label: string; color: string }> = {
  melee: { label: 'Melee', color: 'var(--primary-light)' },
  ranger: { label: 'Ranger', color: 'var(--accent-light)' },
  mage: { label: 'Mage', color: 'var(--secondary-light)' },
  summon: { label: 'Summon', color: 'var(--success)' },
  rogue: { label: 'Rogue', color: 'var(--warning)' },
};

export function WhatNext() {
  const { progress, isBossDefeated } = useGameProgress();
  const [selectedClass, setSelectedClass] = useState<Class>('melee');

  useEffect(() => {
    if (!progress) return;
    setSelectedClass(progress.preferredClass);
  }, [progress]);

  if (!progress) return null;

  const defeatedSet = new Set(progress.defeatedBosses);
  const allBosses = Object.values(BOSSES);
  const stageIndex: Record<string, number> = {
    'pre-hardmode': 0,
    'early-hardmode': 1,
    'mid-hardmode': 2,
    'late-hardmode': 3,
    'post-moon-lord': 4,
  };
  const difficultyRank: Record<Boss['difficulty'], number> = {
    easy: 0,
    medium: 1,
    hard: 2,
    extreme: 3,
  };

  const availableBosses = allBosses.filter((boss) => {
    if (defeatedSet.has(boss.id)) return false;
    return boss.prerequisites.every((req) => defeatedSet.has(req));
  });

  let nextBoss: Boss | null = null;
  if (availableBosses.length > 0) {
    const sorted = [...availableBosses].sort((a, b) => {
      const stageDelta = stageIndex[a.stage] - stageIndex[b.stage];
      if (stageDelta !== 0) return stageDelta;

      if (progress.progressFocus === 'gear-first') {
        return b.drops.length - a.drops.length;
      }

      if (progress.progressFocus === 'boss-rush') {
        return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
      }

      return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
    });

    nextBoss = sorted[0] ?? null;
  }

  if (!nextBoss) {
    // Fallback for incomplete data relationships.
    nextBoss = allBosses.find((boss) => !defeatedSet.has(boss.id)) ?? null;
  }

  const perClassCounts = !nextBoss
    ? ([] as { gameClass: Class; total: number }[])
    : CLASS_ORDER.map((gameClass) => {
        const rec = nextBoss.recommendations[gameClass];
        const total = rec.weapons.length + rec.armor.length + rec.accessories.length + rec.potions.length;
        return { gameClass, total };
      });

  if (!nextBoss) {
    return (
      <EducationalCard
        icon="🏆"
        title="¡Eres el Campeón!"
        content="Has derrotado todos los bosses principales del Calamity Mod. Felicidades, eres un experto. Desafíate a ti mismo con dificultades superiores o mods adicionales."
        variant="success"
      />
    );
  }

  const recommendations = nextBoss.recommendations[selectedClass];
  const evilSuggestion =
    progress.worldEvil === 'crimson'
      ? 'Tu mundo es Crimson: prioriza rutas de farmeo Crimson (ej: Crimson Armor y drops de bioma) cuando existan equivalentes.'
      : 'Tu mundo es Corrupción: prioriza rutas de farmeo de Corrupción y materiales de esa variante cuando existan equivalentes.';
  const difficultySuggestion =
    progress.gameDifficultyMode === 'death' || progress.gameDifficultyMode === 'revengeance'
      ? 'Dificultad alta detectada: entra al boss con pociones activas y una arena amplia antes de intentar kill.'
      : 'Dificultad estándar: mantén buff food + pociones básicas y enfócate en posicionamiento.';

  return (
    <div className="space-y-6 animate-stagger">
      {/* Main Boss Challenge */}
      <div className="card border-l-4 border-l-[var(--primary-light)] bg-gradient-to-r from-[var(--primary)]/10 to-transparent">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-[var(--primary-light)] mb-1">¿Qué hacer ahora?</h2>
            <p className="text-[var(--foreground)]/70">Tu próximo desafío recomendado</p>
          </div>
          <span className={`badge ${nextBoss.difficulty}`}>
            {nextBoss.difficulty.toUpperCase()}
          </span>
        </div>

        <div className="bg-[var(--background)] p-4 rounded border border-[var(--border)] mb-4">
          <h3 className="text-2xl font-bold text-[var(--accent-light)] mb-2">{nextBoss.name}</h3>
          <p className="text-sm text-[var(--foreground)]/80">{nextBoss.description}</p>
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">
              Recomendaciones por clase
            </p>
            <button
              className="text-xs font-bold px-3 py-1.5 rounded bg-[var(--secondary)]/15 hover:bg-[var(--secondary)]/30 transition-colors"
              onClick={() => setSelectedClass(progress.preferredClass)}
            >
              Usar mi clase ({CLASS_META[progress.preferredClass].label})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {CLASS_ORDER.map((gameClass) => {
              const active = selectedClass === gameClass;
              return (
                <button
                  key={gameClass}
                  onClick={() => setSelectedClass(gameClass)}
                  className={`px-3 py-2 rounded border transition-all text-left ${
                    active
                      ? 'border-transparent text-white shadow-md scale-[1.02]'
                      : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary-light)]'
                  }`}
                  style={
                    active
                      ? {
                          background: `linear-gradient(135deg, ${CLASS_META[gameClass].color}, var(--primary))`,
                        }
                      : undefined
                  }
                >
                  <div className="text-sm font-bold">{CLASS_META[gameClass].label}</div>
                  <div className={`text-[10px] mt-1 ${active ? 'text-white/80' : 'text-[var(--foreground)]/60'}`}>
                    {perClassCounts.find((entry) => entry.gameClass === gameClass)?.total ?? 0} items sugeridos
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Boss Prerequisites */}
        {nextBoss.prerequisites.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              ✓ Requiere Derrotar Antes:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {nextBoss.prerequisites.map((prereqId) => {
                const prereq = BOSSES[prereqId];
                const isDefeated = isBossDefeated(prereqId);
                return (
                  <div
                    key={prereqId}
                    className={`text-xs p-2 rounded bg-[var(--border)] ${
                      isDefeated ? 'line-through text-[var(--success)]' : 'text-[var(--foreground)]/70'
                    }`}
                  >
                    {isDefeated ? '✓' : '○'} {prereq?.name || prereqId}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drops */}
        {nextBoss.drops.length > 0 && (
          <div className="bg-[var(--accent)]/10 p-3 rounded border border-[var(--accent)]/30">
            <p className="text-xs font-bold text-[var(--accent-light)] mb-2 uppercase">Drops de este boss:</p>
            <ul className="grid grid-cols-2 gap-1">
              {nextBoss.drops.map((drop, idx) => (
                <li key={idx} className="text-xs text-[var(--foreground)]/80 flex items-center gap-2">
                  <ItemWikiIcon itemName={drop} size={16} fallbackIcon="•" />
                  <span>{drop}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Class-specific strategy */}
      <EducationalCard
        title={`Estrategia para ${CLASS_META[selectedClass].label.toUpperCase()}`}
        content={recommendations.tips}
        hint={`Puedes cambiar entre clases arriba para comparar estrategias sin salir de esta pantalla.`}
        variant="info"
      />

      <EducationalCard
        title="Consideraciones de tu Startup"
        content={`${evilSuggestion} ${difficultySuggestion}`}
        hint={`Perfil: ${progress.playerExperience} · Enfoque: ${progress.progressFocus}`}
        variant="warning"
      />

      {/* Item Recommendations - Interactive Tracker */}
      <EquipmentTracker
        recommendedItems={{
          weapons: recommendations.weapons,
          armor: recommendations.armor,
          accessories: recommendations.accessories,
          potions: recommendations.potions,
        }}
        bossName={nextBoss.name}
        className={selectedClass}
      />

      {/* Motivational tip */}
      <EducationalCard
        title="Pro Tip: Construye una Arena"
        content="Antes de luchar, construye un arena con plataformas para movimiento. Usa fondo para activar puertas de escape y ten un punto de salida seguro arriba."
        variant="success"
      />
    </div>
  );
}
