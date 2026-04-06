import { NextResponse } from "next/server";

interface AiRecommendPayload {
  playerClass?: string;
  difficulty?: string;
  currentTier?: string;
  worldEvil?: string;
  substage?: string;
  nextBoss?: string | null;
  selectedNextItem?: string | null;
  progress?: {
    completedBossCount?: number;
    totalBossCount?: number;
  };
  defeatedBosses?: string[];
  pendingItems?: string[];
  obtainedItems?: string[];
  pendingAccessories?: string[];
  obtainedAccessories?: string[];
  armorRecommendations?: string[];
  obtainedArmor?: string[];
  language?: string;
}

function buildFallbackRecommendation(payload: {
  language: string;
  nextBoss: string | null;
  pendingItems: string[];
  armorRecommendations: string[];
  playerClass: string;
}): string {
  const {
    language,
    nextBoss,
    pendingItems,
    armorRecommendations,
    playerClass,
  } = payload;

  if (language === "es") {
    const bossPart = nextBoss
      ? `Prioriza preparación para ${nextBoss}.`
      : "Este tier ya está casi cerrado; consolida equipo.";
    const itemPart =
      pendingItems.length > 0
        ? `Consigue primero ${pendingItems.slice(0, 2).join(" y ")}.`
        : "No tienes items críticos pendientes en esta subetapa.";
    const armorPart =
      armorRecommendations.length > 0
        ? `Usa ${armorRecommendations[0]} como base para ${playerClass}.`
        : "Mantén tu mejor armadura de la subetapa activa.";
    return `${bossPart} ${itemPart} ${armorPart}`;
  }

  const bossPart = nextBoss
    ? `Prioritize preparation for ${nextBoss}.`
    : "This tier is nearly complete; consolidate your setup.";
  const itemPart =
    pendingItems.length > 0
      ? `Get ${pendingItems.slice(0, 2).join(" and ")} first.`
      : "You have no critical pending items for this substage.";
  const armorPart =
    armorRecommendations.length > 0
      ? `Use ${armorRecommendations[0]} as your core armor for ${playerClass}.`
      : "Keep your strongest armor for the active substage.";
  return `${bossPart} ${itemPart} ${armorPart}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ recommendation: null, noKey: true });
  }

  const payload = (await request
    .json()
    .catch(() => ({}))) as AiRecommendPayload;

  const {
    playerClass = "unknown",
    difficulty = "normal",
    currentTier = "unknown",
    worldEvil = "unknown",
    substage = "Pre-Boss",
    nextBoss = null,
    selectedNextItem = null,
    progress,
    defeatedBosses = [],
    pendingItems = [],
    obtainedItems = [],
    pendingAccessories = [],
    obtainedAccessories = [],
    armorRecommendations = [],
    obtainedArmor = [],
    language = "es",
  } = payload;

  const langInstruction =
    language === "es"
      ? "Responde en español. Sé directo y conciso (máximo 3 oraciones)."
      : "Reply in English. Be direct and concise (maximum 3 sentences).";

  const pendingItemsText =
    pendingItems.length > 0
      ? (language === "es" ? "Items pendientes" : "Pending items") +
        ": " +
        pendingItems.slice(0, 6).join(", ")
      : "";

  const obtainedItemsText =
    obtainedItems.length > 0
      ? (language === "es" ? "Items ya obtenidos" : "Items already obtained") +
        ": " +
        obtainedItems.slice(0, 10).join(", ")
      : "";

  const pendingAccessoriesText =
    pendingAccessories.length > 0
      ? (language === "es" ? "Accesorios pendientes" : "Pending accessories") +
        ": " +
        pendingAccessories.slice(0, 4).join(", ")
      : "";

  const obtainedAccessoriesText =
    obtainedAccessories.length > 0
      ? (language === "es"
          ? "Accesorios ya obtenidos"
          : "Accessories already obtained") +
        ": " +
        obtainedAccessories.slice(0, 8).join(", ")
      : "";

  const armorText =
    armorRecommendations.length > 0
      ? (language === "es" ? "Armadura recomendada" : "Recommended armor") +
        ": " +
        armorRecommendations.slice(0, 3).join(", ")
      : "";

  const obtainedArmorText =
    obtainedArmor.length > 0
      ? (language === "es"
          ? "Armadura ya obtenida"
          : "Armor already obtained") +
        ": " +
        obtainedArmor.slice(0, 4).join(", ")
      : "";

  const progressText =
    progress &&
    typeof progress.completedBossCount === "number" &&
    typeof progress.totalBossCount === "number"
      ? language === "es"
        ? `Progreso del tier: ${progress.completedBossCount}/${progress.totalBossCount}.`
        : `Tier progress: ${progress.completedBossCount}/${progress.totalBossCount}.`
      : "";

  const defeatedBossesText =
    defeatedBosses.length > 0
      ? (language === "es"
          ? "Bosses derrotados en este tier"
          : "Defeated bosses in this tier") +
        ": " +
        defeatedBosses.slice(0, 10).join(", ")
      : "";

  const selectedNextItemText = selectedNextItem
    ? language === "es"
      ? `Item NEXT seleccionado: ${selectedNextItem}.`
      : `Selected NEXT item: ${selectedNextItem}.`
    : "";

  const nextBossText = nextBoss
    ? language === "es"
      ? `Siguiente boss: ${nextBoss}`
      : `Next boss: ${nextBoss}`
    : language === "es"
      ? "Tier completado"
      : "Tier cleared";

  const prompt = [
    language === "es"
      ? `Eres un experto en Terraria + Calamity Mod. El jugador usa clase ${playerClass} en dificultad ${difficulty}.`
      : `You are a Terraria + Calamity Mod expert. The player uses ${playerClass} class on ${difficulty} difficulty.`,
    language === "es"
      ? `Tier actual: ${currentTier}. Mundo: ${worldEvil}.`
      : `Current tier: ${currentTier}. World evil: ${worldEvil}.`,
    language === "es"
      ? `Subetapa actual: ${substage}.`
      : `Current substage: ${substage}.`,
    nextBossText + ".",
    progressText,
    selectedNextItemText,
    defeatedBossesText,
    pendingItemsText,
    obtainedItemsText,
    pendingAccessoriesText,
    obtainedAccessoriesText,
    armorText,
    obtainedArmorText,
    language === "es"
      ? "Da una recomendación táctica concreta: qué priorizar ahora mismo para ganar."
      : "Give a concrete tactical recommendation: what to prioritize right now to win.",
    langInstruction,
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const modelCandidates = ["gemini-2.0-flash", "gemini-1.5-flash"];

    for (const model of modelCandidates) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 180,
            temperature: 0.7,
          },
        }),
      });

      if (!geminiResponse.ok) {
        continue;
      }

      const data = (await geminiResponse.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("")
          .trim() ?? "";

      if (text.length > 0) {
        return NextResponse.json({ recommendation: text, model });
      }
    }

    return NextResponse.json({
      recommendation: buildFallbackRecommendation({
        language,
        nextBoss,
        pendingItems,
        armorRecommendations,
        playerClass,
      }),
      fallback: true,
    });
  } catch {
    return NextResponse.json({
      recommendation: buildFallbackRecommendation({
        language,
        nextBoss,
        pendingItems,
        armorRecommendations,
        playerClass,
      }),
      fallback: true,
    });
  }
}
