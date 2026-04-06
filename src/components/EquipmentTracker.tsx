'use client';

import React, { useMemo, useState } from 'react';
import { useGameProgress } from '@/lib/useGameProgress';
import { ITEMS } from '@/data/items';
import { Class } from '@/lib/types';
import { EducationalCard } from './EducationalCard';
import { ItemWikiIcon } from './ItemWikiIcon';

interface EquipmentTrackerProps {
  recommendedItems: {
    weapons: string[];
    armor: string[];
    accessories: string[];
    potions: string[];
  };
  bossName: string;
  className: Class;
}

export function EquipmentTracker({ recommendedItems, bossName, className }: EquipmentTrackerProps) {
  const { progress, toggleItemCompleted, isItemCompleted } = useGameProgress();
  const [activeCategory, setActiveCategory] = useState<'all' | 'weapons' | 'armor' | 'accessories' | 'potions'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  const classMeta: Record<Class, { label: string; icon: string }> = {
    melee: { label: 'Melee', icon: '' },
    ranger: { label: 'Ranger', icon: '' },
    mage: { label: 'Mage', icon: '' },
    summon: { label: 'Summon', icon: '' },
    rogue: { label: 'Rogue', icon: '' },
  };

  const categories = [
    { type: 'weapons', label: 'Armas', icon: '', color: 'var(--primary)' },
    { type: 'armor', label: 'Armadura', icon: '', color: 'var(--secondary)' },
    { type: 'accessories', label: 'Accesorios', icon: '', color: 'var(--accent)' },
    { type: 'potions', label: 'Pociones', icon: '', color: 'var(--success)' },
  ] as const;

  const itemsByName = useMemo(() => {
    return new Map(Object.values(ITEMS).map((item) => [item.name.toLowerCase(), item]));
  }, []);

  const allRecommendedNames = useMemo(() => {
    return Array.from(new Set(Object.values(recommendedItems).flat()));
  }, [recommendedItems]);

  const markAllVisibleAs = (targetChecked: boolean) => {
    filteredCategories.forEach((category) => {
      category.items.forEach((itemName) => {
        const item = itemsByName.get(itemName.toLowerCase());
        if (!item) return;
        const current = isItemCompleted(item.id);
        if (current !== targetChecked) {
          toggleItemCompleted(item.id);
        }
      });
    });
  };

  const getItemProgress = (category: keyof typeof recommendedItems) => {
    const recommended = recommendedItems[category];
    const obtained = recommended.filter((itemName) => {
      const item = itemsByName.get(itemName.toLowerCase());
      return item ? isItemCompleted(item.id) : false;
    });
    return { obtained: obtained.length, total: recommended.length };
  };

  const getEquipStats = () => {
    const allRecommended = allRecommendedNames;
    const obtainedItems = allRecommended
      .map((itemName) => {
        const item = itemsByName.get(itemName.toLowerCase());
        if (!item) return null;
        return isItemCompleted(item.id) ? item : null;
      })
      .filter(Boolean) as any[];

    let totalDamage = 0,
      totalDefense = 0,
      totalCrit = 0;

    obtainedItems.forEach((item) => {
      totalDamage += item.stats?.damage || 0;
      totalDefense += item.stats?.defense || 0;
      totalCrit += item.stats?.crit || 0;
    });

    return { totalDamage, totalDefense, totalCrit, itemsObtained: obtainedItems.length };
  };

  const stats = getEquipStats();

  const filteredCategories = categories
    .map((category) => {
      const key = category.type as keyof typeof recommendedItems;
      const items = recommendedItems[key].filter((itemName) =>
        itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, items };
    })
    .filter((category) => {
      if (activeCategory === 'all') return category.items.length > 0;
      return category.type === activeCategory && category.items.length > 0;
    });

  const overallCompletion = allRecommendedNames.length
    ? Math.round((stats.itemsObtained / allRecommendedNames.length) * 100)
    : 0;

  if (!progress) return null;

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--accent)]/10 border-l-4 border-l-[var(--secondary)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-[var(--secondary-light)]">
              Build {classMeta[className].label} para {bossName}
            </h3>
            <p className="text-xs text-[var(--foreground)]/70 mt-1">
              Completa este checklist para llegar preparado al próximo boss.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-[var(--foreground)]/60">Completado</p>
            <p className="text-2xl font-bold text-[var(--accent-light)]">{overallCompletion}%</p>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'weapons', 'armor', 'accessories', 'potions'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setActiveCategory(filterType)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeCategory === filterType
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--border)]/50 hover:bg-[var(--border)]'
              }`}
            >
              {filterType === 'all' ? 'Todo' : filterType}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar item recomendado..."
            className="flex-1 min-w-[180px] px-3 py-2 rounded border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <button
            onClick={() => markAllVisibleAs(true)}
            className="px-3 py-2 rounded text-xs font-bold bg-[var(--success)]/20 hover:bg-[var(--success)]/35"
          >
            Marcar visibles
          </button>
          <button
            onClick={() => markAllVisibleAs(false)}
            className="px-3 py-2 rounded text-xs font-bold bg-[var(--danger)]/15 hover:bg-[var(--danger)]/30"
          >
            Limpiar visibles
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-l-4 border-l-[var(--primary)]">
          <div className="text-xs text-[var(--foreground)]/70 uppercase font-bold">Items</div>
          <div className="text-2xl font-bold text-[var(--primary-light)]">{stats.itemsObtained}</div>
          <div className="text-xs text-[var(--foreground)]/60">de {allRecommendedNames.length}</div>
        </div>

        {stats.totalDamage > 0 && (
          <div className="card bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-l-4 border-l-[var(--primary-light)]">
            <div className="text-xs text-[var(--foreground)]/70 uppercase font-bold">Daño</div>
            <div className="text-2xl font-bold text-[var(--primary-light)]">+{stats.totalDamage}</div>
            <div className="text-xs text-[var(--foreground)]/60">total</div>
          </div>
        )}

        {stats.totalDefense > 0 && (
          <div className="card bg-gradient-to-br from-[var(--secondary)]/10 to-transparent border-l-4 border-l-[var(--secondary)]">
            <div className="text-xs text-[var(--foreground)]/70 uppercase font-bold">Defensa</div>
            <div className="text-2xl font-bold text-[var(--secondary-light)]">+{stats.totalDefense}</div>
            <div className="text-xs text-[var(--foreground)]/60">total</div>
          </div>
        )}

        {stats.totalCrit > 0 && (
          <div className="card bg-gradient-to-br from-[var(--accent)]/10 to-transparent border-l-4 border-l-[var(--accent)]">
            <div className="text-xs text-[var(--foreground)]/70 uppercase font-bold">Crítico</div>
            <div className="text-2xl font-bold text-[var(--accent-light)]">+{stats.totalCrit}%</div>
            <div className="text-xs text-[var(--foreground)]/60">total</div>
          </div>
        )}
      </div>

      {/* Equipment Categories */}
      {filteredCategories.map(({ type, label, items }) => {
        const categoryKey = type as keyof typeof recommendedItems;
        const progress = getItemProgress(categoryKey);

        if (items.length === 0) return null;

        return (
          <div key={type} className="card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">{label}</h4>
                  <p className="text-xs text-[var(--foreground)]/60">{progress.obtained} de {progress.total} obtenidos</p>
                </div>
              </div>
              <div className="progress-bar w-24 h-1.5">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(progress.obtained / progress.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {items.map((itemName, idx) => {
                const item = itemsByName.get(itemName.toLowerCase());
                const isObtained = item ? isItemCompleted(item.id) : false;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded transition-all cursor-pointer ${
                      isObtained
                        ? 'bg-[var(--success)]/10 border border-[var(--success)]'
                        : 'bg-[var(--border)]/30 border border-transparent'
                    }`}
                    onClick={() => item && toggleItemCompleted(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isObtained}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (item) toggleItemCompleted(item.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 w-5 h-5 cursor-pointer accent-[var(--success)]"
                      title={`Marcar ${itemName} como obtenido`}
                    />
                    <ItemWikiIcon itemName={itemName} size={24} fallbackIcon="🎒" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${isObtained ? 'line-through text-[var(--foreground)]/60' : 'text-[var(--foreground)]'}`}>
                        {itemName}
                      </div>
                      {item?.stats && (
                        <div className="text-xs text-[var(--foreground)]/60 mt-1 space-x-2">
                          {item.stats.damage && <span>DMG +{item.stats.damage}</span>}
                          {item.stats.defense && <span>DEF +{item.stats.defense}</span>}
                          {item.stats.crit && <span>CRIT +{item.stats.crit}%</span>}
                        </div>
                      )}
                    </div>
                    {isObtained && <span className="text-xs font-bold text-[var(--success)]">OK</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Tips */}
      <EducationalCard
        title="Cómo Usar Este Tracker"
        content="Haz clic en los items para marcarlos como obtenidos. El sistema guardará automáticamente tu progreso. Los stats se actualizarán en tiempo real según qué items hayas obtenido."
        hint="Tip: Puedes marcar items que ya tenías de sesiones anteriores para ver qué progreso llevas en tu build."
        variant="info"
      />
    </div>
  );
}
