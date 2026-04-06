export type TierId = "preHardmode" | "hardmode" | "postMoonLord";
export type PlayerClass = "melee" | "ranger" | "mage" | "summoner" | "rogue";
export type Difficulty = "normal" | "expert" | "revengeance" | "death";
export type WorldEvil = "corruption" | "crimson";
export type LanguageCode = "es" | "en";

export interface StartupProfile {
  playerClass: PlayerClass;
  difficulty: Difficulty;
  worldEvil: WorldEvil;
  language: LanguageCode;
  aiEnabled: boolean;
  wantsBossRush: boolean;
  hardcoreRun: boolean;
}

export const DEFAULT_STARTUP_PROFILE: StartupProfile = {
  playerClass: "melee",
  difficulty: "expert",
  worldEvil: "corruption",
  language: "es",
  aiEnabled: true,
  wantsBossRush: false,
  hardcoreRun: false,
};

export const TIER_LABELS: Record<TierId, string> = {
  preHardmode: "Pre-Hardmode",
  hardmode: "Hardmode",
  postMoonLord: "Post-Moon Lord",
};

export const CALAMITY_WIKI_SOURCES = {
  bosses: "https://calamitymod.wiki.gg/wiki/Bosses",
  classSetups: "https://calamitymod.wiki.gg/wiki/Guide:Class_setups",
  progression: "https://calamitymod.wiki.gg/wiki/Guide:Mod_progression",
  terrariaClassSetups: "https://terraria.wiki.gg/wiki/Guide:Class_setups",
};

export const CALAMITY_CLASS_SUBSTAGES: Record<TierId, string[]> = {
  preHardmode: [
    "Pre-Boss",
    "Pre-Eater of Worlds / Brain of Cthulhu",
    "Pre-The Hive Mind / The Perforators",
    "Pre-Skeletron",
    "Pre-Wall of Flesh",
  ],
  hardmode: [
    "Pre-Mechanical Bosses",
    "Post-Mechanical Boss 1",
    "Post-Mechanical Boss 2",
    "Pre-Plantera",
    "Pre-Golem",
    "Post-Golem",
    "Pre-Lunar Events",
    "Pre-Moon Lord",
  ],
  postMoonLord: [
    "Pre-Providence",
    "Pre-Polterghast",
    "Pre-Devourer of Gods",
    "Pre-Yharon",
    "Pre-Exo Mechs / Supreme Witch, Calamitas",
    "Endgame",
  ],
};

export const TERRARIA_SUPPORT_STAGES: Record<TierId, string[]> = {
  preHardmode: ["Pre-Bosses", "Pre-Skeletron", "Pre-Wall of Flesh"],
  hardmode: [
    "Pre-Mechanical Bosses",
    "Pre-Plantera",
    "Pre-Golem",
    "Pre-Lunatic Cultist",
    "Pre-Moon Lord",
  ],
  postMoonLord: ["Endgame"],
};

export const BOSSES_BY_TIER: Record<TierId, string[]> = {
  preHardmode: [
    "Desert Scourge",
    "Crabulon",
    "The Hive Mind",
    "The Perforators",
    "The Slime God",
    "Wall of Flesh",
  ],
  hardmode: [
    "Cryogen",
    "Aquatic Scourge",
    "Brimstone Elemental",
    "Calamitas Clone",
    "Leviathan and Anahita",
    "Astrum Aureus",
    "The Plaguebringer Goliath",
    "Ravager",
    "Astrum Deus",
    "Moon Lord",
  ],
  postMoonLord: [
    "Profaned Guardians",
    "Dragonfolly",
    "Providence, the Profaned Goddess",
    "Storm Weaver",
    "Ceaseless Void",
    "Signus, Envoy of the Devourer",
    "Polterghast",
    "The Old Duke",
    "The Devourer of Gods",
    "Yharon, Dragon of Rebirth",
    "Exo Mechs",
    "Supreme Witch, Calamitas",
  ],
};

export const REQUIRED_PRE_HM_WORLD_BOSS: Record<WorldEvil, string> = {
  corruption: "The Hive Mind",
  crimson: "The Perforators",
};

export type RecommendationSource = "calamity" | "terraria";

export interface ChecklistItem {
  name: string;
  source: RecommendationSource;
}

export const CHECKPOINT_ITEMS: Record<TierId, Record<PlayerClass, string[]>> = {
  preHardmode: {
    melee: ["Starfury", "Blade of Grass", "Volcano", "Night's Edge"],
    ranger: ["Boomstick", "Minishark", "The Bee's Knees", "Phoenix Blaster"],
    mage: ["Demon Scythe", "Thunder Zapper", "Bee Gun", "Aqua Scepter"],
    summoner: ["Vampire Frog Staff", "Flinx Staff", "Imp Staff", "Spinal Tap"],
    rogue: [
      "Wulfrum Knife",
      "Contaminated Bile",
      "Scourge of the Desert",
      "Aerial Tracker",
    ],
  },
  hardmode: {
    melee: ["Shadowflame Knife", "Bananarang", "True Excalibur", "Terra Blade"],
    ranger: ["Daedalus Stormbow", "Megashark", "Tsunami", "Phantasm"],
    mage: [
      "Sky Fracture",
      "Golden Shower",
      "Razorblade Typhoon",
      "Spectre Staff",
    ],
    summoner: ["Sanguine Staff", "Blade Staff", "Durendal", "Dark Harvest"],
    rogue: [
      "Cobalt Kunai",
      "Kelvin Catalyst",
      "Stormfront Razor",
      "Subduction Slicer",
    ],
  },
  postMoonLord: {
    melee: ["Zenith", "Meowmere", "Star Wrath", "Terrarian"],
    ranger: ["S.D.M.G.", "Celebration Mk2", "Phantasm", "Vortex Beater"],
    mage: ["Last Prism", "Lunar Flare", "Nebula Blaze", "Nebula Arcanum"],
    summoner: [
      "Stardust Dragon Staff",
      "Terraprisma",
      "Kaleidoscope",
      "Stardust Cell Staff",
    ],
    rogue: ["Lunar Kunai", "Reality Rupture", "Toxicant Twister", "Celestus"],
  },
};

export const CHECKPOINT_ITEM_SOURCE =
  "Checkpoint items derivados de Terraria Wiki Guide:Class_setups como baseline, usando subetapas de Calamity Wiki Guide:Class_setups para el orden de progresion.";

export const CLASS_ACCESSIBLE_ITEMS: Record<
  TierId,
  Record<PlayerClass, ChecklistItem[]>
> = {
  preHardmode: {
    melee: [
      { name: "Starfury", source: "terraria" },
      { name: "Volcano", source: "terraria" },
      { name: "Burnt Sienna", source: "calamity" },
      { name: "Old Lord Claymore", source: "calamity" },
      { name: "Wind Blade", source: "calamity" },
      { name: "Aorta", source: "calamity" },
    ],
    ranger: [
      { name: "Boomstick", source: "terraria" },
      { name: "The Bee's Knees", source: "terraria" },
      { name: "Spark Spreader", source: "calamity" },
      { name: "Firestorm Cannon", source: "calamity" },
      { name: "Galeforce", source: "calamity" },
      { name: "Shadethrower", source: "calamity" },
    ],
    mage: [
      { name: "Demon Scythe", source: "terraria" },
      { name: "Aqua Scepter", source: "terraria" },
      { name: "Veering Wind", source: "calamity" },
      { name: "Blood Bath", source: "calamity" },
      { name: "Tradewinds", source: "calamity" },
      { name: "Night's Ray", source: "calamity" },
    ],
    summoner: [
      { name: "Imp Staff", source: "terraria" },
      { name: "Spinal Tap", source: "terraria" },
      { name: "Enchanted Knife Staff", source: "calamity" },
      { name: "Dank Staff", source: "calamity" },
      { name: "Staff of Necrosteocytes", source: "calamity" },
      { name: "Aqueous Hunter Drone", source: "calamity" },
    ],
    rogue: [
      { name: "Wulfrum Knife", source: "calamity" },
      { name: "Contaminated Bile", source: "calamity" },
      { name: "Scourge of the Desert", source: "calamity" },
      { name: "Aerial Tracker", source: "calamity" },
      { name: "Shinobi Blade", source: "calamity" },
      { name: "Metal Monstrosity", source: "calamity" },
    ],
  },
  hardmode: {
    melee: [
      { name: "Shadowflame Knife", source: "terraria" },
      { name: "True Excalibur", source: "terraria" },
      { name: "Comet Quasher", source: "calamity" },
      { name: "Storm Saber", source: "calamity" },
      { name: "Darklight Greatsword", source: "calamity" },
      { name: "Majestic Guard", source: "calamity" },
    ],
    ranger: [
      { name: "Daedalus Stormbow", source: "terraria" },
      { name: "Tsunami", source: "terraria" },
      { name: "Flarewing Bow", source: "calamity" },
      { name: "Needler", source: "calamity" },
      { name: "Onyx Blaster", source: "calamity" },
      { name: "Darkecho Greatbow", source: "calamity" },
    ],
    mage: [
      { name: "Sky Fracture", source: "terraria" },
      { name: "Razorblade Typhoon", source: "terraria" },
      { name: "Frigidflash Bolt", source: "calamity" },
      { name: "Belching Saxophone", source: "calamity" },
      { name: "Seething Discharge", source: "calamity" },
      { name: "Shadecrystal Barrage", source: "calamity" },
    ],
    summoner: [
      { name: "Blade Staff", source: "terraria" },
      { name: "Dark Harvest", source: "terraria" },
      { name: "Ancient Ice Chunk", source: "calamity" },
      { name: "Deepsea Staff", source: "calamity" },
      { name: "Daedalus Golem Staff", source: "calamity" },
      { name: "Vengeful Sun Staff", source: "calamity" },
    ],
    rogue: [
      { name: "Cobalt Kunai", source: "calamity" },
      { name: "Equanimity", source: "calamity" },
      { name: "Kelvin Catalyst", source: "calamity" },
      { name: "R-PLS: Pulse Grenade", source: "calamity" },
      { name: "Subduction Slicer", source: "calamity" },
      { name: "System Bane", source: "calamity" },
    ],
  },
  postMoonLord: {
    melee: [
      { name: "Ark of the Cosmos", source: "calamity" },
      { name: "Dragon Rage", source: "calamity" },
      { name: "Exoblade", source: "calamity" },
      { name: "Zenith", source: "terraria" },
    ],
    ranger: [
      { name: "Tyranny's End", source: "calamity" },
      { name: "Chicken Cannon", source: "calamity" },
      { name: "Photoviscerator", source: "calamity" },
      { name: "S.D.M.G.", source: "terraria" },
    ],
    mage: [
      { name: "Aetherflux Cannon", source: "calamity" },
      { name: "Helium Flash", source: "calamity" },
      { name: "Subsuming Vortex", source: "calamity" },
      { name: "Last Prism", source: "terraria" },
    ],
    summoner: [
      { name: "Yharon's Kindle Staff", source: "calamity" },
      { name: "Temporal Umbrella", source: "calamity" },
      { name: "Ares' Exoskeleton", source: "calamity" },
      { name: "Terraprisma", source: "terraria" },
    ],
    rogue: [
      { name: "Lunar Kunai", source: "calamity" },
      { name: "Reality Rupture", source: "calamity" },
      { name: "Toxicant Twister", source: "calamity" },
      { name: "Dimension-Tearing Disk", source: "calamity" },
      { name: "Celestus", source: "calamity" },
      { name: "Nanoblack Reaper", source: "calamity" },
    ],
  },
};

export const ITEMS_BY_SUBSTAGE_SECTION: Record<
  TierId,
  Record<string, Record<PlayerClass, string[]>>
> = {
  preHardmode: {
    "Pre-Boss": {
      melee: ["Burnt Sienna", "Starfury", "Mandible Claws"],
      ranger: ["Spark Spreader", "Boomstick", "Flintlock Pistol"],
      mage: ["Veering Wind", "Gray Zapinator", "Vilethorn"],
      summoner: ["Enchanted Knife Staff", "Flinx Staff", "Slime Staff"],
      rogue: ["Wulfrum Knife", "Wooden Yoyo"],
    },
    "Pre-Eater of Worlds / Brain of Cthulhu": {
      melee: ["Old Lord Claymore", "Blade of Grass", "Ball O' Hurt"],
      ranger: ["Boomstick", "Minishark", "Firestorm Cannon"],
      mage: ["Night's Ray", "Thunder Zapper", "Aqua Scepter"],
      summoner: ["Snapthorn", "Imp Staff", "Dank Staff"],
      rogue: ["Contaminated Bile", "Scourge of the Desert"],
    },
    "Pre-The Hive Mind / The Perforators": {
      melee: ["Aorta", "Old Lord Claymore", "Fiery Greatsword"],
      ranger: ["Firestorm Cannon", "Minishark", "Bee's Knees"],
      mage: ["Blood Bath", "Thunder Zapper", "Demon Scythe"],
      summoner: ["Dank Staff", "Hornet Staff", "Staff of Necrosteocytes"],
      rogue: ["Scab Ripper", "Sludge Splotch", "Contaminated Bile"],
    },
    "Pre-Skeletron": {
      melee: ["Aorta", "Volcano", "Muramasa"],
      ranger: ["Galeforce", "Minishark", "Hellwing Bow"],
      mage: ["Blood Bath", "Vilethorn", "Water Bolt"],
      summoner: ["Dank Staff", "Imp Staff", "Staff of Necrosteocytes"],
      rogue: ["Aerial Tracker", "Shinobi Blade", "Sludge Splotch"],
    },
    "Pre-Wall of Flesh": {
      melee: ["Wind Blade", "Volcano", "Night's Edge"],
      ranger: ["Shadethrower", "Phoenix Blaster", "The Bee's Knees"],
      mage: ["Night's Ray", "Demon Scythe", "Aqua Scepter"],
      summoner: ["Staff of Necrosteocytes", "Imp Staff", "Hornet Staff"],
      rogue: ["Shinobi Blade", "Metal Monstrosity", "Aerial Tracker"],
    },
  },
  hardmode: {
    "Pre-Mechanical Bosses": {
      melee: ["Comet Quasher", "Shadowflame Knife", "Bladetongue"],
      ranger: ["Needler", "Daedalus Stormbow", "Onyx Blaster"],
      mage: ["Frigidflash Bolt", "Sky Fracture", "Golden Shower"],
      summoner: ["Ancient Ice Chunk", "Optic Staff", "Sanguine Staff"],
      rogue: ["Cobalt Kunai", "Equanimity", "Mycoroot"],
    },
    "Post-Mechanical Boss 1": {
      melee: ["Storm Saber", "Shadowflame Knife", "Bananarang"],
      ranger: ["Onyx Blaster", "Daedalus Stormbow", "Megashark"],
      mage: ["Belching Saxophone", "Sky Fracture", "Golden Shower"],
      summoner: ["Deepsea Staff", "Blade Staff", "Sanguine Staff"],
      rogue: ["Equanimity", "Kelvin Catalyst", "Cobalt Kunai"],
    },
    "Post-Mechanical Boss 2": {
      melee: ["Darklight Greatsword", "True Excalibur", "True Night's Edge"],
      ranger: ["Darkecho Greatbow", "Megashark", "Tsunami"],
      mage: ["Seething Discharge", "Razorblade Typhoon", "Spectre Staff"],
      summoner: ["Daedalus Golem Staff", "Blade Staff", "Durendal"],
      rogue: ["R-PLS: Pulse Grenade", "Stormfront Razor", "Kelvin Catalyst"],
    },
    "Pre-Plantera": {
      melee: ["Majestic Guard", "Terra Blade", "Fetid Baghnakhs"],
      ranger: ["Havoc's Breath", "Tsunami", "Megashark"],
      mage: ["Shadecrystal Barrage", "Razorblade Typhoon", "Spectre Staff"],
      summoner: ["Vengeful Sun Staff", "Blade Staff", "Durendal"],
      rogue: ["Subduction Slicer", "Stormfront Razor", "Raider's Talisman"],
    },
    "Pre-Golem": {
      melee: ["Ark of the Ancients", "Terra Blade", "Chlorophyte Partisan"],
      ranger: ["Flak Kraken", "Tsunami", "Chlorophyte Shotbow"],
      mage: ["Atlantis", "Razorblade Typhoon", "Spectre Staff"],
      summoner: ["Gastric Belcher Staff", "Optic Staff", "Tiki Staff"],
      rogue: ["Apoctolith", "Subduction Slicer", "Prismalline"],
    },
    "Post-Golem": {
      melee: ["Omniblade", "Terra Blade", "Eye of Cthulhu (yoyo)"],
      ranger: ["Aurora Blazer", "Phantasm", "Tsunami"],
      mage: ["Wingman", "Spectre Staff", "Razorblade Typhoon"],
      summoner: ["Wither Blossoms Staff", "Tiki Staff", "Tempest Staff"],
      rogue: ["Doomsday Device", "Subduction Slicer", "Apoctolith"],
    },
    "Pre-Lunar Events": {
      melee: ["Virulence", "Terra Blade", "Eye of Cthulhu (yoyo)"],
      ranger: ["Aerial Bane", "Phantasm", "Vortex Beater"],
      mage: ["Stellar Tune", "Lunar Flare", "Nebula Arcanum"],
      summoner: ["Fuel Cell Bundle", "Dark Harvest", "Stardust Dragon Staff"],
      rogue: ["Duke's Decapitator", "Subduction Slicer", "Doomsday Device"],
    },
    "Pre-Moon Lord": {
      melee: ["Sky Dragon's Fury", "Terra Blade", "Zenith"],
      ranger: ["Dead Sun's Wind", "Phantasm", "Vortex Beater"],
      mage: ["Arch Amaryllis", "Last Prism", "Nebula Arcanum"],
      summoner: [
        "Stardust Dragon Staff",
        "Stardust Cell Staff",
        "Dark Harvest",
      ],
      rogue: ["Star of Destruction", "Duke's Decapitator", "Doomsday Device"],
    },
  },
  postMoonLord: {
    "Pre-Providence": {
      melee: ["Ark of the Elements", "Terratomere", "Astreal Defeat"],
      ranger: ["Planetary Annihilation", "Monsoon", "Elemental Eruption"],
      mage: ["Nuclear Fury", "Genisis", "Voltaic Climax"],
      summoner: [
        "Legion of Celestia",
        "Stardust Dragon Staff",
        "Elemental Axe",
      ],
      rogue: ["Lunar Kunai", "Reality Rupture", "Stellar Striker"],
    },
    "Pre-Polterghast": {
      melee: ["Terratomere", "Ark of the Elements", "Murasama"],
      ranger: [
        "Arterial Assault",
        "Planetary Annihilation",
        "Elemental Eruption",
      ],
      mage: ["Plasma Caster", "Nuclear Fury", "Voltaic Climax"],
      summoner: [
        "Dazzling Stabber Staff",
        "Legion of Celestia",
        "Elemental Axe",
      ],
      rogue: ["Reality Rupture", "Lunar Kunai", "Stellar Striker"],
    },
    "Pre-Devourer of Gods": {
      melee: ["Terror Blade", "Terratomere", "Murasama"],
      ranger: ["Pearl God", "Arterial Assault", "Gauss Rifle"],
      mage: ["Vitriolic Viper", "Plasma Caster", "Voltaic Climax"],
      summoner: [
        "Calamari's Lament",
        "Dazzling Stabber Staff",
        "Resurrection Butterfly",
      ],
      rogue: ["Toxicant Twister", "Reality Rupture", "Celestus"],
    },
    "Pre-Yharon": {
      melee: ["Murasama", "Terror Blade", "Ark of the Cosmos"],
      ranger: ["Riftburst", "Pearl God", "Gauss Rifle"],
      mage: ["Voltaic Climax", "Vitriolic Viper", "Subsuming Vortex"],
      summoner: [
        "Corvid Harbinger Staff",
        "Calamari's Lament",
        "Resurrection Butterfly",
      ],
      rogue: ["Dimension-Tearing Disk", "Toxicant Twister", "Celestus"],
    },
    "Pre-Exo Mechs / Supreme Witch, Calamitas": {
      melee: ["Dragon Rage", "Murasama", "Ark of the Cosmos"],
      ranger: ["Tyranny's End", "Riftburst", "Photoviscerator"],
      mage: ["Aetherflux Cannon", "Voltaic Climax", "Subsuming Vortex"],
      summoner: [
        "Yharon's Kindle Staff",
        "Corvid Harbinger Staff",
        "Ares' Exoskeleton",
      ],
      rogue: ["Wrathwing", "Dimension-Tearing Disk", "Celestus"],
    },
    Endgame: {
      melee: ["Earth", "Exoblade", "Dragon Rage"],
      ranger: ["Contagion", "Tyranny's End", "Photoviscerator"],
      mage: ["Eternity", "Aetherflux Cannon", "Subsuming Vortex"],
      summoner: ["Endogenesis", "Yharon's Kindle Staff", "Ares' Exoskeleton"],
      rogue: ["Nanoblack Reaper", "Wrathwing", "Celestus"],
    },
  },
};

export const ARMOR_BY_SUBSTAGE: Record<
  TierId,
  Record<string, Record<PlayerClass, string[]>>
> = {
  preHardmode: {
    "Pre-Boss": {
      melee: ["Wulfrum Armor"],
      ranger: ["Wulfrum Armor"],
      mage: ["Wulfrum Armor"],
      summoner: ["Wulfrum Armor"],
      rogue: ["Wulfrum Armor"],
    },
    "Pre-Eater of Worlds / Brain of Cthulhu": {
      melee: ["Shadow Armor", "Crimson Armor", "Meteorite Armor"],
      ranger: ["Shadow Armor", "Crimson Armor", "Jungle Armor"],
      mage: ["Meteor Armor", "Jungle Armor", "Shadow Armor"],
      summoner: ["Jungle Armor", "Bee Armor"],
      rogue: ["Aerospec Armor", "Shadow Armor"],
    },
    "Pre-The Hive Mind / The Perforators": {
      melee: ["Shadow Armor", "Crimson Armor", "Jungle Armor"],
      ranger: ["Shadow Armor", "Crimson Armor", "Jungle Armor"],
      mage: ["Meteor Armor", "Jungle Armor"],
      summoner: ["Bee Armor", "Jungle Armor"],
      rogue: ["Aerospec Armor", "Victide Armor"],
    },
    "Pre-Skeletron": {
      melee: ["Jungle Armor", "Shadow Armor", "Crimson Armor"],
      ranger: ["Jungle Armor", "Shadow Armor"],
      mage: ["Jungle Armor", "Meteor Armor"],
      summoner: ["Bee Armor", "Jungle Armor"],
      rogue: ["Aerospec Armor", "Sulphurous Armor"],
    },
    "Pre-Wall of Flesh": {
      melee: ["Molten Armor", "Jungle Armor"],
      ranger: ["Molten Armor", "Jungle Armor"],
      mage: ["Jungle Armor", "Meteor Armor"],
      summoner: ["Spider Armor", "Bee Armor"],
      rogue: ["Victide Armor", "Aerospec Armor"],
    },
  },
  hardmode: {
    "Pre-Mechanical Bosses": {
      melee: ["Palladium Armor", "Orichalcum Armor", "Titanium Armor"],
      ranger: ["Palladium Armor", "Orichalcum Armor", "Titanium Armor"],
      mage: ["Palladium Armor", "Orichalcum Armor", "Titanium Armor"],
      summoner: ["Forbidden Armor", "Orichalcum Armor", "Palladium Armor"],
      rogue: ["Statigel Armor", "Palladium Armor", "Orichalcum Armor"],
    },
    "Post-Mechanical Boss 1": {
      melee: ["Frost Armor", "Hallowed Armor", "Titanium Armor"],
      ranger: ["Frost Armor", "Hallowed Armor", "Titanium Armor"],
      mage: ["Hallowed Armor", "Titanium Armor"],
      summoner: ["Hallowed Armor", "Forbidden Armor"],
      rogue: ["Umbraphile Armor", "Hallowed Armor"],
    },
    "Post-Mechanical Boss 2": {
      melee: ["Hallowed Armor", "Frost Armor"],
      ranger: ["Hallowed Armor", "Frost Armor"],
      mage: ["Hallowed Armor"],
      summoner: ["Hallowed Armor", "Spooky Armor"],
      rogue: ["Hallowed Armor", "Umbraphile Armor"],
    },
    "Pre-Plantera": {
      melee: ["Chlorophyte Armor", "Turtle Armor", "Hallowed Armor"],
      ranger: ["Chlorophyte Armor", "Hallowed Armor"],
      mage: ["Chlorophyte Armor", "Spectre Armor", "Hallowed Armor"],
      summoner: ["Spooky Armor", "Chlorophyte Armor"],
      rogue: ["Darkeclipse Armor", "Chlorophyte Armor"],
    },
    "Pre-Golem": {
      melee: ["Turtle Armor", "Chlorophyte Armor"],
      ranger: ["Chlorophyte Armor", "Shroomite Armor"],
      mage: ["Spectre Armor", "Chlorophyte Armor"],
      summoner: ["Spooky Armor", "Tiki Armor"],
      rogue: ["Brimflame Armor", "Chlorophyte Armor"],
    },
    "Post-Golem": {
      melee: ["Beetle Armor", "Turtle Armor"],
      ranger: ["Shroomite Armor", "Chlorophyte Armor"],
      mage: ["Spectre Armor"],
      summoner: ["Spooky Armor", "Tiki Armor"],
      rogue: ["Brimflame Armor"],
    },
    "Pre-Lunar Events": {
      melee: ["Beetle Armor"],
      ranger: ["Shroomite Armor"],
      mage: ["Spectre Armor"],
      summoner: ["Spooky Armor", "Tiki Armor"],
      rogue: ["Brimflame Armor"],
    },
    "Pre-Moon Lord": {
      melee: ["Beetle Armor"],
      ranger: ["Shroomite Armor"],
      mage: ["Spectre Armor"],
      summoner: ["Spooky Armor"],
      rogue: ["Silva Armor", "Brimflame Armor"],
    },
  },
  postMoonLord: {
    "Pre-Providence": {
      melee: ["Silva Armor", "Tarragon Armor"],
      ranger: ["Silva Armor", "Tarragon Armor"],
      mage: ["Tarragon Armor", "Nebula Armor"],
      summoner: ["Tarragon Armor"],
      rogue: ["Tarragon Armor"],
    },
    "Pre-Polterghast": {
      melee: ["Tarragon Armor", "Silva Armor"],
      ranger: ["Tarragon Armor"],
      mage: ["Tarragon Armor"],
      summoner: ["Tarragon Armor"],
      rogue: ["Tarragon Armor"],
    },
    "Pre-Devourer of Gods": {
      melee: ["Bloodflare Armor", "God Slayer Armor"],
      ranger: ["Bloodflare Armor", "God Slayer Armor"],
      mage: ["Astral Armor", "Bloodflare Armor"],
      summoner: ["Bloodflare Armor"],
      rogue: ["Bloodflare Armor"],
    },
    "Pre-Yharon": {
      melee: ["God Slayer Armor", "Bloodflare Armor"],
      ranger: ["God Slayer Armor", "Bloodflare Armor"],
      mage: ["God Slayer Armor", "Bloodflare Armor"],
      summoner: ["God Slayer Armor"],
      rogue: ["God Slayer Armor"],
    },
    "Pre-Exo Mechs / Supreme Witch, Calamitas": {
      melee: ["Auric Tesla Armor", "God Slayer Armor"],
      ranger: ["Auric Tesla Armor", "God Slayer Armor"],
      mage: ["Auric Tesla Armor", "God Slayer Armor"],
      summoner: ["Auric Tesla Armor"],
      rogue: ["Auric Tesla Armor"],
    },
    Endgame: {
      melee: ["Auric Tesla Armor"],
      ranger: ["Auric Tesla Armor"],
      mage: ["Auric Tesla Armor"],
      summoner: ["Auric Tesla Armor"],
      rogue: ["Auric Tesla Armor"],
    },
  },
};

export interface WikiAccessoryItem {
  name: string;
  url: string;
  source: RecommendationSource;
}

export interface AccessorySubstageData {
  allAround: WikiAccessoryItem[];
  mobility: WikiAccessoryItem[];
  classByType: Partial<Record<PlayerClass, WikiAccessoryItem[]>>;
}

const CALAMITY = "calamity" as const;
const TERRARIA = "terraria" as const;

export const ACCESSORY_RECOMMENDATIONS_BY_SUBSTAGE: Record<
  TierId,
  Record<string, AccessorySubstageData>
> = {
  preHardmode: {
    "Pre-Boss": {
      allAround: [
        {
          name: "Black Glass Band",
          url: "https://calamitymod.wiki.gg/wiki/Black_Glass_Band",
          source: CALAMITY,
        },
        {
          name: "Craw Carapace",
          url: "https://calamitymod.wiki.gg/wiki/Craw_Carapace",
          source: CALAMITY,
        },
        {
          name: "Shark Tooth Necklace",
          url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
          source: TERRARIA,
        },
      ],
      mobility: [
        {
          name: "Hermes Boots",
          url: "https://terraria.wiki.gg/wiki/Hermes_Boots",
          source: TERRARIA,
        },
        {
          name: "Frog Leg",
          url: "https://terraria.wiki.gg/wiki/Frog_Leg",
          source: TERRARIA,
        },
        {
          name: "Extra jump accessories",
          url: "https://terraria.wiki.gg/wiki/Extra_jump",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Feral Claws",
            url: "https://terraria.wiki.gg/wiki/Feral_Claws",
            source: TERRARIA,
          },
          {
            name: "Craw Carapace",
            url: "https://calamitymod.wiki.gg/wiki/Craw_Carapace",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Shark Tooth Necklace",
            url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
            source: TERRARIA,
          },
          {
            name: "Scions Curio",
            url: "https://calamitymod.wiki.gg/wiki/Scions_Curio",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Band of Starpower",
            url: "https://terraria.wiki.gg/wiki/Band_of_Starpower",
            source: TERRARIA,
          },
          {
            name: "Black Glass Band",
            url: "https://calamitymod.wiki.gg/wiki/Black_Glass_Band",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Wulfrum Battery",
            url: "https://calamitymod.wiki.gg/wiki/Wulfrum_Battery",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Scions Curio",
            url: "https://calamitymod.wiki.gg/wiki/Scions_Curio",
            source: CALAMITY,
          },
          {
            name: "Wulfrum Battery",
            url: "https://calamitymod.wiki.gg/wiki/Wulfrum_Battery",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Eater of Worlds / Brain of Cthulhu": {
      allAround: [
        {
          name: "Fungal Clump",
          url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
          source: CALAMITY,
        },
        {
          name: "Brain of Confusion",
          url: "https://terraria.wiki.gg/wiki/Brain_of_Confusion",
          source: TERRARIA,
        },
        {
          name: "Worm Scarf",
          url: "https://terraria.wiki.gg/wiki/Worm_Scarf",
          source: TERRARIA,
        },
      ],
      mobility: [
        {
          name: "Bundle of Horseshoe Balloons",
          url: "https://terraria.wiki.gg/wiki/Bundle_of_Horseshoe_Balloons",
          source: TERRARIA,
        },
        {
          name: "Lightning Boots",
          url: "https://terraria.wiki.gg/wiki/Lightning_Boots",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Fungal Clump",
            url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
            source: CALAMITY,
          },
          {
            name: "Worm Scarf",
            url: "https://terraria.wiki.gg/wiki/Worm_Scarf",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Fungal Clump",
            url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
            source: CALAMITY,
          },
          {
            name: "Shark Tooth Necklace",
            url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Magic Cuffs",
            url: "https://terraria.wiki.gg/wiki/Magic_Cuffs",
            source: TERRARIA,
          },
          {
            name: "Mana Flower",
            url: "https://terraria.wiki.gg/wiki/Mana_Flower",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Fungal Clump",
            url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Fungal Clump",
            url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
            source: CALAMITY,
          },
          {
            name: "Shark Tooth Necklace",
            url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
            source: TERRARIA,
          },
        ],
      },
    },
    "Pre-The Hive Mind / The Perforators": {
      allAround: [
        {
          name: "Fungal Clump",
          url: "https://calamitymod.wiki.gg/wiki/Fungal_Clump",
          source: CALAMITY,
        },
        {
          name: "Spirit Glyph",
          url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Lightning Boots",
          url: "https://terraria.wiki.gg/wiki/Lightning_Boots",
          source: TERRARIA,
        },
        {
          name: "Frog Leg",
          url: "https://terraria.wiki.gg/wiki/Frog_Leg",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Feral Claws",
            url: "https://terraria.wiki.gg/wiki/Feral_Claws",
            source: TERRARIA,
          },
          {
            name: "Bloody Worm Tooth",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Protolith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Protolith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Shark Tooth Necklace",
            url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Batholith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Batholith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Mana Flower",
            url: "https://terraria.wiki.gg/wiki/Mana_Flower",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Protolith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Protolith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Bloody Worm Tooth",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Skeletron": {
      allAround: [
        {
          name: "Bloody Worm Tooth",
          url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
          source: CALAMITY,
        },
        {
          name: "Brain of Confusion",
          url: "https://terraria.wiki.gg/wiki/Brain_of_Confusion",
          source: TERRARIA,
        },
        {
          name: "Worm Scarf",
          url: "https://terraria.wiki.gg/wiki/Worm_Scarf",
          source: TERRARIA,
        },
      ],
      mobility: [
        {
          name: "Bundle of Horseshoe Balloons",
          url: "https://terraria.wiki.gg/wiki/Bundle_of_Horseshoe_Balloons",
          source: TERRARIA,
        },
        {
          name: "Skyline Wings",
          url: "https://calamitymod.wiki.gg/wiki/Skyline_Wings",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Bloody Worm Tooth",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
            source: CALAMITY,
          },
          {
            name: "Feral Claws",
            url: "https://terraria.wiki.gg/wiki/Feral_Claws",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Protolith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Protolith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Magic Quiver",
            url: "https://terraria.wiki.gg/wiki/Magic_Quiver",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Batholith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Batholith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Magic Cuffs",
            url: "https://terraria.wiki.gg/wiki/Magic_Cuffs",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Counter Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Counter_Scarf",
            source: CALAMITY,
          },
          {
            name: "Bloody Worm Tooth",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Wall of Flesh": {
      allAround: [
        {
          name: "Counter Scarf",
          url: "https://calamitymod.wiki.gg/wiki/Counter_Scarf",
          source: CALAMITY,
        },
        {
          name: "Bone Glove",
          url: "https://terraria.wiki.gg/wiki/Bone_Glove",
          source: TERRARIA,
        },
      ],
      mobility: [
        {
          name: "Terraspark Boots",
          url: "https://terraria.wiki.gg/wiki/Terraspark_Boots",
          source: TERRARIA,
        },
        {
          name: "Skyline Wings",
          url: "https://calamitymod.wiki.gg/wiki/Skyline_Wings",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Feral Claws",
            url: "https://terraria.wiki.gg/wiki/Feral_Claws",
            source: TERRARIA,
          },
          {
            name: "Bloody Worm Tooth",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Tooth",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Protolith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Protolith_Bangle",
            source: CALAMITY,
          },
          {
            name: "Shark Tooth Necklace",
            url: "https://terraria.wiki.gg/wiki/Shark_Tooth_Necklace",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Mana Flower",
            url: "https://terraria.wiki.gg/wiki/Mana_Flower",
            source: TERRARIA,
          },
          {
            name: "Batholith Bangle",
            url: "https://calamitymod.wiki.gg/wiki/Batholith_Bangle",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Jelly-Charged Battery",
            url: "https://calamitymod.wiki.gg/wiki/Jelly-Charged_Battery",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Counter Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Counter_Scarf",
            source: CALAMITY,
          },
          {
            name: "Skyline Wings",
            url: "https://calamitymod.wiki.gg/wiki/Skyline_Wings",
            source: CALAMITY,
          },
        ],
      },
    },
  },
  hardmode: {
    "Pre-Mechanical Bosses": {
      allAround: [
        {
          name: "Amalgamated Brain",
          url: "https://calamitymod.wiki.gg/wiki/Amalgamated_Brain",
          source: CALAMITY,
        },
        {
          name: "Grand Gelatin",
          url: "https://calamitymod.wiki.gg/wiki/Grand_Gelatin",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Angel Wings",
          url: "https://terraria.wiki.gg/wiki/Angel_Wings",
          source: TERRARIA,
        },
        {
          name: "Fairy Boots",
          url: "https://calamitymod.wiki.gg/wiki/Fairy_Boots",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Bloody Worm Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Scarf",
            source: CALAMITY,
          },
          {
            name: "Warrior Emblem",
            url: "https://terraria.wiki.gg/wiki/Warrior_Emblem",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Magic Quiver",
            url: "https://terraria.wiki.gg/wiki/Magic_Quiver",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
          {
            name: "Celestial Cuffs",
            url: "https://terraria.wiki.gg/wiki/Celestial_Cuffs",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Rogue Emblem",
            url: "https://calamitymod.wiki.gg/wiki/Rogue_Emblem",
            source: CALAMITY,
          },
          {
            name: "Counter Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Counter_Scarf",
            source: CALAMITY,
          },
        ],
      },
    },
    "Post-Mechanical Boss 1": {
      allAround: [
        {
          name: "Amalgamated Brain",
          url: "https://calamitymod.wiki.gg/wiki/Amalgamated_Brain",
          source: CALAMITY,
        },
        {
          name: "Moon Stone",
          url: "https://calamitymod.wiki.gg/wiki/Moon_Stone",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Butterfly Wings",
          url: "https://terraria.wiki.gg/wiki/Butterfly_Wings",
          source: TERRARIA,
        },
        {
          name: "Flame Wings",
          url: "https://terraria.wiki.gg/wiki/Flame_Wings",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Bloody Worm Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Scarf",
            source: CALAMITY,
          },
          {
            name: "Mechanical Glove",
            url: "https://terraria.wiki.gg/wiki/Mechanical_Glove",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
          {
            name: "Summoner Emblem",
            url: "https://terraria.wiki.gg/wiki/Summoner_Emblem",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Rogue Emblem",
            url: "https://calamitymod.wiki.gg/wiki/Rogue_Emblem",
            source: CALAMITY,
          },
          {
            name: "Nanotech",
            url: "https://calamitymod.wiki.gg/wiki/Nanotech",
            source: CALAMITY,
          },
        ],
      },
    },
    "Post-Mechanical Boss 2": {
      allAround: [
        {
          name: "Amalgamated Brain",
          url: "https://calamitymod.wiki.gg/wiki/Amalgamated_Brain",
          source: CALAMITY,
        },
        {
          name: "Grand Gelatin",
          url: "https://calamitymod.wiki.gg/wiki/Grand_Gelatin",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Flame Wings",
          url: "https://terraria.wiki.gg/wiki/Flame_Wings",
          source: TERRARIA,
        },
        {
          name: "Fairy Boots",
          url: "https://calamitymod.wiki.gg/wiki/Fairy_Boots",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Warrior Emblem",
            url: "https://terraria.wiki.gg/wiki/Warrior_Emblem",
            source: TERRARIA,
          },
          {
            name: "Bloody Worm Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Scarf",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Summoner Emblem",
            url: "https://terraria.wiki.gg/wiki/Summoner_Emblem",
            source: TERRARIA,
          },
          {
            name: "Spirit Glyph",
            url: "https://calamitymod.wiki.gg/wiki/Spirit_Glyph",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Rogue Emblem",
            url: "https://calamitymod.wiki.gg/wiki/Rogue_Emblem",
            source: CALAMITY,
          },
          {
            name: "Nanotech",
            url: "https://calamitymod.wiki.gg/wiki/Nanotech",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Plantera": {
      allAround: [
        {
          name: "Amalgamated Brain",
          url: "https://calamitymod.wiki.gg/wiki/Amalgamated_Brain",
          source: CALAMITY,
        },
        {
          name: "Moon Stone",
          url: "https://calamitymod.wiki.gg/wiki/Moon_Stone",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Angel Treads",
          url: "https://calamitymod.wiki.gg/wiki/Angel_Treads",
          source: CALAMITY,
        },
        {
          name: "Ornate Shield",
          url: "https://calamitymod.wiki.gg/wiki/Ornate_Shield",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Mechanical Glove",
            url: "https://terraria.wiki.gg/wiki/Mechanical_Glove",
            source: TERRARIA,
          },
          {
            name: "Abaddon",
            url: "https://calamitymod.wiki.gg/wiki/Abaddon",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Hallowed Rune",
            url: "https://calamitymod.wiki.gg/wiki/Hallowed_Rune",
            source: CALAMITY,
          },
          {
            name: "Summoner Emblem",
            url: "https://terraria.wiki.gg/wiki/Summoner_Emblem",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Rogue Emblem",
            url: "https://calamitymod.wiki.gg/wiki/Rogue_Emblem",
            source: CALAMITY,
          },
          {
            name: "The Black Spot",
            url: "https://terraria.wiki.gg/wiki/The_Black_Spot",
            source: TERRARIA,
          },
        ],
      },
    },
    "Pre-Golem": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
        {
          name: "Amalgamated Brain",
          url: "https://calamitymod.wiki.gg/wiki/Amalgamated_Brain",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Asgard's Valor",
          url: "https://calamitymod.wiki.gg/wiki/Asgard%27s_Valor",
          source: CALAMITY,
        },
        {
          name: "Master Ninja Gear",
          url: "https://terraria.wiki.gg/wiki/Master_Ninja_Gear",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Sand Shark Tooth Necklace",
            url: "https://calamitymod.wiki.gg/wiki/Sand_Shark_Tooth_Necklace",
            source: CALAMITY,
          },
          {
            name: "Fire Gauntlet",
            url: "https://terraria.wiki.gg/wiki/Fire_Gauntlet",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Arcane Flower",
            url: "https://terraria.wiki.gg/wiki/Arcane_Flower",
            source: TERRARIA,
          },
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Hallowed Rune",
            url: "https://calamitymod.wiki.gg/wiki/Hallowed_Rune",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Rogue Emblem",
            url: "https://calamitymod.wiki.gg/wiki/Rogue_Emblem",
            source: CALAMITY,
          },
          {
            name: "Statis' Void Sash",
            url: "https://calamitymod.wiki.gg/wiki/Statis%27_Void_Sash",
            source: CALAMITY,
          },
        ],
      },
    },
    "Post-Golem": {
      allAround: [
        {
          name: "Celestial Shell",
          url: "https://terraria.wiki.gg/wiki/Celestial_Shell",
          source: TERRARIA,
        },
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Hadal Mantle",
          url: "https://calamitymod.wiki.gg/wiki/Hadal_Mantle",
          source: CALAMITY,
        },
        {
          name: "Asgard's Valor",
          url: "https://calamitymod.wiki.gg/wiki/Asgard%27s_Valor",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Destroyer Emblem",
            url: "https://terraria.wiki.gg/wiki/Destroyer_Emblem",
            source: TERRARIA,
          },
          {
            name: "Fire Gauntlet",
            url: "https://terraria.wiki.gg/wiki/Fire_Gauntlet",
            source: TERRARIA,
          },
        ],
        ranger: [
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
          {
            name: "Recon Scope",
            url: "https://terraria.wiki.gg/wiki/Sniper_Scope",
            source: TERRARIA,
          },
        ],
        mage: [
          {
            name: "Arcane Flower",
            url: "https://terraria.wiki.gg/wiki/Arcane_Flower",
            source: TERRARIA,
          },
          {
            name: "Destroyer Emblem",
            url: "https://terraria.wiki.gg/wiki/Destroyer_Emblem",
            source: TERRARIA,
          },
        ],
        summoner: [
          {
            name: "Hallowed Rune",
            url: "https://calamitymod.wiki.gg/wiki/Hallowed_Rune",
            source: CALAMITY,
          },
          {
            name: "Celestial Shell",
            url: "https://terraria.wiki.gg/wiki/Celestial_Shell",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Statis' Void Sash",
            url: "https://calamitymod.wiki.gg/wiki/Statis%27_Void_Sash",
            source: CALAMITY,
          },
          {
            name: "Silencing Sheath",
            url: "https://calamitymod.wiki.gg/wiki/Silencing_Sheath",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Lunar Events": {
      allAround: [
        {
          name: "Celestial Shell",
          url: "https://terraria.wiki.gg/wiki/Celestial_Shell",
          source: TERRARIA,
        },
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Asgard's Valor",
          url: "https://calamitymod.wiki.gg/wiki/Asgard%27s_Valor",
          source: CALAMITY,
        },
        {
          name: "Angel Treads",
          url: "https://calamitymod.wiki.gg/wiki/Angel_Treads",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Berserker's Glove",
            url: "https://terraria.wiki.gg/wiki/Berserker%27s_Glove",
            source: TERRARIA,
          },
          {
            name: "Bloody Worm Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Scarf",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Hallowed Rune",
            url: "https://calamitymod.wiki.gg/wiki/Hallowed_Rune",
            source: CALAMITY,
          },
          {
            name: "Pygmy Necklace",
            url: "https://terraria.wiki.gg/wiki/Pygmy_Necklace",
            source: TERRARIA,
          },
        ],
        rogue: [
          {
            name: "Silencing Sheath",
            url: "https://calamitymod.wiki.gg/wiki/Silencing_Sheath",
            source: CALAMITY,
          },
          {
            name: "Statis' Void Sash",
            url: "https://calamitymod.wiki.gg/wiki/Statis%27_Void_Sash",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Moon Lord": {
      allAround: [
        {
          name: "The Absorber",
          url: "https://calamitymod.wiki.gg/wiki/The_Absorber",
          source: CALAMITY,
        },
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Asgard's Valor",
          url: "https://calamitymod.wiki.gg/wiki/Asgard%27s_Valor",
          source: CALAMITY,
        },
        {
          name: "Master Ninja Gear",
          url: "https://terraria.wiki.gg/wiki/Master_Ninja_Gear",
          source: TERRARIA,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Warrior Emblem",
            url: "https://terraria.wiki.gg/wiki/Warrior_Emblem",
            source: TERRARIA,
          },
          {
            name: "Bloody Worm Scarf",
            url: "https://calamitymod.wiki.gg/wiki/Bloody_Worm_Scarf",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Ranger Emblem",
            url: "https://terraria.wiki.gg/wiki/Ranger_Emblem",
            source: TERRARIA,
          },
          {
            name: "Deadshot Brooch",
            url: "https://calamitymod.wiki.gg/wiki/Deadshot_Brooch",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Celestial Emblem",
            url: "https://terraria.wiki.gg/wiki/Celestial_Emblem",
            source: TERRARIA,
          },
          {
            name: "Permafrost's Concoction",
            url: "https://calamitymod.wiki.gg/wiki/Permafrost%27s_Concoction",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Heart of the Elements",
            url: "https://calamitymod.wiki.gg/wiki/Heart_of_the_Elements",
            source: CALAMITY,
          },
          {
            name: "Hallowed Rune",
            url: "https://calamitymod.wiki.gg/wiki/Hallowed_Rune",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Silencing Sheath",
            url: "https://calamitymod.wiki.gg/wiki/Silencing_Sheath",
            source: CALAMITY,
          },
          {
            name: "Statis' Void Sash",
            url: "https://calamitymod.wiki.gg/wiki/Statis%27_Void_Sash",
            source: CALAMITY,
          },
        ],
      },
    },
  },
  postMoonLord: {
    "Pre-Providence": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Ambrosial Ampoule",
            url: "https://calamitymod.wiki.gg/wiki/Ambrosial_Ampoule",
            source: CALAMITY,
          },
          {
            name: "The Absorber",
            url: "https://calamitymod.wiki.gg/wiki/The_Absorber",
            source: CALAMITY,
          },
          {
            name: "The Community",
            url: "https://calamitymod.wiki.gg/wiki/The_Community",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Polterghast": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "The Evolution",
            url: "https://calamitymod.wiki.gg/wiki/The_Evolution",
            source: CALAMITY,
          },
          {
            name: "The Absorber",
            url: "https://calamitymod.wiki.gg/wiki/The_Absorber",
            source: CALAMITY,
          },
          {
            name: "The Community",
            url: "https://calamitymod.wiki.gg/wiki/The_Community",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Devourer of Gods": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Affliction",
            url: "https://calamitymod.wiki.gg/wiki/Affliction",
            source: CALAMITY,
          },
          {
            name: "The Evolution",
            url: "https://calamitymod.wiki.gg/wiki/The_Evolution",
            source: CALAMITY,
          },
          {
            name: "The Absorber",
            url: "https://calamitymod.wiki.gg/wiki/The_Absorber",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Yharon": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Affliction",
            url: "https://calamitymod.wiki.gg/wiki/Affliction",
            source: CALAMITY,
          },
          {
            name: "Dark Sun Ring",
            url: "https://calamitymod.wiki.gg/wiki/Dark_Sun_Ring",
            source: CALAMITY,
          },
          {
            name: "The Amalgam",
            url: "https://calamitymod.wiki.gg/wiki/The_Amalgam",
            source: CALAMITY,
          },
        ],
      },
    },
    "Pre-Exo Mechs / Supreme Witch, Calamitas": {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Affliction",
            url: "https://calamitymod.wiki.gg/wiki/Affliction",
            source: CALAMITY,
          },
          {
            name: "Dark Sun Ring",
            url: "https://calamitymod.wiki.gg/wiki/Dark_Sun_Ring",
            source: CALAMITY,
          },
          {
            name: "The Amalgam",
            url: "https://calamitymod.wiki.gg/wiki/The_Amalgam",
            source: CALAMITY,
          },
        ],
      },
    },
    Endgame: {
      allAround: [
        {
          name: "The Community",
          url: "https://calamitymod.wiki.gg/wiki/The_Community",
          source: CALAMITY,
        },
      ],
      mobility: [
        {
          name: "Seraph Tracers",
          url: "https://calamitymod.wiki.gg/wiki/Seraph_Tracers",
          source: CALAMITY,
        },
      ],
      classByType: {
        melee: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        ranger: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        mage: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        summoner: [
          {
            name: "Dimensional Soul Artifact",
            url: "https://calamitymod.wiki.gg/wiki/Dimensional_Soul_Artifact",
            source: CALAMITY,
          },
        ],
        rogue: [
          {
            name: "Shattered Community",
            url: "https://calamitymod.wiki.gg/wiki/Shattered_Community",
            source: CALAMITY,
          },
          {
            name: "The Absorber",
            url: "https://calamitymod.wiki.gg/wiki/The_Absorber",
            source: CALAMITY,
          },
          {
            name: "The Evolution",
            url: "https://calamitymod.wiki.gg/wiki/The_Evolution",
            source: CALAMITY,
          },
        ],
      },
    },
  },
};

export const HEALTH_AND_HEARTS_GUIDE = [
  {
    title: "Inicio del mundo (Pre-Boss)",
    detail:
      "Calamity Guide:Class_setups/Pre-Hardmode indica empezar aumentando vida y mana. Terraria Guide:Class_setups marca que el gearing inicial viene de biomas de superficie no-corruptos y del pure underground layer.",
    source: "calamity + terraria class setups",
  },
  {
    title: "Umbral de 200 HP",
    detail:
      "Terraria Guide:Class_setups indica que al obtener 200 de vida puede aparecer Goblin Army; esto desbloquea al Goblin Tinkerer y el Tinkerer's Workshop para combinar accesorios.",
    source: "terraria class setups pre-bosses section",
  },
  {
    title: "Inicio de Hardmode",
    detail:
      "Calamity Guide:Class_setups/Hardmode indica que Life Fruits estan disponibles inmediatamente al entrar en Hardmode.",
    source: "calamity hardmode class setups",
  },
  {
    title: "Despues del ultimo Mechanical Boss",
    detail:
      "Calamity Guide:Class_setups/Hardmode indica que puedes craftear Sanguine Tangerine para aumentar la vida maxima.",
    source: "calamity hardmode pre-plantera section",
  },
  {
    title: "Post-Golem",
    detail:
      "Calamity Guide:Class_setups/Hardmode recomienda consumir Miracle Fruit para aumentar la vida maxima.",
    source: "calamity hardmode post-golem section",
  },
] as const;

export const DIFFICULTY_TIPS: Record<Difficulty, string[]> = {
  normal: [
    "Prioriza movilidad basica antes de forzar DPS.",
    "Usa buffos simples en cada boss importante.",
  ],
  expert: [
    "Arma una arena mas larga y con capas verticales.",
    "No inicies boss sin pociones activas.",
  ],
  revengeance: [
    "Mantiene una build estable y evita improvisar entre intentos.",
    "Sube el dano solo si ya tienes supervivencia consistente.",
  ],
  death: [
    "Entra con setup completo y ruta de escape definida.",
    "No avances al siguiente boss si faltan checkpoints de equipo.",
  ],
};
