'use client';

import React from 'react';
import { ClassGuide } from './ClassGuide';
import { EducationalCard } from './EducationalCard';
import { Class } from '@/lib/types';

const classGuides: Record<Class, any> = {
  melee: {
    description: 'Luchador cuerpo a cuerpo con alto daño directo',
    playStyle: 'Carga, golpea y usa tu defensa como arma. Resistencia > Movilidad',
    strengths: ['Alto daño individual', 'Mucho defense', ' autodefensa'],
    weaknesses: ['Rango corto', 'Vulnerable en distancia', 'Requiere timing'],
  },
  ranger: {
    description: 'Tirador a distancia rápido y versátil',
    playStyle: 'Mantén distancia, dispara constantemente y esquiva. Movilidad > Defensa',
    strengths: ['Rango seguro', 'Mucho daño sostenido', 'Versátil'],
    weaknesses: ['Menos defensa', 'Requiere munición', 'DPS variable'],
  },
  mage: {
    description: 'Lanzador de magia con efectos especiales',
    playStyle: 'Precisión, control de maná y positioning. Inteligencia > Fuerza',
    strengths: ['Daño por área', 'Controlador', 'Variedad de efectos'],
    weaknesses: ['Alto mantenimiento', 'Bajo mana inicial', 'Costoso'],
  },
  summon: {
    description: 'Invocador de aliados para combate',
    playStyle: 'Invoca minions y deja que ataquen. Delegación > Control directo',
    strengths: ['Daño pasivo', 'Múltiples objetivos', 'Menos riesgo'],
    weaknesses: ['Daño menor por minion', 'Requiere setup', 'Menos control'],
  },
  rogue: {
    description: 'Experto en ataques rápidos y furtivos',
    playStyle: 'Combos rápidos, evasión y timing. Agilidad > Resistencia',
    strengths: ['Movilidad extrema', 'Ataques rápidos', 'Daño crítico'],
    weaknesses: ['Menos defensa', 'Curva de aprendizaje', 'Timing estricto'],
  },
};

export function ClassSelection() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">🎮 Elige tu Clase</h2>
        <p className="text-[var(--foreground)]/70">
          Cada clase tiene su propio estilo de juego. Elige la que más se adapte a tu juego.
        </p>
      </div>

      <EducationalCard
        icon="📚"
        title="¿Cómo funciona la selección de clase?"
        content="Tu clase determina qué armas, armaduras y estrategias son más efectivas. No es permanente - puedes cambiarla en cualquier momento desde Configuración."
        hint="Principiantes: Melee es más intuitivo. Avanzados: Rogue es más desafiante pero potente."
        variant="info"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-stagger">
        {(Object.entries(classGuides) as Array<[Class, any]>).map(([classKey, guide]) => (
          <ClassGuide
            key={classKey}
            className={classKey}
            icon={classKey}
            {...guide}
            description={guide.description}
            playStyle={guide.playStyle}
            strengths={guide.strengths}
            weaknesses={guide.weaknesses}
          />
        ))}
      </div>

      <EducationalCard
        icon="💡"
        title="Pro Tip: Combina Estrategias"
        content="La forma de jugar una clase cambia según el boss. Un Mage en early-game puede jugar con Fire Magic, pero debe cambiar a Holy magic para Calamitas."
        variant="success"
      />
    </div>
  );
}
