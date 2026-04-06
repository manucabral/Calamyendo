"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACCESSORY_RECOMMENDATIONS_BY_SUBSTAGE,
  ARMOR_BY_SUBSTAGE,
  BOSSES_BY_TIER,
  CALAMITY_CLASS_SUBSTAGES,
  CALAMITY_WIKI_SOURCES,
  CLASS_ACCESSIBLE_ITEMS,
  DEFAULT_STARTUP_PROFILE,
  DIFFICULTY_TIPS,
  HEALTH_AND_HEARTS_GUIDE,
  ITEMS_BY_SUBSTAGE_SECTION,
  TERRARIA_SUPPORT_STAGES,
  TIER_LABELS,
  type AccessorySubstageData,
  type ChecklistItem,
  type Difficulty,
  type LanguageCode,
  type PlayerClass,
  type RecommendationSource,
  type StartupProfile,
  type TierId,
  type WikiAccessoryItem,
  type WorldEvil,
} from "@/data/calamityNow";

const PROFILE_STORAGE_KEY = "calamyendo.startupProfile.v2";
const BOSSES_STORAGE_KEY = "calamyendo.defeatedBosses.v2";
const ITEMS_STORAGE_KEY = "calamyendo.obtainedItems.v2";
const NEXT_ITEM_STORAGE_KEY = "calamyendo.nextItem.v2";
const ACCESSORIES_STORAGE_KEY = "calamyendo.obtainedAccessories.v1";
const ARMOR_STORAGE_KEY = "calamyendo.obtainedArmor.v1";

const CLASS_LABELS: Record<PlayerClass, string> = {
  melee: "Melee",
  ranger: "Ranger",
  mage: "Mage",
  summoner: "Summoner",
  rogue: "Rogue",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  normal: "Normal",
  expert: "Expert",
  revengeance: "Revengeance",
  death: "Death",
};

const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  es: "Espanol",
  en: "English",
};

const WORLD_EVIL_LABELS: Record<WorldEvil, string> = {
  corruption: "Corruption",
  crimson: "Crimson",
};

const SOURCE_LABELS: Record<RecommendationSource, string> = {
  calamity: "Calamity",
  terraria: "Terraria",
};

const VERIFIED_BOSS_COMBAT_TIPS: Record<string, { en: string; es: string }> = {
  "king slime": {
    en: "Piercing weapons can damage King Slime and also clear the extra slimes he summons.",
    es: "Las armas con penetracion pueden danar a King Slime y tambien limpiar los slimes extra que invoca.",
  },
  "eye of cthulhu": {
    en: "Eye of Cthulhu is most vulnerable during its transformation because it does not move or attack in that brief window.",
    es: "Eye of Cthulhu es mas vulnerable durante su transformacion porque en esa ventana breve no se mueve ni ataca.",
  },
  "desert scourge": {
    en: "Desert Scourge becomes enraged if the player leaves the Desert, so the fight should stay inside the biome.",
    es: "Desert Scourge entra en enfurecimiento si el jugador sale del Desierto, por lo que la pelea debe mantenerse dentro del bioma.",
  },
};

interface WikiMetaEntry {
  title: string;
  source: RecommendationSource;
  pageUrl: string;
  imageUrl?: string;
  summary?: string;
  combatTip?: string;
  acquisitionHint?: string;
  acquisitionTags?: string[];
}

interface WikiLookupEntry {
  title: string;
  source: RecommendationSource;
}

type IconKind = "boss" | "item" | "accessory";

const VANILLA_BOSSES = new Set<string>([
  "King Slime",
  "Eye of Cthulhu",
  "Eater of Worlds",
  "Brain of Cthulhu",
  "Queen Bee",
  "Skeletron",
  "Wall of Flesh",
  "Queen Slime",
  "The Twins",
  "The Destroyer",
  "Skeletron Prime",
  "Plantera",
  "Golem",
  "Lunatic Cultist",
  "Moon Lord",
]);

const VANILLA_ARMORS = new Set<string>([
  "gi",
  "gold armor",
  "platinum armor",
  "silver armor",
  "gladiator armor",
  "fossil armor",
  "jungle armor",
  "shadow armor",
  "crimson armor",
  "molten armor",
  "meteor armor",
  "bee armor",
  "obsidian armor",
  "necro armor",
  "spider armor",
  "cobalt armor",
  "palladium armor",
  "mythril armor",
  "orichalcum armor",
  "adamantite armor",
  "titanium armor",
  "forbidden armor",
  "hallowed armor",
  "chlorophyte armor",
  "turtle armor",
  "spectre armor",
  "beetle armor",
  "shroomite armor",
  "tiki armor",
  "spooky armor",
  "solar flare armor",
  "vortex armor",
  "nebula armor",
  "stardust armor",
  "valhalla knight armor",
  "squire armor",
  "monk armor",
  "apprentice armor",
  "shinobi infiltrator armor",
  "crystal assassin armor",
  "flinx fur coat",
  "diamond robe",
  "mystic robe",
  "magic hat",
  "wizard hat",
]);

const HARDMODE_BOSS_SEQUENCE = [
  "Queen Slime",
  "Cryogen",
  "The Twins",
  "Aquatic Scourge",
  "The Destroyer",
  "Brimstone Elemental",
  "Skeletron Prime",
  "Calamitas Clone",
  "Plantera",
  "Leviathan and Anahita",
  "Astrum Aureus",
  "Golem",
  "The Plaguebringer Goliath",
  "Ravager",
  "Lunatic Cultist",
  "Astrum Deus",
  "Moon Lord",
] as const;

const BOSS_TO_SUBSTAGE_HINT: Record<string, string> = {
  "Desert Scourge": "Pre-Boss",
  Crabulon: "Pre-Eater of Worlds / Brain of Cthulhu",
  "The Hive Mind": "Pre-The Hive Mind / The Perforators",
  "The Perforators": "Pre-The Hive Mind / The Perforators",
  "The Slime God": "Pre-Skeletron",
  "Wall of Flesh": "Pre-Wall of Flesh",
  "King Slime": "Pre-Boss",
  "Eye of Cthulhu": "Pre-Eater of Worlds / Brain of Cthulhu",
  "Eater of Worlds": "Pre-Eater of Worlds / Brain of Cthulhu",
  "Brain of Cthulhu": "Pre-Eater of Worlds / Brain of Cthulhu",
  "Queen Bee": "Pre-Skeletron",
  Skeletron: "Pre-Skeletron",
  "Queen Slime": "Pre-Mechanical Bosses",
  "The Twins": "Post-Mechanical Boss 1",
  "The Destroyer": "Post-Mechanical Boss 1",
  "Skeletron Prime": "Post-Mechanical Boss 2",
  Plantera: "Pre-Plantera",
  Golem: "Pre-Golem",
  "Lunatic Cultist": "Pre-Lunar Events",
  Cryogen: "Pre-Mechanical Bosses",
  "Aquatic Scourge": "Post-Mechanical Boss 1",
  "Brimstone Elemental": "Post-Mechanical Boss 2",
  "Calamitas Clone": "Pre-Plantera",
  "Leviathan and Anahita": "Pre-Golem",
  "Astrum Aureus": "Pre-Golem",
  "The Plaguebringer Goliath": "Pre-Lunar Events",
  Ravager: "Pre-Lunar Events",
  "Astrum Deus": "Pre-Moon Lord",
  "Profaned Guardians": "Pre-Providence",
  Dragonfolly: "Pre-Providence",
  "Providence, the Profaned Goddess": "Pre-Polterghast",
  "Storm Weaver": "Pre-Devourer of Gods",
  "Ceaseless Void": "Pre-Devourer of Gods",
  "Signus, Envoy of the Devourer": "Pre-Devourer of Gods",
  Polterghast: "Pre-Devourer of Gods",
  "The Old Duke": "Pre-Devourer of Gods",
  "The Devourer of Gods": "Pre-Yharon",
  "Yharon, Dragon of Rebirth": "Pre-Exo Mechs / Supreme Witch, Calamitas",
  "Exo Mechs": "Pre-Exo Mechs / Supreme Witch, Calamitas",
  "Supreme Witch, Calamitas": "Pre-Exo Mechs / Supreme Witch, Calamitas",
};

function sourceForBoss(boss: string): RecommendationSource {
  return VANILLA_BOSSES.has(boss) ? "terraria" : "calamity";
}

function sourceForArmor(armorName: string): RecommendationSource {
  return VANILLA_ARMORS.has(armorName.toLowerCase()) ? "terraria" : "calamity";
}

function preHardmodeBossSequence(worldEvil: WorldEvil): string[] {
  return [
    "King Slime",
    "Desert Scourge",
    "Eye of Cthulhu",
    "Crabulon",
    worldEvil === "corruption" ? "Eater of Worlds" : "Brain of Cthulhu",
    worldEvil === "corruption" ? "The Hive Mind" : "The Perforators",
    "Queen Bee",
    "Skeletron",
    "The Slime God",
    "Wall of Flesh",
  ];
}

function getTierBosses(tier: TierId, worldEvil: WorldEvil): string[] {
  if (tier === "preHardmode") {
    return preHardmodeBossSequence(worldEvil);
  }
  if (tier === "hardmode") {
    return [...HARDMODE_BOSS_SEQUENCE];
  }
  return BOSSES_BY_TIER.postMoonLord;
}

function keyForMeta(title: string, source: RecommendationSource): string {
  return `${source}:${title.toLowerCase()}`;
}

function IconPlaceholder({ kind }: { kind: IconKind }) {
  const styleByKind: Record<IconKind, string> = {
    boss: "border-rose-400/40 bg-rose-950/50 text-rose-200",
    item: "border-emerald-400/40 bg-emerald-950/50 text-emerald-200",
    accessory: "border-cyan-400/40 bg-cyan-950/50 text-cyan-200",
  };

  return (
    <div
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-[11px] font-bold ${styleByKind[kind]}`}
      aria-hidden="true"
      title={`Placeholder ${kind}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        {kind === "boss" ? (
          <>
            <path
              d="M7 8.5L4.5 6L5 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 8.5L19.5 6L19 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8.2 10.5C8.2 8.7 9.8 7 12 7C14.2 7 15.8 8.7 15.8 10.5V14.2C15.8 16.1 14.1 17.6 12 17.6C9.9 17.6 8.2 16.1 8.2 14.2V10.5Z" />
            <circle
              cx="10.1"
              cy="11.5"
              r="0.9"
              fill="currentColor"
              stroke="none"
            />
            <circle
              cx="13.9"
              cy="11.5"
              r="0.9"
              fill="currentColor"
              stroke="none"
            />
            <path d="M10 14.4H14" strokeLinecap="round" />
          </>
        ) : null}
        {kind === "item" ? (
          <>
            <path
              d="M6.5 9.2H17.5L16.5 18H7.5L6.5 9.2Z"
              strokeLinejoin="round"
            />
            <path d="M9 9.2V7.8C9 6.6 10.1 5.6 11.5 5.6H12.5C13.9 5.6 15 6.6 15 7.8V9.2" />
            <path d="M10 12.3H14" strokeLinecap="round" />
            <path d="M10.8 14.6H13.2" strokeLinecap="round" />
          </>
        ) : null}
        {kind === "accessory" ? (
          <>
            <circle cx="12" cy="12" r="4.3" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <path d="M12 4.5V6.2" strokeLinecap="round" />
            <path d="M19.5 12H17.8" strokeLinecap="round" />
            <path d="M12 19.5V17.8" strokeLinecap="round" />
            <path d="M4.5 12H6.2" strokeLinecap="round" />
          </>
        ) : null}
      </svg>
    </div>
  );
}

function WikiIcon({
  imageUrl,
  alt,
  kind,
}: {
  imageUrl?: string;
  alt: string;
  kind: IconKind;
}) {
  if (!imageUrl) {
    return <IconPlaceholder kind={kind} />;
  }

  return (
    <Image
      loader={({ src }) => src}
      src={imageUrl}
      alt={alt}
      loading="lazy"
      unoptimized
      width={36}
      height={36}
      className="h-9 w-9 shrink-0 rounded-md border border-slate-700 bg-slate-900 object-contain"
    />
  );
}

function AccessoryItemCard({
  item,
  meta,
}: {
  item: WikiAccessoryItem;
  meta?: WikiMetaEntry;
}) {
  const href = meta?.pageUrl || item.url;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-xl border border-slate-700 bg-slate-950/70 p-3 transition hover:border-cyan-400/50"
      title={meta?.summary ?? ""}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <WikiIcon
            imageUrl={meta?.imageUrl}
            alt={item.name}
            kind="accessory"
          />
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-100 group-hover:text-cyan-200">
              {item.name}
            </p>
            {meta?.summary ? (
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {meta.summary}
              </p>
            ) : null}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            item.source === "calamity"
              ? "border border-cyan-400/50 bg-cyan-950/50 text-cyan-200"
              : "border border-emerald-400/50 bg-emerald-950/50 text-emerald-200"
          }`}
        >
          {SOURCE_LABELS[item.source]}
        </span>
      </div>
    </a>
  );
}

function getCurrentTier(defeated: Set<string>, worldEvil: WorldEvil): TierId {
  const orderedTiers: TierId[] = ["preHardmode", "hardmode", "postMoonLord"];
  for (const tier of orderedTiers) {
    const allDone = getTierBosses(tier, worldEvil).every((boss) =>
      defeated.has(boss),
    );
    if (!allDone) {
      return tier;
    }
  }
  return "postMoonLord";
}

function loadSet(storageKey: string): Set<string> {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }
    return new Set<string>(parsed);
  } catch {
    return new Set<string>();
  }
}

function translateHealthTitle(title: string, language: LanguageCode): string {
  if (language === "es") {
    return title;
  }

  const map: Record<string, string> = {
    "Inicio del mundo (Pre-Boss)": "World start (Pre-Boss)",
    "Umbral de 200 HP": "200 HP threshold",
    "Inicio de Hardmode": "Hardmode start",
    "Despues del ultimo Mechanical Boss": "After the last Mechanical Boss",
    "Post-Golem": "Post-Golem",
  };

  return map[title] ?? title;
}

function translateHealthDetail(detail: string, language: LanguageCode): string {
  if (language === "es") {
    return detail;
  }

  const map: Record<string, string> = {
    "Calamity Guide:Class_setups/Pre-Hardmode indica empezar aumentando vida y mana. Terraria Guide:Class_setups marca que el gearing inicial viene de biomas de superficie no-corruptos y del pure underground layer.":
      "Calamity Guide:Class_setups/Pre-Hardmode indicates starting by raising life and mana. Terraria Guide:Class_setups states that early gearing comes from non-corrupted surface biomes and the pure underground layer.",
    "Terraria Guide:Class_setups indica que al obtener 200 de vida puede aparecer Goblin Army; esto desbloquea al Goblin Tinkerer y el Tinkerer's Workshop para combinar accesorios.":
      "Terraria Guide:Class_setups states that once you reach 200 life, the Goblin Army can spawn; this unlocks the Goblin Tinkerer and the Tinkerer's Workshop for accessory combinations.",
    "Calamity Guide:Class_setups/Hardmode indica que Life Fruits estan disponibles inmediatamente al entrar en Hardmode.":
      "Calamity Guide:Class_setups/Hardmode indicates that Life Fruits become available immediately after entering Hardmode.",
    "Calamity Guide:Class_setups/Hardmode indica que puedes craftear Sanguine Tangerine para aumentar la vida maxima.":
      "Calamity Guide:Class_setups/Hardmode indicates you can craft Sanguine Tangerine to increase maximum life.",
    "Calamity Guide:Class_setups/Hardmode recomienda consumir Miracle Fruit para aumentar la vida maxima.":
      "Calamity Guide:Class_setups/Hardmode recommends consuming Miracle Fruit to increase maximum life.",
  };

  return map[detail] ?? detail;
}

function translateDifficultyTip(tip: string, language: LanguageCode): string {
  if (language === "es") {
    return tip;
  }

  const map: Record<string, string> = {
    "Prioriza movilidad basica antes de forzar DPS.":
      "Prioritize basic mobility before forcing DPS.",
    "Usa buffos simples en cada boss importante.":
      "Use simple buffs for every major boss.",
    "Arma una arena mas larga y con capas verticales.":
      "Build a longer arena with vertical layers.",
    "No inicies boss sin pociones activas.":
      "Do not start bosses without active potions.",
    "Mantiene una build estable y evita improvisar entre intentos.":
      "Keep a stable build and avoid improvising between attempts.",
    "Sube el dano solo si ya tienes supervivencia consistente.":
      "Increase damage only after your survivability is consistent.",
    "Entra con setup completo y ruta de escape definida.":
      "Enter with a complete setup and a defined escape route.",
    "No avances al siguiente boss si faltan checkpoints de equipo.":
      "Do not move to the next boss if key gear checkpoints are still missing.",
  };

  return map[tip] ?? tip;
}

function localizeAcquisitionTag(tag: string, language: LanguageCode): string {
  if (language === "en") {
    return tag;
  }

  const map: Record<string, string> = {
    crafted: "crafteo",
    drop: "drop",
    sold: "compra",
    chest: "cofre",
    fishing: "pesca",
    reward: "recompensa",
  };

  return map[tag] ?? tag;
}

function getBossCombatTip(
  tip: string | undefined,
  bossName: string,
  language: LanguageCode,
): string | undefined {
  if (tip) {
    const cleaned = tip
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned) {
      return cleaned.length > 170
        ? `${cleaned.slice(0, 169).trimEnd()}...`
        : cleaned;
    }
  }

  const fallback = VERIFIED_BOSS_COMBAT_TIPS[bossName.toLowerCase()];
  if (!fallback) {
    return undefined;
  }

  return language === "es" ? fallback.es : fallback.en;
}

export function CalamityGuideApp() {
  const [profile, setProfile] = useState<StartupProfile>(
    DEFAULT_STARTUP_PROFILE,
  );
  const [defeatedBosses, setDefeatedBosses] = useState<Set<string>>(
    new Set<string>(),
  );
  const [obtainedItems, setObtainedItems] = useState<Set<string>>(
    new Set<string>(),
  );
  const [wikiMetaByKey, setWikiMetaByKey] = useState<
    Record<string, WikiMetaEntry>
  >({});
  const [selectedNextItem, setSelectedNextItem] = useState<string>("");
  const [obtainedAccessories, setObtainedAccessories] = useState<Set<string>>(
    new Set<string>(),
  );
  const [obtainedArmor, setObtainedArmor] = useState<Set<string>>(
    new Set<string>(),
  );
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const nextBossCardRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    let parsedProfile: StartupProfile = DEFAULT_STARTUP_PROFILE;
    if (savedProfile) {
      try {
        parsedProfile = {
          ...DEFAULT_STARTUP_PROFILE,
          ...(JSON.parse(savedProfile) as StartupProfile),
        };
      } catch {
        // keep default
      }
    }
    setProfile(parsedProfile);
    setDefeatedBosses(loadSet(BOSSES_STORAGE_KEY));
    setObtainedItems(loadSet(ITEMS_STORAGE_KEY));
    setObtainedAccessories(loadSet(ACCESSORIES_STORAGE_KEY));
    setObtainedArmor(loadSet(ARMOR_STORAGE_KEY));
    const savedNextItem = window.localStorage.getItem(NEXT_ITEM_STORAGE_KEY);
    if (savedNextItem) setSelectedNextItem(savedNextItem);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    window.localStorage.setItem(
      BOSSES_STORAGE_KEY,
      JSON.stringify(Array.from(defeatedBosses)),
    );
  }, [defeatedBosses]);
  useEffect(() => {
    window.localStorage.setItem(
      ITEMS_STORAGE_KEY,
      JSON.stringify(Array.from(obtainedItems)),
    );
  }, [obtainedItems]);
  useEffect(() => {
    window.localStorage.setItem(NEXT_ITEM_STORAGE_KEY, selectedNextItem);
  }, [selectedNextItem]);
  useEffect(() => {
    window.localStorage.setItem(
      ACCESSORIES_STORAGE_KEY,
      JSON.stringify(Array.from(obtainedAccessories)),
    );
  }, [obtainedAccessories]);
  useEffect(() => {
    window.localStorage.setItem(
      ARMOR_STORAGE_KEY,
      JSON.stringify(Array.from(obtainedArmor)),
    );
  }, [obtainedArmor]);

  const currentTier = useMemo(
    () => getCurrentTier(defeatedBosses, profile.worldEvil),
    [defeatedBosses, profile.worldEvil],
  );
  const tx = useCallback(
    (es: string, en: string): string => (profile.language === "es" ? es : en),
    [profile.language],
  );
  const tierBosses = useMemo(
    () => getTierBosses(currentTier, profile.worldEvil),
    [currentTier, profile.worldEvil],
  );

  const nextBoss = useMemo(
    () => tierBosses.find((boss) => !defeatedBosses.has(boss)) ?? null,
    [defeatedBosses, tierBosses],
  );

  useEffect(() => {
    if (!nextBossCardRef.current) return;
    nextBossCardRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [nextBoss, currentTier]);

  const completedBossCount = useMemo(
    () => tierBosses.filter((boss) => defeatedBosses.has(boss)).length,
    [defeatedBosses, tierBosses],
  );

  const activeBossSubstage = useMemo(() => {
    const hint = nextBoss ? BOSS_TO_SUBSTAGE_HINT[nextBoss] : null;
    return (
      hint ??
      CALAMITY_CLASS_SUBSTAGES[currentTier][
        CALAMITY_CLASS_SUBSTAGES[currentTier].length - 1
      ]
    );
  }, [nextBoss, currentTier]);

  const itemChecklist: ChecklistItem[] =
    CLASS_ACCESSIBLE_ITEMS[currentTier][profile.playerClass];

  const stageRelevantItemNames = useMemo(
    () =>
      ITEMS_BY_SUBSTAGE_SECTION[currentTier][activeBossSubstage]?.[
        profile.playerClass
      ] ?? [],
    [currentTier, activeBossSubstage, profile.playerClass],
  );

  const stageRelevantSet = useMemo(
    () => new Set(stageRelevantItemNames.map((n) => n.toLowerCase())),
    [stageRelevantItemNames],
  );

  const armorRecommendations = useMemo(
    () =>
      ARMOR_BY_SUBSTAGE[currentTier][activeBossSubstage]?.[
        profile.playerClass
      ] ?? [],
    [currentTier, activeBossSubstage, profile.playerClass],
  );

  const orderedItemChecklist = useMemo(() => {
    return [...itemChecklist].sort((a, b) => {
      const aScore = stageRelevantSet.has(a.name.toLowerCase()) ? 0 : 1;
      const bScore = stageRelevantSet.has(b.name.toLowerCase()) ? 0 : 1;
      if (aScore !== bScore) return aScore - bScore;
      return a.name.localeCompare(b.name);
    });
  }, [itemChecklist, stageRelevantSet]);

  // Show stage-relevant items (class-specific) first, then other tier items
  const displayItemChecklist = useMemo<ChecklistItem[]>(() => {
    if (stageRelevantItemNames.length === 0) return orderedItemChecklist;
    const stageItems: ChecklistItem[] = stageRelevantItemNames.map((name) => {
      const found = itemChecklist.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      );
      return found ?? { name, source: "calamity" as const };
    });
    const otherItems = orderedItemChecklist.filter(
      (item) => !stageRelevantSet.has(item.name.toLowerCase()),
    );
    return [...stageItems, ...otherItems];
  }, [
    stageRelevantItemNames,
    itemChecklist,
    orderedItemChecklist,
    stageRelevantSet,
  ]);

  const pendingItems = useMemo(
    () => displayItemChecklist.filter((item) => !obtainedItems.has(item.name)),
    [displayItemChecklist, obtainedItems],
  );

  const accessoryData: AccessorySubstageData =
    ACCESSORY_RECOMMENDATIONS_BY_SUBSTAGE[currentTier][activeBossSubstage] ??
    ACCESSORY_RECOMMENDATIONS_BY_SUBSTAGE[currentTier][
      CALAMITY_CLASS_SUBSTAGES[currentTier][0]
    ];

  const minimalAccessoryChecklist = useMemo(() => {
    const classSpecific = accessoryData.classByType[profile.playerClass] ?? [];
    const candidates = [
      accessoryData.mobility[0],
      accessoryData.allAround[0],
      classSpecific[0],
    ].filter((item): item is WikiAccessoryItem => Boolean(item));

    const unique = new Map<string, WikiAccessoryItem>();
    for (const item of candidates) {
      unique.set(keyForMeta(item.name, item.source), item);
    }

    return Array.from(unique.values());
  }, [accessoryData, profile.playerClass]);

  const pendingAccessories = useMemo(
    () =>
      minimalAccessoryChecklist.filter(
        (item) => !obtainedAccessories.has(keyForMeta(item.name, item.source)),
      ),
    [minimalAccessoryChecklist, obtainedAccessories],
  );

  const lookupEntries = useMemo(() => {
    const entries: WikiLookupEntry[] = [];

    for (const boss of tierBosses) {
      entries.push({ title: boss, source: sourceForBoss(boss) });
    }

    for (const item of itemChecklist) {
      entries.push({ title: item.name, source: item.source });
    }

    for (const item of accessoryData.allAround) {
      entries.push({ title: item.name, source: item.source });
    }

    for (const item of accessoryData.mobility) {
      entries.push({ title: item.name, source: item.source });
    }

    for (const item of accessoryData.classByType[profile.playerClass] ??
      accessoryData.allAround) {
      entries.push({ title: item.name, source: item.source });
    }

    for (const item of minimalAccessoryChecklist) {
      entries.push({ title: item.name, source: item.source });
    }

    for (const armor of armorRecommendations) {
      entries.push({ title: armor, source: sourceForArmor(armor) });
    }

    const deduped: WikiLookupEntry[] = [];
    const seen = new Set<string>();
    for (const entry of entries) {
      const key = keyForMeta(entry.title, entry.source);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(entry);
      }
    }

    return deduped;
  }, [
    accessoryData,
    armorRecommendations,
    itemChecklist,
    minimalAccessoryChecklist,
    profile.playerClass,
    tierBosses,
  ]);

  useEffect(() => {
    let active = true;

    const fetchMeta = async () => {
      if (!lookupEntries.length) {
        return;
      }

      try {
        const response = await fetch("/api/wiki-meta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ entries: lookupEntries }),
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          results?: WikiMetaEntry[];
        };
        const results = Array.isArray(payload.results)
          ? payload.results
          : undefined;
        if (!active || !results) {
          return;
        }

        setWikiMetaByKey((prev) => {
          const next = { ...prev };
          for (const entry of results) {
            next[keyForMeta(entry.title, entry.source)] = entry;
          }
          return next;
        });
      } catch {
        // Ignore lookup errors and keep existing fallback labels/links.
      }
    };

    fetchMeta();

    return () => {
      active = false;
    };
  }, [lookupEntries]);

  useEffect(() => {
    if (!profile.aiEnabled) {
      setAiLoading(false);
      setAiRecommendation("");
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    setAiRecommendation("");

    const fetchAi = async () => {
      if (!nextBoss && completedBossCount < tierBosses.length) return;
      setAiLoading(true);
      try {
        const response = await fetch("/api/ai-recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            playerClass: profile.playerClass,
            difficulty: profile.difficulty,
            currentTier,
            worldEvil: profile.worldEvil,
            substage: activeBossSubstage,
            nextBoss,
            selectedNextItem: selectedNextItem || null,
            progress: {
              completedBossCount,
              totalBossCount: tierBosses.length,
            },
            defeatedBosses: tierBosses.filter((boss) =>
              defeatedBosses.has(boss),
            ),
            pendingItems: pendingItems.slice(0, 6).map((i) => i.name),
            obtainedItems: Array.from(obtainedItems).slice(0, 20),
            pendingAccessories: pendingAccessories
              .slice(0, 4)
              .map((item) => item.name),
            obtainedAccessories: Array.from(obtainedAccessories).slice(0, 20),
            armorRecommendations,
            obtainedArmor: Array.from(obtainedArmor).slice(0, 10),
            language: profile.language,
          }),
        });
        if (!response.ok || !active) return;
        const data = (await response.json()) as {
          recommendation?: string | null;
          noKey?: boolean;
        };
        if (!active) return;

        if (data.noKey) {
          setAiRecommendation(
            tx(
              "IA desactivada: falta GEMINI_API_KEY en .env.local",
              "AI disabled: GEMINI_API_KEY is missing in .env.local",
            ),
          );
          return;
        }

        if (data.recommendation) {
          setAiRecommendation(data.recommendation);
          return;
        }

        setAiRecommendation(
          tx(
            "No hubo respuesta de IA en este intento.",
            "No AI response was returned in this attempt.",
          ),
        );
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") {
          if (active) {
            setAiRecommendation(
              tx(
                "La recomendación IA tardó demasiado. Intenta nuevamente.",
                "AI recommendation timed out. Please try again.",
              ),
            );
          }
          return;
        }

        if (active) {
          setAiRecommendation(
            tx(
              "Error al consultar IA. Reintenta en unos segundos.",
              "Error while querying AI. Try again in a few seconds.",
            ),
          );
        }
      } finally {
        clearTimeout(timeoutId);
        if (active) setAiLoading(false);
      }
    };

    fetchAi();
    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile.aiEnabled,
    profile.playerClass,
    profile.difficulty,
    profile.worldEvil,
    profile.language,
    currentTier,
    activeBossSubstage,
    nextBoss,
    selectedNextItem,
    completedBossCount,
    tierBosses,
    defeatedBosses,
    pendingItems,
    obtainedItems,
    pendingAccessories,
    obtainedAccessories,
    armorRecommendations,
    obtainedArmor,
  ]);

  const getMeta = (
    title: string,
    source: RecommendationSource,
  ): WikiMetaEntry | undefined => {
    return wikiMetaByKey[keyForMeta(title, source)];
  };

  const nowCards = [
    `${tx("Tier actual", "Current tier")}: ${TIER_LABELS[currentTier]}`,
    `${tx("Subetapa objetivo", "Target substage")}: ${activeBossSubstage}`,
    `${tx("Siguiente boss", "Next boss")}: ${nextBoss ?? tx("Tier completado", "Tier cleared")}`,
    `${tx("Prioridad de build", "Build priority")}: ${CLASS_LABELS[profile.playerClass]} + ${DIFFICULTY_LABELS[profile.difficulty]}`,
  ];

  const toggleBoss = (boss: string) => {
    setDefeatedBosses((prev) => {
      const next = new Set(prev);
      if (next.has(boss)) {
        next.delete(boss);
      } else {
        next.add(boss);
      }
      return next;
    });
  };

  const toggleItem = (item: string) => {
    setObtainedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const resetProgress = () => {
    setDefeatedBosses(new Set<string>());
    setObtainedItems(new Set<string>());
    setObtainedAccessories(new Set<string>());
    setObtainedArmor(new Set<string>());
    setSelectedNextItem("");
  };

  const toggleArmor = (armorName: string) => {
    setObtainedArmor((prev) => {
      const next = new Set(prev);
      const existingKey = Array.from(next).find(
        (savedName) => savedName.toLowerCase() === armorName.toLowerCase(),
      );
      if (existingKey) next.delete(existingKey);
      else next.add(armorName);
      return next;
    });
  };

  const toggleAccessory = (item: WikiAccessoryItem) => {
    const key = keyForMeta(item.name, item.source);
    setObtainedAccessories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="wiki-app min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-425 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-[0_0_60px_-30px_rgba(34,211,238,0.8)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Calamyendo
          </p>
          <h1 className="mt-2 text-4xl text-cyan-100 sm:text-5xl">
            {tx("Que hacer ahora", "What to do now")}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            {tx(
              "Flujo unico con progreso por boss, accesorios y vida maxima usando como base Calamity Wiki y Terraria Wiki.",
              "Single flow with boss progress, accessories, and max health using Calamity Wiki and Terraria Wiki as sources.",
            )}
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-700/70 bg-slate-900/60 p-5 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-cyan-100">
              {tx("Configuracion", "Configuration")}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {tx("Todo se guarda localmente.", "Everything is saved locally.")}
            </p>

            <div className="mt-4 grid gap-3">
              <label className="text-sm text-slate-200">
                {tx("Idioma", "Language")}
                <select
                  value={profile.language}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      language: event.target.value as LanguageCode,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                >
                  {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map(
                    (language) => (
                      <option key={language} value={language}>
                        {LANGUAGE_LABELS[language]}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="text-sm text-slate-200">
                {tx("Clase", "Class")}
                <select
                  value={profile.playerClass}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      playerClass: event.target.value as PlayerClass,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                >
                  {Object.entries(CLASS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-200">
                {tx("Dificultad", "Difficulty")}
                <select
                  value={profile.difficulty}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      difficulty: event.target.value as Difficulty,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                >
                  {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-200">
                {tx("Mundo", "World evil")}
                <select
                  value={profile.worldEvil}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      worldEvil: event.target.value as WorldEvil,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
                >
                  {Object.entries(WORLD_EVIL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-200">
                {tx("Tier actual", "Current tier")}
                <div className="mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                  {TIER_LABELS[currentTier]}
                </div>
              </label>

              <label className="text-sm text-slate-200">
                {tx("Subetapa activa", "Active substage")}
                <div className="mt-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                  {activeBossSubstage}
                </div>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={profile.wantsBossRush}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      wantsBossRush: event.target.checked,
                    }))
                  }
                />
                {tx("Objetivo Boss Rush", "Boss Rush goal")}
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={profile.hardcoreRun}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      hardcoreRun: event.target.checked,
                    }))
                  }
                />
                {tx("Partida hardcore", "Hardcore run")}
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-950/20 px-3 py-2 text-sm text-violet-100">
                <input
                  type="checkbox"
                  checked={profile.aiEnabled}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      aiEnabled: event.target.checked,
                    }))
                  }
                />
                {tx("Recomendación IA", "AI recommendation")}
              </label>
            </div>
          </aside>

          <main>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {nowCards.map((card) => (
                <article
                  key={card}
                  className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-4 text-sm text-slate-100 wrap-break-word"
                >
                  {card}
                </article>
              ))}
            </section>

            {/* Immediate objective — redesigned */}
            <section className="mt-6 overflow-hidden rounded-3xl border border-amber-400/30 bg-[linear-gradient(135deg,rgba(120,53,15,0.55),rgba(8,6,4,0.85))] shadow-[0_0_80px_-30px_rgba(251,191,36,0.7)]">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-400/80">
                      {tx("Objetivo inmediato", "Immediate objective")}
                    </p>
                    <h2
                      className="mt-1 wrap-break-word text-3xl leading-none text-amber-50 sm:text-4xl"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {nextBoss ?? tx("Tier completado", "Tier cleared")}
                    </h2>
                    <p className="mt-2 text-xs text-amber-200/70">
                      {activeBossSubstage} · {CLASS_LABELS[profile.playerClass]}{" "}
                      · {DIFFICULTY_LABELS[profile.difficulty]}
                    </p>
                    {selectedNextItem ? (
                      <p className="mt-2 text-sm text-amber-100/90">
                        <span className="mr-1 rounded-full border border-amber-300/50 bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
                          NEXT
                        </span>
                        {selectedNextItem}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Tier progress ring */}
                    <div className="flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-900/20 px-3 py-2">
                      <span
                        className="text-2xl font-bold text-amber-100"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {completedBossCount}
                      </span>
                      <span className="text-amber-400/60">/</span>
                      <span
                        className="text-lg text-amber-300/80"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {tierBosses.length}
                      </span>
                      <span className="ml-1 text-[10px] uppercase tracking-widest text-amber-200/60">
                        {tx("bosses", "bosses")}
                      </span>
                    </div>
                    {/* Armor recommendation pills */}
                    {armorRecommendations.length > 0 ? (
                      <div className="flex flex-wrap justify-end gap-1">
                        {armorRecommendations.map((a) => (
                          <span
                            key={a}
                            className="rounded-full border border-violet-400/40 bg-violet-950/50 px-2 py-0.5 text-[11px] text-violet-200"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Tier progress bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-amber-500 to-amber-300 transition-all duration-700"
                    style={{
                      width: `${tierBosses.length ? (completedBossCount / tierBosses.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Progression timeline */}
            <section className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400">
                {tx("Línea de progresión", "Progression timeline")}
              </p>
              <div className="overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-0">
                  {tierBosses.map((boss, idx) => {
                    const defeated = defeatedBosses.has(boss);
                    const isNext = boss === nextBoss;
                    const bossSource = sourceForBoss(boss);
                    const bossMeta = getMeta(boss, bossSource);
                    return (
                      <div key={boss} className="flex items-center">
                        <a
                          href={
                            bossMeta?.pageUrl ??
                            `https://${bossSource === "calamity" ? "calamitymod" : "terraria"}.wiki.gg/wiki/${encodeURIComponent(boss.replace(/\s+/g, "_"))}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          title={boss}
                          className="group flex flex-col items-center gap-1"
                        >
                          <div
                            className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-200
                          ${
                            defeated
                              ? "border-emerald-400/60 bg-emerald-900/60 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                              : isNext
                                ? "border-amber-400/80 bg-amber-900/60 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse"
                                : "border-slate-600/60 bg-slate-900/60 text-slate-500"
                          }`}
                          >
                            {defeated ? "✓" : isNext ? "!" : idx + 1}
                          </div>
                          <span
                            className={`max-w-14 text-center text-[9px] leading-tight ${
                              isNext
                                ? "text-amber-200"
                                : defeated
                                  ? "text-emerald-400/70"
                                  : "text-slate-500"
                            }`}
                          >
                            {boss.length > 12 ? boss.slice(0, 12) + "…" : boss}
                          </span>
                        </a>
                        {idx < tierBosses.length - 1 ? (
                          <div
                            className={`mx-0.5 h-px w-5 shrink-0 ${
                              defeatedBosses.has(tierBosses[idx + 1] ?? "") ||
                              defeated
                                ? "bg-emerald-500/40"
                                : "bg-slate-700/60"
                            }`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* AI Recommendation panel */}
            {profile.aiEnabled && (aiLoading || aiRecommendation) ? (
              <section className="mt-4 overflow-hidden rounded-2xl border border-violet-400/30 bg-[linear-gradient(135deg,rgba(76,29,149,0.35),rgba(8,6,4,0.85))] p-4 shadow-[0_0_40px_-15px_rgba(167,139,250,0.5)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet-400/50 bg-violet-900/60 text-[10px] text-violet-200">
                    AI
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-violet-300/80">
                    {tx("Recomendación IA", "AI Recommendation")}
                  </p>
                  {aiLoading ? (
                    <span className="ml-auto flex items-center gap-1 text-[11px] text-violet-300/60">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-400/60" />
                      {tx("Analizando...", "Analyzing...")}
                    </span>
                  ) : null}
                </div>
                {aiRecommendation ? (
                  <p className="mt-2 text-sm leading-relaxed text-violet-100/90">
                    {aiRecommendation}
                  </p>
                ) : null}
              </section>
            ) : null}

            <section className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
              <article>
                <h2 className="text-2xl text-cyan-100">
                  {tx("Checklist de bosses", "Boss checklist")}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx("Subetapas Calamity", "Calamity substages")}:{" "}
                  {CALAMITY_CLASS_SUBSTAGES[currentTier].join(" -> ")}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {tx(
                    "Tip: busca la etiqueta NEXT para tu objetivo directo.",
                    "Tip: use the NEXT tag for your direct objective.",
                  )}
                </p>
                <div className="mt-4 overflow-x-auto pb-1">
                  <ul className="flex min-w-max gap-3">
                    {tierBosses.map((boss) => {
                      const checked = defeatedBosses.has(boss);
                      const bossSource = sourceForBoss(boss);
                      const bossMeta = getMeta(boss, bossSource);
                      const isNextBoss = boss === nextBoss;
                      const bossTip = getBossCombatTip(
                        bossMeta?.combatTip,
                        boss,
                        profile.language,
                      );
                      return (
                        <li
                          key={boss}
                          ref={isNextBoss ? nextBossCardRef : null}
                          className={`w-[18rem] shrink-0 rounded-xl p-3 ${
                            isNextBoss
                              ? "border border-amber-300/60 bg-amber-900/20 shadow-[0_0_0_1px_rgba(251,191,36,0.2)]"
                              : "border border-slate-700 bg-slate-950/60"
                          }`}
                        >
                          <div>
                            <label className="flex items-center gap-3 text-sm">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleBoss(boss)}
                              />
                              <WikiIcon
                                imageUrl={bossMeta?.imageUrl}
                                alt={boss}
                                kind="boss"
                              />
                              <a
                                href={
                                  bossMeta?.pageUrl ??
                                  `https://${bossSource === "calamity" ? "calamitymod" : "terraria"}.wiki.gg/wiki/${encodeURIComponent(boss.replace(/\s+/g, "_"))}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                title={bossMeta?.summary ?? ""}
                                className={`min-w-0 flex-1 wrap-break-word hover:underline ${checked ? "text-slate-500 line-through" : "text-slate-100 hover:text-cyan-200"}`}
                              >
                                {boss}
                              </a>
                              {isNextBoss ? (
                                <span className="rounded-full border border-amber-300/60 bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
                                  NEXT
                                </span>
                              ) : null}
                              <span
                                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  bossSource === "calamity"
                                    ? "border border-cyan-400/40 bg-cyan-950/50 text-cyan-200"
                                    : "border border-emerald-400/40 bg-emerald-950/50 text-emerald-200"
                                }`}
                              >
                                {SOURCE_LABELS[bossSource]}
                              </span>
                            </label>
                            {bossTip ? (
                              <p className="mt-2 pl-12 text-[11px] leading-4 text-slate-300/90">
                                {bossTip}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx("Checklist de accesorios", "Accessory checklist")}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx(
                    "Solo lo minimo para el siguiente boss",
                    "Only the minimum for the next boss",
                  )}{" "}
                  ({pendingAccessories.length} {tx("pendientes", "pending")} /{" "}
                  {minimalAccessoryChecklist.length})
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  {tx(
                    "Basado en la subetapa actual de la wiki: 1 movilidad + 1 general + 1 de clase (si existe).",
                    "Based on the current wiki substage: 1 mobility + 1 all-around + 1 class pick (if available).",
                  )}
                </p>
                <ul className="mt-4 space-y-2">
                  {minimalAccessoryChecklist.map((item) => {
                    const checked = obtainedAccessories.has(
                      keyForMeta(item.name, item.source),
                    );
                    const meta = getMeta(item.name, item.source);
                    return (
                      <li
                        key={`${item.source}:${item.name}`}
                        className="rounded-xl border border-slate-700 bg-slate-950/55 p-3"
                      >
                        <label className="flex items-start gap-2 text-sm text-slate-200">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAccessory(item)}
                            className="mt-1"
                          />
                          <WikiIcon
                            imageUrl={meta?.imageUrl}
                            alt={item.name}
                            kind="accessory"
                          />
                          <div className="min-w-0 flex-1">
                            <a
                              href={
                                meta?.pageUrl ??
                                item.url ??
                                `https://${item.source === "calamity" ? "calamitymod" : "terraria"}.wiki.gg/wiki/${encodeURIComponent(item.name.replace(/\s+/g, "_"))}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className={`wrap-break-word hover:underline ${checked ? "line-through text-slate-500" : "text-slate-100 hover:text-cyan-200"}`}
                            >
                              {item.name}
                            </a>
                            {meta?.summary ? (
                              <p className="mt-1 wrap-break-word text-[11px] leading-4 text-slate-400">
                                {meta.summary}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              item.source === "calamity"
                                ? "border border-cyan-400/40 bg-cyan-950/50 text-cyan-200"
                                : "border border-emerald-400/40 bg-emerald-950/50 text-emerald-200"
                            }`}
                          >
                            {SOURCE_LABELS[item.source]}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx("Checklist de items", "Item checklist")}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx("Clase activa", "Active class")}:{" "}
                  {CLASS_LABELS[profile.playerClass]} ({pendingItems.length}{" "}
                  {tx("pendientes", "pending")} / {displayItemChecklist.length}{" "}
                  {tx("total", "total")})
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  {tx(
                    "Ordenado automaticamente por la subetapa del siguiente boss. Elige NEXT en un item relevante.",
                    "Automatically sorted by the next boss substage. Pick NEXT on a relevant item.",
                  )}
                </p>
                <ul className="mt-4 space-y-2">
                  {displayItemChecklist.map((item: ChecklistItem) => {
                    const checked = obtainedItems.has(item.name);
                    const itemSource = item.source as RecommendationSource;
                    const itemMeta = getMeta(item.name, itemSource);
                    const isNextItem = selectedNextItem === item.name;
                    const isRelevantToNextBoss = stageRelevantSet.has(
                      item.name.toLowerCase(),
                    );
                    return (
                      <li
                        key={item.name}
                        className={`rounded-xl border p-3 ${
                          isNextItem
                            ? "border-amber-300/60 bg-amber-900/20"
                            : isRelevantToNextBoss
                              ? "border-cyan-400/50 bg-cyan-950/20"
                              : "border-slate-700 bg-slate-950/60"
                        }`}
                      >
                        <div className="flex items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleItem(item.name)}
                            className="mt-1"
                          />
                          <WikiIcon
                            imageUrl={itemMeta?.imageUrl}
                            alt={item.name}
                            kind="item"
                          />
                          <div className="min-w-0 flex-1">
                            <a
                              href={
                                itemMeta?.pageUrl ??
                                `https://${itemSource === "calamity" ? "calamitymod" : "terraria"}.wiki.gg/wiki/${encodeURIComponent(item.name.replace(/\s+/g, "_"))}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              title={itemMeta?.summary ?? ""}
                              className={`wrap-break-word hover:underline ${checked ? "text-slate-500 line-through" : "text-slate-100 hover:text-cyan-200"}`}
                            >
                              {item.name}
                            </a>
                            {itemMeta?.summary ? (
                              <p className="mt-1 wrap-break-word text-[11px] leading-4 text-slate-400">
                                {itemMeta.summary}
                              </p>
                            ) : null}
                            {itemMeta?.acquisitionHint ? (
                              <p className="mt-1 wrap-break-word text-[11px] leading-4 text-amber-100/95">
                                {tx("Como conseguir", "How to obtain")}:{" "}
                                {itemMeta.acquisitionHint}
                              </p>
                            ) : null}
                            {itemMeta?.acquisitionTags?.length ? (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {itemMeta.acquisitionTags.map((tag) => (
                                  <span
                                    key={`${item.name}-${tag}`}
                                    className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-100"
                                  >
                                    {localizeAcquisitionTag(
                                      tag,
                                      profile.language,
                                    )}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedNextItem(
                                    isNextItem ? "" : item.name,
                                  )
                                }
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  isNextItem
                                    ? "border border-amber-300/70 bg-amber-400/20 text-amber-100"
                                    : "border border-slate-600 bg-slate-900 text-slate-300"
                                }`}
                              >
                                NEXT
                              </button>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  itemSource === "calamity"
                                    ? "border border-cyan-400/40 bg-cyan-950/50 text-cyan-200"
                                    : "border border-emerald-400/40 bg-emerald-950/50 text-emerald-200"
                                }`}
                              >
                                {SOURCE_LABELS[itemSource]}
                              </span>
                              {isRelevantToNextBoss ? (
                                <span className="rounded-full border border-cyan-400/50 bg-cyan-950/60 px-2 py-0.5 text-[11px] font-medium text-cyan-100">
                                  {tx("Subetapa objetivo", "Target substage")}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="rounded-3xl border border-violet-500/30 bg-slate-900/65 p-5 shadow-[0_0_30px_-15px_rgba(167,139,250,0.4)]">
                <h2 className="text-2xl text-violet-100">
                  {tx("Armadura recomendada", "Recommended armor")}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx("Para", "For")} {CLASS_LABELS[profile.playerClass]} ·{" "}
                  {activeBossSubstage}
                </p>
                {armorRecommendations.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {armorRecommendations.map((armor) => {
                      const checked = Array.from(obtainedArmor).some(
                        (savedArmor) =>
                          savedArmor.toLowerCase() === armor.toLowerCase(),
                      );
                      const armorSource = sourceForArmor(armor);
                      const armorMeta = getMeta(armor, armorSource);
                      const wikiUrl =
                        armorMeta?.pageUrl ??
                        `https://${armorSource === "calamity" ? "calamitymod" : "terraria"}.wiki.gg/wiki/${encodeURIComponent(
                          armor.replace(/\s+/g, "_"),
                        )}`;
                      return (
                        <li
                          key={armor}
                          className={`rounded-xl border p-3 ${checked ? "border-slate-700/50 bg-slate-950/40 opacity-60" : "border-violet-500/30 bg-violet-950/20"}`}
                        >
                          <label className="flex items-center gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleArmor(armor)}
                            />
                            <WikiIcon
                              imageUrl={armorMeta?.imageUrl}
                              alt={armor}
                              kind="item"
                            />
                            <a
                              href={wikiUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`min-w-0 flex-1 wrap-break-word hover:underline ${checked ? "text-slate-500 line-through" : "text-violet-100 hover:text-violet-300"}`}
                            >
                              {armor}
                            </a>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl border border-violet-400/20 bg-violet-950/20 px-3 py-2 text-sm text-violet-100/80">
                    {tx(
                      "Aun no hay armadura objetivo para esta subetapa.",
                      "There is no target armor for this substage yet.",
                    )}
                  </p>
                )}
              </article>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx(
                    "Accesorios recomendados (wiki)",
                    "Recommended accessories (wiki)",
                  )}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx(
                    "Item por item con link exacto de wiki y etiqueta de fuente dentro de cada tarjeta.",
                    "Item-by-item with exact wiki link and source label in every card.",
                  )}
                </p>

                <div className="mt-4 grid gap-5">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-cyan-200">
                      {tx("General", "All-around")}
                    </p>
                    <div className="grid gap-2">
                      {accessoryData.allAround.map((item) => (
                        <AccessoryItemCard
                          key={`all-${item.name}`}
                          item={item}
                          meta={getMeta(item.name, item.source)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-cyan-200">
                      {tx("Movilidad", "Mobility")}
                    </p>
                    <div className="grid gap-2">
                      {accessoryData.mobility.map((item) => (
                        <AccessoryItemCard
                          key={`move-${item.name}`}
                          item={item}
                          meta={getMeta(item.name, item.source)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-cyan-200">
                      {tx("Para", "For")} {CLASS_LABELS[profile.playerClass]}
                    </p>
                    <div className="grid gap-2">
                      {(
                        accessoryData.classByType[profile.playerClass] ??
                        accessoryData.allAround
                      ).map((item) => (
                        <AccessoryItemCard
                          key={`class-${item.name}`}
                          item={item}
                          meta={getMeta(item.name, item.source)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-1 text-xs text-slate-400">
                  <li className="wrap-break-word">
                    {tx(
                      "Subetapas de soporte Terraria",
                      "Terraria support substages",
                    )}
                    : {TERRARIA_SUPPORT_STAGES[currentTier].join(" -> ")}
                  </li>
                  <li>
                    {tx("Si tu mundo es", "If your world is")}{" "}
                    {WORLD_EVIL_LABELS[profile.worldEvil]},{" "}
                    {tx("tu ruta usa", "your route uses")}{" "}
                    {preHardmodeBossSequence(profile.worldEvil)[5]}{" "}
                    {tx(
                      "como boss de bioma antes de Skeletron.",
                      "as biome boss before Skeletron.",
                    )}
                  </li>
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx("Corazones y vida maxima", "Hearts and max life")}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {tx(
                    "Hechos directos tomados de guias wiki (Calamity + Terraria), incluyendo umbrales y progresion de HP.",
                    "Direct facts from wiki guides (Calamity + Terraria), including thresholds and HP progression.",
                  )}
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {HEALTH_AND_HEARTS_GUIDE.map((entry) => (
                    <li
                      key={entry.title}
                      className="rounded-xl border border-slate-700 bg-slate-950/60 p-3"
                    >
                      <p className="font-semibold text-cyan-200">
                        {translateHealthTitle(entry.title, profile.language)}
                      </p>
                      <p className="mt-1 wrap-break-word text-slate-200">
                        {translateHealthDetail(entry.detail, profile.language)}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx("Notas por dificultad", "Difficulty notes")}
                </h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {DIFFICULTY_TIPS[profile.difficulty].map((tip) => (
                    <li key={tip}>
                      {translateDifficultyTip(tip, profile.language)}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-700 bg-slate-900/65 p-5">
                <h2 className="text-2xl text-cyan-100">
                  {tx("Fuentes", "Sources")}
                </h2>
                <div className="mt-3 flex flex-col gap-2 text-sm text-cyan-200">
                  <a
                    href={CALAMITY_WIKI_SOURCES.classSetups}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {tx(
                      "Calamity: Guia Class Setups",
                      "Calamity: Guide Class Setups",
                    )}
                  </a>
                  <a
                    href={CALAMITY_WIKI_SOURCES.progression}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {tx(
                      "Calamity: Mod Progression",
                      "Calamity: Mod Progression",
                    )}
                  </a>
                  <a
                    href={CALAMITY_WIKI_SOURCES.terrariaClassSetups}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {tx(
                      "Terraria: Guia Class Setups",
                      "Terraria: Guide Class Setups",
                    )}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={resetProgress}
                  className="mt-5 w-full rounded-xl border border-rose-400/60 bg-rose-950/40 px-4 py-2 text-sm text-rose-100 hover:bg-rose-900/60"
                >
                  {tx("Reiniciar progreso local", "Reset local progress")}
                </button>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
