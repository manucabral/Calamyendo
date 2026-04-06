'use client';

import React from 'react';

interface RecommendedItem {
  name: string;
  priority: 'essential' | 'recommended' | 'optional';
  reason?: string;
}

interface ItemRecommendationProps {
  title: string;
  items: RecommendedItem[];
}

const priorityEmojis: Record<string, { emoji: string; label: string; color: string }> = {
  essential: { emoji: '⭐', label: 'Esencial', color: 'text-red-500' },
  recommended: {
    emoji: '✨',
    label: 'Recomendado',
    color: 'text-yellow-500',
  },
  optional: { emoji: '💡', label: 'Opcional', color: 'text-blue-500' },
};

export function ItemRecommendation({ title, items }: ItemRecommendationProps) {
  const essentialItems = items.filter((i) => i.priority === 'essential');
  const recommendedItems = items.filter((i) => i.priority === 'recommended');
  const optionalItems = items.filter((i) => i.priority === 'optional');

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-[var(--accent-light)]">{title}</h4>

      {essentialItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wide">
            ⭐ Esenciales (Necesarios para ganar)
          </p>
          <div className="space-y-2 pl-3 border-l-2 border-l-red-500">
            {essentialItems.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
                {item.reason && (
                  <p className="text-xs text-[var(--foreground)]/70 italic">{item.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-yellow-500 uppercase tracking-wide">
            ✨ Recomendados (Mejor experiencia)
          </p>
          <div className="space-y-2 pl-3 border-l-2 border-l-yellow-500">
            {recommendedItems.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-[var(--foreground)]">{item.name}</p>
                {item.reason && (
                  <p className="text-xs text-[var(--foreground)]/70 italic">{item.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {optionalItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">
            💡 Opcionales (Extra defensas)
          </p>
          <div className="space-y-2 pl-3 border-l-2 border-l-blue-500">
            {optionalItems.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm text-[var(--foreground)]/80">{item.name}</p>
                {item.reason && (
                  <p className="text-xs text-[var(--foreground)]/60 italic">{item.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
