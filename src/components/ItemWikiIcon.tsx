'use client';

import { useEffect, useMemo, useState } from 'react';

interface ItemWikiIconProps {
  itemName: string;
  size?: number;
  className?: string;
  fallbackIcon?: string;
}

const iconCache = new Map<string, string | null>();
const pendingRequests = new Map<string, Promise<string | null>>();

async function queryWikiThumbnail(baseUrl: string, itemName: string, size: number): Promise<string | null> {
  const endpoint = `${baseUrl}/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&titles=${encodeURIComponent(itemName)}`;
  const response = await fetch(endpoint);

  if (!response.ok) return null;
  const data = await response.json();
  const pages = data?.query?.pages;

  if (!pages || typeof pages !== 'object') return null;

  const firstPage = Object.values(pages)[0] as { thumbnail?: { source?: string } } | undefined;
  return firstPage?.thumbnail?.source ?? null;
}

async function resolveItemIcon(itemName: string, size: number): Promise<string | null> {
  const cacheKey = `${itemName.toLowerCase()}::${size}`;

  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey) ?? null;
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) ?? null;
  }

  const request = (async () => {
    const calamity = await queryWikiThumbnail('https://calamitymod.wiki.gg', itemName, size);
    if (calamity) {
      iconCache.set(cacheKey, calamity);
      return calamity;
    }

    const terraria = await queryWikiThumbnail('https://terraria.wiki.gg', itemName, size);
    if (terraria) {
      iconCache.set(cacheKey, terraria);
      return terraria;
    }

    iconCache.set(cacheKey, null);
    return null;
  })();

  pendingRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

export function ItemWikiIcon({ itemName, size = 24, className = '', fallbackIcon = '📦' }: ItemWikiIconProps) {
  const cacheKey = useMemo(() => `${itemName.toLowerCase()}::${size}`, [itemName, size]);
  const [src, setSrc] = useState<string | null>(() => iconCache.get(cacheKey) ?? null);

  useEffect(() => {
    let cancelled = false;

    resolveItemIcon(itemName, size).then((resolved) => {
      if (cancelled) return;
      setSrc(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [itemName, size]);

  if (src) {
    return (
      <img
        src={src}
        alt={itemName}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={`rounded-sm border border-[var(--border)] bg-[var(--background)] object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--background)] ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.floor(size * 0.6)) }}
      aria-label={`Icono no disponible para ${itemName}`}
      title={itemName}
    >
      {fallbackIcon}
    </span>
  );
}
