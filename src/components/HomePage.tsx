'use client';

import React from 'react';
import { ProgressTimeline } from './ProgressTimeline';
import { EducationalCard } from './EducationalCard';
import { WhatNext } from './WhatNext';
import { CurrentBuildSummary } from './CurrentBuildSummary';
import { useGameProgress } from '@/lib/useGameProgress';

interface ProgressStep {
  label: string;
  completed: boolean;
  description?: string;
}

export function HomePage() {
  const { progress } = useGameProgress();

  if (!progress) return null;

  const completedBosses = progress.defeatedBosses.length;
  const totalBosses = 16;
  const progressPercentage = Math.round((completedBosses / totalBosses) * 100);

  const progressSteps: ProgressStep[] = [
    {
      label: 'Pre-Hardmode',
      completed: completedBosses >= 4,
      description: '4 bosses iniciales para aprender mecánicas',
    },
    {
      label: 'Early Hardmode',
      completed: completedBosses >= 7,
      description: '3 bosses para transición a Hardmode',
    },
    {
      label: 'Mid Hardmode',
      completed: completedBosses >= 12,
      description: '5 bosses en la mitad del progreso',
    },
    {
      label: 'Late Hardmode',
      completed: completedBosses >= 18,
      description: '6 bosses antes de Moon Lord',
    },
    {
      label: 'Post Moon Lord',
      completed: completedBosses >= 19,
      description: 'Yharon - El verdadero reto',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="card border-2 border-[var(--primary-light)] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10">
        <h1 className="text-4xl font-bold mb-2">Bienvenido a Calamity</h1>
        <p className="text-lg text-[var(--foreground)]/80 mb-4">
          Tu guía completa para dominar el Calamity Mod. Aprenderás qué bosses derrotar, qué equipo necesitar y cómo
          progresar como {progress.preferredClass.toUpperCase()}.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold text-[var(--accent-light)] mb-3">Tu progreso general</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Bosses Derrotados</span>
                <span className="badge info">{progressPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-[var(--foreground)]/60 mt-1">
                {completedBosses} de {totalBosses} bosses
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-[var(--accent-light)] mb-3">Etapa actual</h3>
          <div className="text-lg font-bold text-[var(--secondary-light)] capitalize mb-2">
            {progress.currentStage.replace('-', ' ')}
          </div>
          <p className="text-sm text-[var(--foreground)]/70">
            Tienes acceso a bosses diseñados para tu nivel actual. Completa todos antes de avanzar.
          </p>
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-bold text-[var(--accent-light)] mb-3">Perfil de startup</h3>
          <div className="grid md:grid-cols-4 gap-2 text-sm">
            <div className="p-2 rounded bg-[var(--border)]/40">
              <span className="font-bold">Clase:</span> {progress.preferredClass.toUpperCase()}
            </div>
            <div className="p-2 rounded bg-[var(--border)]/40">
              <span className="font-bold">Mundo:</span> {progress.worldEvil === 'crimson' ? 'Crimson' : 'Corrupción'}
            </div>
            <div className="p-2 rounded bg-[var(--border)]/40">
              <span className="font-bold">Dificultad:</span> {progress.gameDifficultyMode}
            </div>
            <div className="p-2 rounded bg-[var(--border)]/40">
              <span className="font-bold">Enfoque:</span> {progress.progressFocus}
            </div>
          </div>
        </div>
      </div>

      {/* Progression Timeline */}
      <div className="card">
        <h3 className="font-bold text-[var(--accent-light)] mb-4">Mapa de progresión</h3>
        <ProgressTimeline
          steps={progressSteps}
          currentStep={Math.min(progressSteps.length - 1, Math.floor(completedBosses / 4))}
        />
      </div>

      {/* Educational Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-stagger">
        <EducationalCard
          title="¿Por dónde empiezo?"
          content="Dirígete a la sección 'Bosses' para ver la lista ordenada de enemigos. Cada boss tiene recomendaciones específicas para tu clase."
          hint="Haz clic en un boss para ver sus drops, debilidades y estrategia recomendada."
          variant="info"
        />

        <EducationalCard
          title="Personaliza tu Experiencia"
          content="Ve a 'Configuración' para cambiar tu clase favorita o el tema (claro/oscuro). Esto ajustará todas las recomendaciones."
          variant="success"
        />

        <EducationalCard
          title="La Sección '¿Qué Hacer Ahora?'"
          content="Marca bosses como derrotados y esta sección te sugerirá automáticamente el próximo paso junto con equipo recomendado."
          variant="success"
        />

        <EducationalCard
          title="Usa los Filtros"
          content="En 'Bosses', puedes filtrar por etapa, clase o buscar por nombre. En 'Items' puedes ver equipo recomendado por progresión."
          variant="info"
        />
      </div>

      {/* What Next Section */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--secondary-light)] mb-4">¿Qué hacer ahora?</h2>
        <WhatNext />
      </div>

      {/* Current Build Summary */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--accent-light)] mb-4">Tu build actual</h2>
        <CurrentBuildSummary />
      </div>

      {/* Call to Action */}
      <div className="card border-l-4 border-l-[var(--success)] bg-[var(--success)]/5">
        <h4 className="font-bold text-[var(--success)] mb-2">Comienza tu aventura</h4>
        <p className="text-sm text-[var(--foreground)]/80 mb-3">
          El primer paso es derrotar los 4 bosses de Pre-Hardmode para aprender las mecánicas del juego. Después, ¡Hardmode
          te espera!
        </p>
        <a href="#/bosses" className="text-sm font-bold text-[var(--primary-light)] hover:underline">
          Ver Bosses Pre-Hardmode →
        </a>
      </div>
    </div>
  );
}
