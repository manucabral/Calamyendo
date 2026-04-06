'use client';

import { useMemo, useState } from 'react';
import {
  Class,
  WorldEvil,
  GameDifficultyMode,
  ProgressFocus,
  PlayerExperience,
} from '@/lib/types';

interface StartupWizardProps {
  onComplete: (payload: {
    preferredClass: Class;
    worldEvil: WorldEvil;
    gameDifficultyMode: GameDifficultyMode;
    progressFocus: ProgressFocus;
    playerExperience: PlayerExperience;
    theme: 'light' | 'dark';
  }) => void;
}

const CLASS_OPTIONS: Array<{ value: Class; label: string; help: string }> = [
  { value: 'melee', label: 'Melee', help: 'Resistencia alta y combate cercano.' },
  { value: 'ranger', label: 'Ranger', help: 'DPS estable desde distancia.' },
  { value: 'mage', label: 'Mage', help: 'Daño explosivo usando maná.' },
  { value: 'summon', label: 'Summon', help: 'Minions + control de posicionamiento.' },
  { value: 'rogue', label: 'Rogue', help: 'Movilidad y daño de precisión.' },
];

export function StartupWizard({ onComplete }: StartupWizardProps) {
  const [preferredClass, setPreferredClass] = useState<Class>('melee');
  const [worldEvil, setWorldEvil] = useState<WorldEvil>('corruption');
  const [gameDifficultyMode, setGameDifficultyMode] = useState<GameDifficultyMode>('expert');
  const [progressFocus, setProgressFocus] = useState<ProgressFocus>('balanced');
  const [playerExperience, setPlayerExperience] = useState<PlayerExperience>('beginner');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const startupSummary = useMemo(() => {
    const classLabel = CLASS_OPTIONS.find((c) => c.value === preferredClass)?.label ?? preferredClass;
    const evilLabel = worldEvil === 'corruption' ? 'Corrupción' : 'Crimson';
    return `${classLabel} • ${evilLabel} • ${gameDifficultyMode}`;
  }, [preferredClass, worldEvil, gameDifficultyMode]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card border-2 border-[var(--primary-light)] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10">
          <h1 className="text-4xl font-bold text-[var(--primary-light)] mb-2">Startup de la guía</h1>
          <p className="text-sm text-[var(--foreground)]/80">
            Configura una vez tu partida y desde ahora te recomendaremos bosses, equipo y prioridades según tu perfil.
          </p>
          <p className="mt-3 text-xs font-bold text-[var(--secondary-light)]">Setup actual: {startupSummary}</p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-bold text-[var(--secondary-light)]">1) Elige tu clase principal</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {CLASS_OPTIONS.map((opt) => {
              const active = preferredClass === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPreferredClass(opt.value)}
                  className={`text-left p-3 rounded border ${
                    active
                      ? 'bg-[var(--accent)]/20 border-[var(--accent)]'
                      : 'bg-[var(--card-bg)] border-[var(--border)]'
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <p className="text-xs text-[var(--foreground)]/70 mt-1">{opt.help}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card space-y-3">
            <h2 className="text-xl font-bold text-[var(--secondary-light)]">2) Tipo de mundo</h2>
            <label className="flex items-center gap-3 p-2 rounded border border-[var(--border)]">
              <input
                type="radio"
                name="worldEvil"
                checked={worldEvil === 'corruption'}
                onChange={() => setWorldEvil('corruption')}
              />
              <span className="font-semibold">Corrupción</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded border border-[var(--border)]">
              <input
                type="radio"
                name="worldEvil"
                checked={worldEvil === 'crimson'}
                onChange={() => setWorldEvil('crimson')}
              />
              <span className="font-semibold">Crimson</span>
            </label>
            <p className="text-xs text-[var(--foreground)]/70">
              Ajustaremos tips y prioridades de farmeo según tu corrupción.
            </p>
          </div>

          <div className="card space-y-3">
            <h2 className="text-xl font-bold text-[var(--secondary-light)]">3) Dificultad</h2>
            <select
              value={gameDifficultyMode}
              onChange={(e) => setGameDifficultyMode(e.target.value as GameDifficultyMode)}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)]"
            >
              <option value="normal">Normal</option>
              <option value="expert">Expert</option>
              <option value="revengeance">Revengeance</option>
              <option value="death">Death</option>
            </select>
            <p className="text-xs text-[var(--foreground)]/70">
              A mayor dificultad, más énfasis en arena, pociones y accesorios defensivos.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card space-y-3">
            <h2 className="text-xl font-bold text-[var(--secondary-light)]">4) Enfoque de progreso</h2>
            <select
              value={progressFocus}
              onChange={(e) => setProgressFocus(e.target.value as ProgressFocus)}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)]"
            >
              <option value="balanced">Balanceado</option>
              <option value="boss-rush">Boss Rush</option>
              <option value="gear-first">Primero equipamiento</option>
            </select>
          </div>

          <div className="card space-y-3">
            <h2 className="text-xl font-bold text-[var(--secondary-light)]">5) Tu experiencia</h2>
            <select
              value={playerExperience}
              onChange={(e) => setPlayerExperience(e.target.value as PlayerExperience)}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)]"
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="veteran">Veterano</option>
            </select>
            <p className="text-xs text-[var(--foreground)]/70">
              Ajusta la cantidad de consejos y el nivel de detalle estratégico.
            </p>
          </div>
        </div>

        <div className="card flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--accent-light)]">Tema visual</h3>
            <p className="text-xs text-[var(--foreground)]/70">Puedes cambiarlo luego en Ajustes.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-2 rounded border ${
                theme === 'light' ? 'bg-[var(--warning)]/20 border-[var(--warning)]' : 'border-[var(--border)]'
              }`}
            >
              Claro
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-2 rounded border ${
                theme === 'dark' ? 'bg-[var(--accent)]/20 border-[var(--accent)]' : 'border-[var(--border)]'
              }`}
            >
              Oscuro
            </button>
          </div>
        </div>

        <div className="card">
          <button
            onClick={() =>
              onComplete({
                preferredClass,
                worldEvil,
                gameDifficultyMode,
                progressFocus,
                playerExperience,
                theme,
              })
            }
            className="w-full px-4 py-3 rounded font-bold text-white bg-[var(--primary)]"
          >
            Empezar con esta configuración
          </button>
        </div>
      </div>
    </div>
  );
}
