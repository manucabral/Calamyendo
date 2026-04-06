'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  GameProgress,
  Class,
  WorldEvil,
  GameDifficultyMode,
  ProgressFocus,
  PlayerExperience,
} from '@/lib/types';

const STORAGE_KEY = 'calamity-guide-progress';
const DEFAULT_PROGRESS: GameProgress = {
  defeatedBosses: [],
  currentStage: 'pre-hardmode',
  preferredClass: 'melee',
  worldEvil: 'corruption',
  gameDifficultyMode: 'expert',
  progressFocus: 'balanced',
  playerExperience: 'beginner',
  setupCompleted: false,
  completedItems: [],
  theme: 'dark',
  lastUpdated: Date.now(),
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<GameProgress>;
        // Keep backward compatibility with old stored schema.
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          lastUpdated: parsed.lastUpdated ?? Date.now(),
        });
      } catch (error) {
        console.error('Failed to parse stored progress:', error);
        setProgress(DEFAULT_PROGRESS);
      }
    } else {
      setProgress(DEFAULT_PROGRESS);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (progress && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoading]);

  /**
   * Mark a boss as defeated and potentially update stage
   */
  const markBossDefeated = useCallback((bossId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;

      const defeatedSet = new Set(prev.defeatedBosses);
      defeatedSet.add(bossId);

      return {
        ...prev,
        defeatedBosses: Array.from(defeatedSet),
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Unmark a boss (remove from defeated list)
   */
  const unmarkBossDefeated = useCallback((bossId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;

      const defeatedSet = new Set(prev.defeatedBosses);
      defeatedSet.delete(bossId);

      return {
        ...prev,
        defeatedBosses: Array.from(defeatedSet),
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Update current progression stage
   */
  const updateStage = useCallback((stageId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentStage: stageId,
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Set preferred class
   */
  const setPreferredClass = useCallback((classType: Class) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        preferredClass: classType,
        lastUpdated: Date.now(),
      };
    });
  }, []);

  const completeSetup = useCallback(
    (payload: {
      preferredClass: Class;
      worldEvil: WorldEvil;
      gameDifficultyMode: GameDifficultyMode;
      progressFocus: ProgressFocus;
      playerExperience: PlayerExperience;
      theme?: 'light' | 'dark';
    }) => {
      setProgress((prev) => {
        if (!prev) return prev;

        const newTheme = payload.theme ?? prev.theme;

        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        return {
          ...prev,
          preferredClass: payload.preferredClass,
          worldEvil: payload.worldEvil,
          gameDifficultyMode: payload.gameDifficultyMode,
          progressFocus: payload.progressFocus,
          playerExperience: payload.playerExperience,
          theme: newTheme,
          setupCompleted: true,
          lastUpdated: Date.now(),
        };
      });
    },
    []
  );

  const restartSetup = useCallback(() => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        setupCompleted: false,
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Toggle item as completed/obtained
   */
  const toggleItemCompleted = useCallback((itemId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;

      const completedSet = new Set(prev.completedItems);
      if (completedSet.has(itemId)) {
        completedSet.delete(itemId);
      } else {
        completedSet.add(itemId);
      }

      return {
        ...prev,
        completedItems: Array.from(completedSet),
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = useCallback(() => {
    setProgress((prev) => {
      if (!prev) return prev;
      const newTheme = prev.theme === 'dark' ? 'light' : 'dark';

      // Update HTML class for Tailwind
      if (typeof document !== 'undefined') {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return {
        ...prev,
        theme: newTheme,
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Get last defeated boss (for "What's Next?" feature)
   */
  const getLastDefeatedBoss = useCallback((): string | null => {
    if (!progress || progress.defeatedBosses.length === 0) {
      return null;
    }
    // Return most recent (last in array)
    return progress.defeatedBosses[progress.defeatedBosses.length - 1];
  }, [progress]);

  /**
   * Check if a boss is defeated
   */
  const isBossDefeated = useCallback(
    (bossId: string): boolean => {
      return progress?.defeatedBosses.includes(bossId) ?? false;
    },
    [progress]
  );

  /**
   * Check if an item is completed
   */
  const isItemCompleted = useCallback(
    (itemId: string): boolean => {
      return progress?.completedItems.includes(itemId) ?? false;
    },
    [progress]
  );

  /**
   * Get completion percentage for a stage
   */
  const getStageCompletion = useCallback(
    (stageBosses: string[]): number => {
      if (stageBosses.length === 0) return 0;
      const defeated = stageBosses.filter((b) => isBossDefeated(b)).length;
      return Math.round((defeated / stageBosses.length) * 100);
    },
    [isBossDefeated]
  );

  /**
   * Reset all progress (careful!)
   */
  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    isLoading,
    markBossDefeated,
    unmarkBossDefeated,
    updateStage,
    setPreferredClass,
    completeSetup,
    restartSetup,
    toggleItemCompleted,
    toggleTheme,
    getLastDefeatedBoss,
    isBossDefeated,
    isItemCompleted,
    getStageCompletion,
    resetProgress,
  };
}
