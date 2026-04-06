'use client';

import React from 'react';
import { useGameProgress } from '@/lib/useGameProgress';
import { ITEMS } from '@/data/items';
import { EducationalCard } from './EducationalCard';
import { ItemWikiIcon } from './ItemWikiIcon';

export function CurrentBuildSummary() {
  const { progress, isItemCompleted } = useGameProgress();

  if (!progress) return null;

  // Obtener todos los items del usuario
  const userItems = Object.values(ITEMS).filter((item) => isItemCompleted(item.id));

  // Calcular estadísticas totales
  let totalDamage = 0,
    totalDefense = 0,
    totalCrit = 0,
    totalSpeed = 0,
    totalMana = 0;

  userItems.forEach((item) => {
    totalDamage += item.stats?.damage || 0;
    totalDefense += item.stats?.defense || 0;
    totalCrit += item.stats?.crit || 0;
    totalSpeed += item.stats?.speed || 0;
    totalMana += item.stats?.mana || 0;
  });

  // Agrupar por tipo
  const weaponsByType = userItems.filter((i) => i.type === 'weapon');
  const armorByType = userItems.filter((i) => i.type === 'armor');
  const accessoriesByType = userItems.filter((i) => i.type === 'accessory');
  const potionsByType = userItems.filter((i) => i.type === 'potion');

  const preferredClass = progress.preferredClass;

  if (userItems.length === 0) {
    return (
      <EducationalCard
        title="Tu Build Actual"
        content="Aún no tienes items en tu inventario. Comienza decorando items o derrota bosses para obtener sus drops."
        hint="Usa el sistema de tracking en la sección '¿Qué Hacer Ahora?' para marcar items como obtenidos."
        variant="info"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card border-l-4 border-l-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/10 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h3 className="font-bold text-[var(--accent-light)] text-lg capitalize">
              Tu Build: {preferredClass}
            </h3>
            <p className="text-xs text-[var(--foreground)]/60">{userItems.length} items en inventario</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {(totalDamage > 0 || totalDefense > 0 || totalCrit > 0 || totalSpeed > 0 || totalMana > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {totalDamage > 0 && (
            <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-l-4 border-l-[var(--primary)] p-3">
              <div className="text-xs text-[var(--foreground)]/70 font-bold">Daño</div>
              <div className="text-xl font-bold text-[var(--primary-light)]">+{totalDamage}</div>
            </div>
          )}
          {totalDefense > 0 && (
            <div className="card bg-gradient-to-br from-[var(--secondary)]/10 to-transparent border-l-4 border-l-[var(--secondary)] p-3">
              <div className="text-xs text-[var(--foreground)]/70 font-bold">Defensa</div>
              <div className="text-xl font-bold text-[var(--secondary-light)]">+{totalDefense}</div>
            </div>
          )}
          {totalCrit > 0 && (
            <div className="card bg-gradient-to-br from-[var(--accent)]/10 to-transparent border-l-4 border-l-[var(--accent)] p-3">
              <div className="text-xs text-[var(--foreground)]/70 font-bold">Crítico</div>
              <div className="text-xl font-bold text-[var(--accent-light)]">+{totalCrit}%</div>
            </div>
          )}
          {totalSpeed > 0 && (
            <div className="card bg-gradient-to-br from-[var(--warning)]/10 to-transparent border-l-4 border-l-[var(--warning)] p-3">
              <div className="text-xs text-[var(--foreground)]/70 font-bold">Velocidad</div>
              <div className="text-xl font-bold text-[var(--warning)]">+{(totalSpeed * 10).toFixed(0)}%</div>
            </div>
          )}
          {totalMana > 0 && (
            <div className="card bg-gradient-to-br from-[var(--success)]/10 to-transparent border-l-4 border-l-[var(--success)] p-3">
              <div className="text-xs text-[var(--foreground)]/70 font-bold">Maná</div>
              <div className="text-xl font-bold text-[var(--success)]">+{totalMana}</div>
            </div>
          )}
        </div>
      )}

      {/* Items by Type */}
      <div className="grid md:grid-cols-2 gap-3">
        {weaponsByType.length > 0 && (
          <div className="card bg-[var(--primary)]/5 border-l-4 border-l-[var(--primary)]">
            <h4 className="font-bold text-[var(--primary-light)] mb-2">
              Armas ({weaponsByType.length})
            </h4>
            <ul className="text-xs space-y-1">
              {weaponsByType.map((item) => (
                <li key={item.id} className="text-[var(--foreground)]/80 flex items-center gap-2">
                  <ItemWikiIcon itemName={item.name} size={18} fallbackIcon="⚔️" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {armorByType.length > 0 && (
          <div className="card bg-[var(--secondary)]/5 border-l-4 border-l-[var(--secondary)]">
            <h4 className="font-bold text-[var(--secondary-light)] mb-2">
              Armadura ({armorByType.length})
            </h4>
            <ul className="text-xs space-y-1">
              {armorByType.map((item) => (
                <li key={item.id} className="text-[var(--foreground)]/80 flex items-center gap-2">
                  <ItemWikiIcon itemName={item.name} size={18} fallbackIcon="🛡️" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {accessoriesByType.length > 0 && (
          <div className="card bg-[var(--accent)]/5 border-l-4 border-l-[var(--accent)]">
            <h4 className="font-bold text-[var(--accent-light)] mb-2">
              Accesorios ({accessoriesByType.length})
            </h4>
            <ul className="text-xs space-y-1">
              {accessoriesByType.map((item) => (
                <li key={item.id} className="text-[var(--foreground)]/80 flex items-center gap-2">
                  <ItemWikiIcon itemName={item.name} size={18} fallbackIcon="✨" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {potionsByType.length > 0 && (
          <div className="card bg-[var(--success)]/5 border-l-4 border-l-[var(--success)]">
            <h4 className="font-bold text-[var(--success)] mb-2">
              Pociones ({potionsByType.length})
            </h4>
            <ul className="text-xs space-y-1">
              {potionsByType.map((item) => (
                <li key={item.id} className="text-[var(--foreground)]/80 flex items-center gap-2">
                  <ItemWikiIcon itemName={item.name} size={18} fallbackIcon="🧪" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tip */}
      <EducationalCard
        title="Próximos Pasos"
        content={`Tu build de ${preferredClass} tiene ${userItems.length} items. Derrota el próximo boss recomendado en la sección '¿Qué Hacer Ahora?' para ganar nuevos items y mejoras.`}
        variant="success"
      />
    </div>
  );
}
