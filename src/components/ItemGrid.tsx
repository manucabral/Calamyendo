'use client';

import { useGameProgress } from '@/lib/useGameProgress';
import { ITEMS } from '@/data/items';
import { Class } from '@/lib/types';
import { useMemo } from 'react';
import { ItemWikiIcon } from './ItemWikiIcon';

interface ItemGridProps {
  filterClass?: Class;
  filterType?: string;
  filterStage?: string;
  searchQuery?: string;
}

export function ItemGrid({
  filterClass,
  filterType,
  filterStage,
  searchQuery = '',
}: ItemGridProps) {
  const { progress, isItemCompleted, toggleItemCompleted } = useGameProgress();

  const filteredItems = useMemo(() => {
    if (!progress) return [];
    const allItems = Object.values(ITEMS);

    return allItems.filter((item) => {
      if (filterClass && !item.classes.includes(filterClass)) return false;
      if (filterType && item.type !== filterType) return false;
      if (filterStage && item.stage !== filterStage) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [progress, filterClass, filterType, filterStage, searchQuery]);

  if (!progress) return null;

  const typeLabels: Record<string, string> = {
    weapon: 'Arma',
    armor: 'Armadura',
    accessory: 'Accesorio',
    potion: 'Poción',
  };

  const typeColors: Record<string, string> = {
    weapon: 'border-[var(--primary)]',
    armor: 'border-[var(--secondary)]',
    accessory: 'border-[var(--accent)]',
    potion: 'border-[var(--success)]',
  };

  const rarityBgColors: Record<string, string> = {
    common: 'bg-gray-600',
    uncommon: 'bg-green-600',
    rare: 'bg-blue-600',
    epic: 'bg-purple-600',
    legendary: 'bg-yellow-600',
  };

  if (filteredItems.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-[var(--foreground)]/60">No se encontraron items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map((item) => {
        const isCompleted = isItemCompleted(item.id);

        return (
          <div
            key={item.id}
            className={`card border-l-4 ${typeColors[item.type]} transition-all cursor-pointer hover:shadow-lg ${
              isCompleted ? 'opacity-70 line-through bg-green-900/10' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 flex items-start gap-2">
                <ItemWikiIcon itemName={item.name} size={30} fallbackIcon="🧰" className="mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--accent-light)] text-sm">
                    {typeLabels[item.type]}
                  </h4>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mt-1">{item.name}</h3>
                </div>
              </div>
              {item.rarity && (
                <span className={`badge ${rarityBgColors[item.rarity] || 'bg-gray-500'}`}>
                  {item.rarity}
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--foreground)]/60 mb-3">{item.description}</p>

            {/* Stats display */}
            {Object.keys(item.stats).length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                {Object.entries(item.stats).map(([key, value]) => {
                  if (!value) return null;
                  const labels: Record<string, string> = {
                    damage: 'DMG',
                    defense: 'DEF',
                    speed: 'SPD',
                    crit: 'CRIT',
                    knockback: 'KNOCKBACK',
                    mana: 'MANA',
                    summons: 'MINIONS',
                  };

                  return (
                    <div key={key} className="bg-[var(--border)] px-2 py-1 rounded">
                      <span className="font-bold text-[var(--secondary-light)]">
                        {labels[key] || key}
                      </span>
                      <span className="ml-1">{value > 0 ? '+' : ''}{value}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Source and stage */}
            <div className="bg-[var(--background)] p-2 rounded text-xs mb-3 border border-[var(--border)]">
              <p className="text-[var(--foreground)]/70">
                <span className="font-bold">Etapa:</span> {item.stage}
              </p>
              {item.obtainedFrom && (
                <p className="text-[var(--foreground)]/60 mt-1">
                  <span className="font-bold">De:</span> {item.obtainedFrom}
                </p>
              )}
            </div>

            {/* Toggle completion */}
            <button
              onClick={() => toggleItemCompleted(item.id)}
              className={`btn text-xs w-full ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isCompleted ? 'Obtenido' : 'Marcar obtenido'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
