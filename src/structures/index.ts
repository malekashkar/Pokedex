import { getRandomIntInclusive } from "../util";

export interface IName {
  id: number;
  languageId: number;
  name: string;
}
export interface IPokemonSpeciesName extends IName {
  genus?: string;
}

export interface IPokemon {
  id: number;
  identifier: string;
  name: string;
  formName: string;
  speciesId: number;
  height: number;
  weight: number;
  baseExp: number;
  order: number;
  isDefault: boolean;
}

export interface IMove {
  id: number;
  identifier: string;
  name: string;
  generationId: number;
  romanGenerationId: string;
  typeId: number;
  power: number;
  pp: number;
  accuracy: number;
  priority: number;
  targetId: number;
  damageClassId: number;
  effectId: number;
  effectChance: number;
  contestTypeId: number;
  contestEffectId: number;
  superContestEffectId: number;
}

export interface IPokemonMove {
  id: number;
  moves: {
    versionGroupId: number;
    id: number;
    moveMethodId: number;
    requiredLevel: number;
    order: number;
  }[];
}

export interface IPokemonSpecies {
  id: number;
  identifier: string;
  generationId: number;
  romanGenerationId: string;
  evolvesFromSpeciesId: number;
  evolutionChainId: number;
  colorId: number;
  shapeId: number;
  habitatId: number;
  genderRate: number;
  captureRate: number;
  baseHappiness: number;
  isBaby: boolean;
  hatchCounter: number;
  hasGenderDifferences: boolean;
  growthRateId: number;
  formsSwitchable: boolean;
  order: number;
  conquestOrder: number;
}

export interface IPokemonType {
  id: number;
  types: number[];
}

export interface ITypeEfficacy {
  id: number;
  efficacies: { targetTypeId: number; damageFactor: number }[];
}

export interface IMoveMeta {
  id: number;
  metaCategoryId: number;
  metaAilmentId: number;
  minHits: number;
  maxHits: number;
  minTurns: number;
  maxTurns: number;
  drain: number;
  healing: number;
  criticalRate: number;
  ailmentChance: number;
  flinchChance: number;
  statChance: number;
}

export interface IType {
  id: number;
  identifier: string;
  generationId: number;
  romanGenerationId: string;
  damageClassId: number;
}

export interface IExperience {
  growthRateId: number;
  level: number;
  experience: number;
}

export interface IPokemonEvolution {
  id: number;
  evolvedSpeciesId: number;
  evolutionTriggerId: number;
  triggerItemId: number;
  minimumLevel: number;
  genderId: number;
  locationId: number;
  heldItemId: number;
  timeOfDay: string;
  knownMoveId: number;
  knownMoveTypeId: number;
  minimumHapiness: number;
  minimumBeauty: number;
  minimumAffection: number;
  relativePhysicalStats: number;
  partySpeciesId: number;
  partyTypeId: number;
  tradeSpeciesId: number;
  needsOverworldRain: boolean;
  turnUpsideDown: boolean;
}

export interface IStat {
  id: number;
  damageClassId: number;
  identifier: string;
  isBattleOnly: boolean;
  gameIndex: number;
}

export interface IPokemonStat {
  id: number;
  statId: number;
  baseStat: number;
  effort: number;
}

export interface IItem {
  id: number;
  identifier: string;
  name: string;
  categoryId: number;
  cost: number;
  flingPower: number;
  flingEffectId: number;
  gems?: boolean;
}

export interface INature {
  id: number;
  identifier: string;
  decreasedStatId: number;
  increasedStatId: number;
  hatesFlavorId: number;
  likesFlavorId: number;
  gameIndex: number;
}

export interface IMoveset {
  id: number;
  moves: number[];
}

export interface Stats {
  attack: number;
  defense: number;
  hp: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
}

export class Stats {
  static total(stats: Stats) {
    return (
      stats.attack +
      stats.defense +
      stats.hp +
      stats["special-attack"] +
      stats["special-defense"] +
      stats.speed
    );
  }

  static percentage(stats: Stats, fixed = 2) {
    return ((this.total(stats) / (6 * 31)) * 100).toFixed(fixed);
  }

  static randomIv(): Stats {
    return {
      attack: getRandomIntInclusive(0, 31),
      defense: getRandomIntInclusive(0, 31),
      hp: getRandomIntInclusive(0, 31),
      "special-attack": getRandomIntInclusive(0, 31),
      "special-defense": getRandomIntInclusive(0, 31),
      speed: getRandomIntInclusive(0, 31),
    };
  }

  static randomIvWithTotal(total: number): Stats {
    if (total < 0 || total > 186) throw new Error("Invalid value for total.");
    let stats = this.randomIv(),
      tries = 0;
    while (this.total(stats) !== total) {
      stats = this.randomIv();
      tries++;
      if (tries >= 1000) throw "Infinite loop detected.";
    }
    return stats;
  }

  static randomIvWithMinTotal(total: number): Stats {
    if (total < 0 || total > 186) throw new Error("Invalid value for total.");
    let stats = this.randomIv(),
      tries = 0;
    while (this.total(stats) < total) {
      stats = this.randomIv();
      tries++;
      if (tries >= 1000) throw "Infinite loop detected.";
    }
    return stats;
  }

  static randomIvWithMinAndMaxTotal(minTotal: number, maxTotal: number): Stats {
    if (minTotal < 0 || minTotal > 186 || maxTotal < 0 || maxTotal > 186)
      throw new Error("Invalid value for total.");

    let stats = this.randomIv(),
      tries = 0;
    while (this.total(stats) < minTotal || this.total(stats) > maxTotal) {
      stats = this.randomIv();
      tries++;
      if (tries >= 1000) throw "Infinite loop detected.";
    }
    return stats;
  }

  static randomIvWithPercentage(percentage: number) {
    return this.randomIvWithTotal(Math.round((percentage / 100) * 186));
  }

  static randomIvWithMinPercentage(percentage: number) {
    return this.randomIvWithMinTotal(Math.round((percentage / 100) * 186));
  }

  static randomIvWithMinAndMaxPercentage(
    minPercentage: number,
    maxPercentage: number
  ) {
    return this.randomIvWithMinAndMaxTotal(
      Math.round((minPercentage / 100) * 186),
      Math.round((maxPercentage / 100) * 186)
    );
  }
}

const OrderValues = ["pokedex", "time", "iv", "level", "alphabetical"] as const;
const RarityValues = [
  "starter",
  "ultrabeast",
  "pseudolegendary",
  "legendary",
  "mythical",
] as const;

export interface PokemonSearchOptions {
  favorites?: boolean;
  shiny?: boolean;
  types?: number[];
  gender?: number;
  search?: string;
  regex?: RegExp;
  rarity?: typeof RarityValues[number];
  order?: typeof OrderValues[number];
  nature?: string;
}
