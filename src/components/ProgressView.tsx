'use client';

import { useGameProgress } from '@/lib/useGameProgress';
import { PROGRESSION_STAGES } from '@/data/progression';
import { BOSSES } from '@/data/bosses';

export function ProgressView() {
  const { progress, getStageCompletion } = useGameProgress();

  if (!progress) return null;

  const stages = Object.values(PROGRESSION_STAGES);
  const totalBosses = Object.values(BOSSES).length;
  const defeatedCount = progress.defeatedBosses.length;
  const overallPercentage = Math.round((defeatedCount / totalBosses) * 100);

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-[var(--accent-light)]">
        <h2 className="text-3xl font-bold text-[var(--accent-light)] mb-6">Tu progreso</h2>

        {/* Main progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[var(--foreground)]">Progreso General</span>
            <span className="text-2xl font-bold text-[var(--primary-light)]">{overallPercentage}%</span>
          </div>
          <div className="w-full h-8 bg-[var(--border)] rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-500 flex items-center justify-center"
              style={{ width: `${overallPercentage}%` }}
            >
              {overallPercentage > 10 && (
                <span className="text-xs font-bold text-white">{defeatedCount}/{totalBosses}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border)]">
            <p className="text-3xl font-bold text-[var(--success)]">{defeatedCount}</p>
            <p className="text-xs text-[var(--foreground)]/60 mt-1">Bosses Derrotados</p>
          </div>
          <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border)]">
            <p className="text-3xl font-bold text-[var(--warning)]">{totalBosses - defeatedCount}</p>
            <p className="text-xs text-[var(--foreground)]/60 mt-1">Bosses Restantes</p>
          </div>
          <div className="p-4 bg-[var(--card-bg)] rounded border border-[var(--border)]">
            <p className="text-3xl font-bold text-[var(--primary-light)]">{progress.completedItems.length}</p>
            <p className="text-xs text-[var(--foreground)]/60 mt-1">Items Colectados</p>
          </div>
        </div>
      </div>

      {/* Stage progression timeline */}
      <div className="card">
        <h3 className="text-2xl font-bold text-[var(--secondary-light)] mb-6">Etapas de progresión</h3>

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const completion = getStageCompletion(stage.bosses);
            const isCompleted = completion === 100;
            const nextStageId = stages[index + 1]?.id;
            const isCurrentStage = progress.currentStage === stage.id;

            return (
              <div key={stage.id} className="relative">
                {/* Connection line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-12 bg-[var(--border)] -z-10" />
                )}

                <div
                  className={`card border-2 transition-all ${
                    isCurrentStage
                      ? 'border-[var(--primary-light)] bg-orange-900/10'
                      : 'border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Stage indicator */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                        isCompleted
                          ? 'bg-[var(--success)] text-white'
                          : isCurrentStage
                          ? 'bg-[var(--primary)] text-white animate-pulse-glow'
                          : 'bg-[var(--border)] text-[var(--foreground)]'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    {/* Stage info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-[var(--accent-light)]">
                            {stage.name}
                          </h4>
                          <p className="text-xs text-[var(--foreground)]/60 mt-1">
                            {stage.description}
                          </p>
                        </div>
                        <span className="badge">{completion}%</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-4 bg-[var(--border)] rounded-sm overflow-hidden mb-3">
                        <div
                          className={`h-full transition-all ${
                            isCompleted
                              ? 'bg-[var(--success)]'
                              : 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]'
                          }`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>

                      {/* Bosses in stage */}
                      <div className="flex flex-wrap gap-2">
                        {stage.bosses.map((bossId) => {
                          const boss = BOSSES[bossId];
                          const isDefeated = progress.defeatedBosses.includes(bossId);

                          return (
                            <span
                              key={bossId}
                              className={`text-xs px-2 py-1 rounded transition-all ${
                                isDefeated
                                  ? 'bg-[var(--success)] text-white line-through'
                                  : 'bg-[var(--border)] text-[var(--foreground)]'
                              }`}
                              title={boss?.name}
                            >
                              {boss?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement badges */}
      <div className="card">
        <h3 className="text-2xl font-bold text-[var(--secondary-light)] mb-4">
          Logros especiales
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { condition: defeatedCount >= 5, label: '5/16', title: 'Primeros Pasos' },
            { condition: defeatedCount >= 10, label: '10/16', title: 'Veterano' },
            { condition: defeatedCount === 16, label: 'MAX', title: 'Maestro del Calamity' },
            { condition: overallPercentage === 100, label: '100%', title: 'Completionista' },
          ].map((achievement, idx) => (
            <div
              key={idx}
              className={`p-4 rounded border-2 text-center transition-all ${
                achievement.condition
                  ? 'border-[var(--success)] bg-green-900/20'
                  : 'border-[var(--border)] opacity-50'
              }`}
            >
              <p className="text-xs font-bold mt-1">{achievement.label}</p>
              <p className="text-xs text-[var(--foreground)]/60 mt-0.5">{achievement.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
