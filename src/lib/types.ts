/**
 * Tipos compartidos para la guía de Calamity Mod
 */

export type Class = 'melee' | 'ranger' | 'mage' | 'summon' | 'rogue';
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'potion';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type WorldEvil = 'corruption' | 'crimson';
export type GameDifficultyMode = 'normal' | 'expert' | 'revengeance' | 'death';
export type ProgressFocus = 'balanced' | 'boss-rush' | 'gear-first';
export type PlayerExperience = 'beginner' | 'intermediate' | 'veteran';

export interface Boss {
  id: string;
  name: string;
  internalName?: string;
  stage: 'pre-hardmode' | 'early-hardmode' | 'mid-hardmode' | 'late-hardmode' | 'post-moon-lord';
  category?: 'bosses' | 'superbosses' | 'minibosses';
  difficulty: Difficulty;
  description: string;
  drops: string[];
  weaknesses: Partial<Record<Class, string[]>>;
  resistances: Partial<Record<Class, string[]>>;
  recommendations: BossRecommendation;
  prerequisites: string[]; // IDs de bosses que deben derrotarse primero
  thumbnail?: string;
}

export interface BossRecommendation {
  melee: ClassRecommendation;
  ranger: ClassRecommendation;
  mage: ClassRecommendation;
  summon: ClassRecommendation;
  rogue: ClassRecommendation;
}

export interface ClassRecommendation {
  weapons: string[];
  armor: string[];
  accessories: string[];
  potions: string[];
  tips: string;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  classes: Class[];
  stage: 'pre-hardmode' | 'early-hardmode' | 'mid-hardmode' | 'late-hardmode' | 'post-moon-lord';
  stats: ItemStats;
  obtainedFrom?: string; // Boss or craft source
  description: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ItemStats {
  damage?: number;
  crit?: number;
  speed?: number;
  knockback?: number;
  defense?: number;
  mana?: number;
  summons?: number;
  // Adicionales
  [key: string]: number | undefined;
}

export interface ProgressionStage {
  id: string;
  name: string;
  bosses: string[]; // IDs de bosses en esta etapa
  recommendedItems: {
    melee: string[];
    ranger: string[];
    mage: string[];
    summon: string[];
    rogue: string[];
  };
  nextStage?: string;
  description: string;
}

export interface GameProgress {
  defeatedBosses: string[]; // IDs de bosses derrotados
  currentStage: string; // ID de la etapa actual
  preferredClass: Class;
  worldEvil: WorldEvil;
  gameDifficultyMode: GameDifficultyMode;
  progressFocus: ProgressFocus;
  playerExperience: PlayerExperience;
  setupCompleted: boolean;
  completedItems: string[]; // IDs de items crafteados/obtenidos
  theme: 'light' | 'dark';
  lastUpdated: number; // timestamp
}
