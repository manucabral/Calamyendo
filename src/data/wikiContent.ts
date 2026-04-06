export const WIKI_SOURCES = [
  {
    name: 'Terraria Wiki - Guide:Class setups',
    url: 'https://terraria.wiki.gg/wiki/Guide:Class_setups',
    note: 'Etapas de progreso por clase, recomendaciones de equipo y buffs.',
  },
  {
    name: 'Calamity Wiki - Bosses',
    url: 'https://calamitymod.wiki.gg/wiki/Bosses',
    note: 'Orden de jefes, forma de invocacion y desbloqueos del mundo.',
  },
  {
    name: 'Calamity Wiki - Guide:Class setups',
    url: 'https://calamitymod.wiki.gg/wiki/Guide:Class_setups',
    note: 'Rutas de equipamiento por clase en Pre-Hardmode, Hardmode y Post-Moon Lord.',
  },
] as const;

export const CLASS_FOUNDATIONS = [
  {
    id: 'melee',
    title: 'Melee',
    summary:
      'Mayor defensa y control cercano. En etapas tardias usa armas con proyectil para mantener DPS sin perder seguridad.',
    strengths: ['Alta defensa', 'Buen control de masas', 'Escala bien con accesorios ofensivos'],
  },
  {
    id: 'ranger',
    title: 'Ranger',
    summary:
      'Gran dano a distancia con arcos, armas de fuego y municion especializada. Muy fuerte en jefes de objetivo unico.',
    strengths: ['DPS consistente', 'Alcance largo', 'Opciones de municion para cada encuentro'],
  },
  {
    id: 'mage',
    title: 'Mage',
    summary:
      'Clase fragil con herramientas muy versatiles (homing, AoE y burst). Requiere control de mana y posicionamiento fino.',
    strengths: ['Variedad de efectos', 'Muy buen burst', 'Excelente limpieza de eventos'],
  },
  {
    id: 'summoner',
    title: 'Summoner',
    summary:
      'Dano autonomo con minions y sentries. Brilla en hibridos, usando invocaciones como DPS constante junto a otra clase.',
    strengths: ['DPS pasivo permanente', 'Gran precision de minions', 'Muy fuerte en builds hibridas'],
  },
] as const;

export const TERRARIA_CLASS_STAGES = [
  'Gearing Up',
  'Pre-Bosses',
  'Pre-Skeletron',
  'Pre-Wall of Flesh',
  'Pre-Mechanical Bosses',
  'Pre-Plantera',
  'Pre-Golem',
  'Pre-Lunatic Cultist',
  'Pre-Moon Lord',
  'Endgame',
] as const;

export const CALAMITY_CLASS_STAGES = [
  'Pre-Boss',
  'Pre-Eater of Worlds / Brain of Cthulhu',
  'Pre-The Hive Mind / The Perforators',
  'Pre-Skeletron',
  'Pre-Wall of Flesh',
  'Pre-Mechanical Bosses',
  'Post-Mechanical Boss 1',
  'Post-Mechanical Boss 2',
  'Pre-Plantera',
  'Pre-Golem',
  'Post-Golem',
  'Pre-Lunar Events',
  'Pre-Moon Lord',
  'Pre-Providence',
  'Pre-Polterghast',
  'Pre-Devourer of Gods',
  'Pre-Yharon',
  'Pre-Exo Mechs / Supreme Witch, Calamitas',
  'Endgame',
] as const;

export const CALAMITY_BOSS_PROGRESSION = {
  preHardmode: [
    'King Slime',
    'Desert Scourge',
    'Eye of Cthulhu',
    'Crabulon',
    'Eater of Worlds / Brain of Cthulhu',
    'The Hive Mind / The Perforators',
    'Queen Bee',
    'Deerclops',
    'Skeletron',
    'The Slime God',
    'Wall of Flesh',
  ],
  hardmode: [
    'Queen Slime',
    'Cryogen',
    'The Twins',
    'Aquatic Scourge',
    'The Destroyer',
    'Brimstone Elemental',
    'Skeletron Prime',
    'Calamitas Clone',
    'Plantera',
    'Leviathan and Anahita',
    'Astrum Aureus',
    'Golem',
    'Duke Fishron',
    'The Plaguebringer Goliath',
    'Empress of Light',
    'Ravager',
    'Lunatic Cultist',
    'Astrum Deus',
    'Moon Lord',
  ],
  postMoonLord: [
    'Profaned Guardians',
    'Dragonfolly',
    'Providence, the Profaned Goddess',
    'Storm Weaver',
    'Ceaseless Void',
    'Signus, Envoy of the Devourer',
    'Polterghast',
    'The Old Duke',
    'The Devourer of Gods',
    'Yharon, Dragon of Rebirth',
    'Exo Mechs',
    'Supreme Witch, Calamitas',
  ],
} as const;

export const CALAMITY_SPOTLIGHT = [
  {
    boss: 'Desert Scourge',
    biome: 'Desert',
    summon: 'Desert Medallion',
    unlock: 'Abre progreso temprano del Sunken Sea y materiales iniciales.',
  },
  {
    boss: 'The Hive Mind',
    biome: 'Corruption',
    summon: 'Teratoma o destruir Hive Tumor',
    unlock: 'Genera Aerialite Ore tras la primera derrota.',
  },
  {
    boss: 'The Perforators',
    biome: 'Crimson',
    summon: 'Bloody Worm Food o destruir Perforator Cyst',
    unlock: 'Tambien habilita Aerialite Ore en el espacio.',
  },
  {
    boss: 'Cryogen',
    biome: 'Snow',
    summon: 'Cryo Key',
    unlock: 'Habilita Cryonic Ore y nuevas opciones de crafteo.',
  },
  {
    boss: 'Providence, the Profaned Goddess',
    biome: 'Hallow / Underworld',
    summon: 'Profaned Core',
    unlock: 'Marca el inicio del gran tramo Post-Moon Lord.',
  },
  {
    boss: 'The Devourer of Gods',
    biome: 'Anywhere',
    summon: 'Cosmic Worm',
    unlock: 'Acceso a Cosmilite y materiales de tier final.',
  },
] as const;

export type GuideClass = 'melee' | 'ranger' | 'mage' | 'summoner';
export type GuideDifficulty = 'normal' | 'expert' | 'revengeance' | 'death';
export type GuideFocus = 'balanced' | 'rush-bosses' | 'gear-first';

export const TUTORIAL_STEPS = [
  {
    id: 'step-1',
    title: 'Define tu identidad de run',
    detail:
      'Elige clase principal, dificultad y foco. Tu build y el orden de bosses deben depender de esas tres decisiones.',
  },
  {
    id: 'step-2',
    title: 'Asegura movilidad y supervivencia',
    detail:
      'Antes de forzar daño, prioriza botas, salto extra, curacion y buffos basicos para estabilizar cada encuentro.',
  },
  {
    id: 'step-3',
    title: 'Avanza por checkpoints de equipamiento',
    detail:
      'Actualiza arma, armadura y accesorios en cada tramo: Pre-Boss, Pre-Skeletron y Pre-Wall of Flesh.',
  },
  {
    id: 'step-4',
    title: 'Derrota bosses por bloque',
    detail:
      'Ataca jefes por lotes pequenos. Cada kill desbloquea recursos y acelera tu siguiente mejora de setup.',
  },
  {
    id: 'step-5',
    title: 'Revisa consumibles y arena',
    detail:
      'Ironskin, Regeneration, Swiftness y una arena limpia valen mas que un item premium mal jugado.',
  },
  {
    id: 'step-6',
    title: 'Reevalua y reajusta',
    detail:
      'Si te atascas, cambia ruta: mejora arma, ajusta accesorios o salta a un boss alterno permitido por progresion.',
  },
] as const;

export const CLASS_TUTORIAL_LOADOUTS: Record<
  GuideClass,
  {
    identity: string;
    earlyItems: string[];
    checkpointItems: string[];
    potions: string[];
  }
> = {
  melee: {
    identity: 'Frontline de alto aguante, ideal para aprender patrones de dodge con margen de error.',
    earlyItems: ['Starfury', 'Blade of Grass', 'Volcano'],
    checkpointItems: ['Night\'s Edge', 'Molten Armor', 'Feral Claws', 'Lightning Boots'],
    potions: ['Ironskin Potion', 'Regeneration Potion', 'Swiftness Potion'],
  },
  ranger: {
    identity: 'Dano a distancia consistente, fuerte para bosses largos y posicionamiento seguro.',
    earlyItems: ['Boomstick', 'Minishark', 'The Bee\'s Knees'],
    checkpointItems: ['Phoenix Blaster', 'Necro Armor', 'Shark Tooth Necklace', 'Lightning Boots'],
    potions: ['Ironskin Potion', 'Archery Potion', 'Swiftness Potion'],
  },
  mage: {
    identity: 'Clase de burst y control con alta exigencia de mana y microgestion de recursos.',
    earlyItems: ['Demon Scythe', 'Thunder Zapper', 'Bee Gun'],
    checkpointItems: ['Aqua Scepter', 'Meteor Armor', 'Mana Flower', 'Celestial Cuffs'],
    potions: ['Mana Regeneration Potion', 'Magic Power Potion', 'Ironskin Potion'],
  },
  summoner: {
    identity: 'Dano automatizado y excelente multitarea, con techo alto en setups hibridos.',
    earlyItems: ['Vampire Frog Staff', 'Flinx Staff', 'Imp Staff'],
    checkpointItems: ['Spinal Tap', 'Bee Armor', 'Pygmy Necklace', 'Feral Claws'],
    potions: ['Summoning Potion', 'Bewitching Table buff', 'Ironskin Potion'],
  },
};

export const DIFFICULTY_TUTORIAL_RULES: Record<
  GuideDifficulty,
  {
    profile: string;
    mistakesToAvoid: string[];
    defensiveThreshold: string;
  }
> = {
  normal: {
    profile: 'Ruta estable para aprender progresion y mecanicas sin castigo extremo.',
    mistakesToAvoid: [
      'No ignores movilidad por daño bruto.',
      'No pelees bosses sin buffos base.',
      'No saltes etapas de armadura demasiado pronto.',
    ],
    defensiveThreshold: 'Defensa media y 1-2 capas de plataforma por arena.',
  },
  expert: {
    profile: 'Mayor densidad de patrones. Necesitas limpieza de arena y timings precisos.',
    mistakesToAvoid: [
      'No quedarte sin pociones en fase final.',
      'No usar arena pequena para bosses moviles.',
      'No ignorar accesorios de evasión y recoil.',
    ],
    defensiveThreshold: 'Defensa media-alta y arena larga con verticalidad.',
  },
  revengeance: {
    profile: 'Pico de dificultad donde manda consistencia en dodge y DPS constante.',
    mistakesToAvoid: [
      'No improvisar loadout entre intentos.',
      'No entrar sin ruta de curacion definida.',
      'No pelear en biomas no optimos para invocacion.',
    ],
    defensiveThreshold: 'Mitigacion alta, movilidad maxima, buffos completos.',
  },
  death: {
    profile: 'Modo extremo para runs planificadas al detalle, sin margen de ejecucion erratica.',
    mistakesToAvoid: [
      'No cambiar de estrategia despues de cada wipe sin medir causa.',
      'No consumir summons en arena inestable.',
      'No entrar sin checklist completa de buffs y escape.',
    ],
    defensiveThreshold: 'Arena optimizada, consumibles premium y disciplina de patrones.',
  },
};

export const FOCUS_PLAYBOOKS: Record<
  GuideFocus,
  {
    intent: string;
    priorities: string[];
  }
> = {
  balanced: {
    intent: 'Progresion segura y pareja entre bosses, equipo y farmeo moderado.',
    priorities: [
      'Actualizar arma principal en cada checkpoint.',
      'Mantener buffos y movilidad siempre al dia.',
      'Derrotar bosses en orden recomendado con pequenas desviaciones.',
    ],
  },
  'rush-bosses': {
    intent: 'Minimizar tiempos muertos y derrotar bosses clave para desbloquear tiers rapido.',
    priorities: [
      'Priorizar DPS sobre utilidad secundaria.',
      'Farmear solo items criticos para el siguiente boss.',
      'Aprovechar bosses alternos para saltar tramos lentos.',
    ],
  },
  'gear-first': {
    intent: 'Construir ventaja por equipamiento antes de cada pared de dificultad.',
    priorities: [
      'Farmear accesorios y armas de alto impacto temprano.',
      'Optimizar reforges antes de bosses duros.',
      'Entrar a cada pelea con setup superior al minimo requerido.',
    ],
  },
};

export const WIKI_TUTORIAL_LINKS = [
  {
    label: 'Terraria Guide:Class setups',
    url: 'https://terraria.wiki.gg/wiki/Guide:Class_setups',
  },
  {
    label: 'Calamity Bosses',
    url: 'https://calamitymod.wiki.gg/wiki/Bosses',
  },
  {
    label: 'Calamity Guide:Class setups',
    url: 'https://calamitymod.wiki.gg/wiki/Guide:Class_setups',
  },
  {
    label: 'Calamity Guide:Mod progression',
    url: 'https://calamitymod.wiki.gg/wiki/Guide:Mod_progression',
  },
] as const;

export const TIER_LABELS: Record<'preHardmode' | 'hardmode' | 'postMoonLord', string> = {
  preHardmode: 'Pre-Hardmode',
  hardmode: 'Hardmode',
  postMoonLord: 'Post-Moon Lord',
};

export const TIER_CLASS_RECOMMENDATIONS: Record<
  'preHardmode' | 'hardmode' | 'postMoonLord',
  Record<GuideClass, string[]>
> = {
  preHardmode: {
    melee: ['Starfury', 'Blade of Grass', 'Volcano', "Night's Edge", 'Molten Armor'],
    ranger: ['Boomstick', "The Bee's Knees", 'Minishark', 'Necro Armor', 'Molten Fury'],
    mage: ['Demon Scythe', 'Thunder Zapper', 'Bee Gun', 'Aqua Scepter', 'Meteor Armor'],
    summoner: ['Vampire Frog Staff', 'Flinx Staff', 'Imp Staff', 'Spinal Tap', 'Bee Armor'],
  },
  hardmode: {
    melee: ['Shadowflame Knife', 'Bananarang', 'True Excalibur', 'Terra Blade', 'Turtle Armor'],
    ranger: ['Daedalus Stormbow', 'Megashark', 'Chlorophyte Shotbow', 'Tsunami', 'Shroomite Armor'],
    mage: ['Sky Fracture', 'Golden Shower', 'Razorblade Typhoon', 'Spectre Staff', 'Spectre Armor'],
    summoner: ['Sanguine Staff', 'Blade Staff', 'Durendal', 'Dark Harvest', 'Spooky Armor'],
  },
  postMoonLord: {
    melee: ['Daybreak', 'Solar Eruption', 'Ark of the Cosmos', 'Dragon Rage', 'Auric Tesla Armor'],
    ranger: ['Phantasm', 'Vortex Beater', 'Drataliornus', 'Nano Purge', 'Auric Tesla Armor'],
    mage: ['Last Prism', 'Nebula Blaze', 'Voltaic Climax', 'Yharim\'s Crystal', 'Auric Tesla Armor'],
    summoner: ['Terraprisma', 'Stardust Dragon Staff', 'Endogenesis', 'Temporal Umbrella', 'Auric Tesla Armor'],
  },
};