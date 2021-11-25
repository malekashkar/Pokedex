import {
    POKEMON_STATS_JSON_PATH,
    STAT_NAMES_JSON_PATH,
    STATS_JSON_PATH,
  } from "../util/constants";
  import Nature from "./Nature";
  import { IPokemonStat, IName, IStat } from "../util/types";
  
  const pokemonStatObjs: IPokemonStat[] = require(POKEMON_STATS_JSON_PATH);
  const statNameObjs: IName[] = require(STAT_NAMES_JSON_PATH);
  const statObjs: IStat[] = require(STATS_JSON_PATH);
  
  export default class Stat {
    id: number;
    damageClassId: number;
    identifier: string;
    isBattleOnly: boolean;
    gameIndex: number;
    name: string;
    iv?: number;
  
    /**
     * Gives the stat data given the stat id
     * @param {string | number} idOrName The id of the stat
     */
    constructor(idOrName: string | number) {
      if (typeof idOrName === "string") {
        let statObj = statObjs.find(
          (x) => x.identifier.toLowerCase() === idOrName.toLowerCase()
        );
        if (!statObj) {
          statObj = statObjs.find(
            (x) =>
              x.id ===
              statNameObjs.find(
                (y) => y.name.toLowerCase() === idOrName.toLowerCase()
              )?.id
          );
        }
        if (!statObj) return;
        const statNameObj = statNameObjs.find(
          (x) => x.id === statObj.id && x.languageId === 9
        );
        if (!statNameObj) return;
        for (const key in statObj) {
          if (statObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (statObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
        this.name = statNameObj.name;
      } else if (typeof idOrName === "number" && !isNaN(idOrName)) {
        const statObj = statObjs.find((x) => x.id === idOrName);
        if (!statObj) return;
        const statNameObj = statNameObjs.find(
          (x) => x.id === idOrName && x.languageId === 9
        );
        if (!statNameObj) return;
        for (const key in statObj) {
          if (statObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (statObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
        this.name = statNameObj.name;
      } else {
        throw Error("You must provide a string or a number!");
      }
    }
  
    /**
     * Gives the stat base value given the pokemon id
     * @param {number} pokemonId The id of the pokemon
     * @param {number} level The level of the pokemon
     * @param {number} iv The IV of the pokemon for this stat
     * @param {number} ev The EV of the pokemon for this stat
     */
    getStatValue(
      pokemonId: number,
      level: number,
      nature: Nature | string,
      iv: number,
      ev: number = this.getBaseEffortValue(pokemonId)
    ) {
      if (typeof nature === "string") nature = Nature.getByName(nature);
  
      const base = this.getBaseStatValue(pokemonId);
  
      let statVal = 0;
      if (this.name.toLowerCase() === "hp") {
        if (pokemonId === 292) {
          // Special case for `Shedinja`
          statVal = 1;
        } else {
          statVal = Math.floor(
            Math.floor((Math.floor(2 * base + iv + ev / 4) * level) / 100) +
              level +
              10
          );
        }
      } else {
        statVal =
          Math.floor(
            Math.floor(Math.floor(2 * base + iv + ev / 4) * level) / 100
          ) + 5;
      }
      if (nature.increasedStatId === this.id) {
        statVal = statVal * 1.1;
      }
      if (nature.decreasedStatId === this.id) {
        statVal = statVal * 0.9;
      }
      return Math.floor(statVal);
    }
  
    /**
     * Gives the stat base value given the pokemon id
     * @param {number} pokemonId The id of the pokemon
     */
    getBaseStatValue(pokemonId: number) {
      if (!this.id) return;
      const pokemonStat = pokemonStatObjs.find(
        (x) => x.id === pokemonId && x.statId === this.id
      );
      if (pokemonStat) return pokemonStat.baseStat;
    }
  
    /**
     * Gives the stat effort value (EV) given the pokemon id
     * @param {number} pokemonId The id of the pokemon
     */
    getBaseEffortValue(pokemonId: number) {
      if (!this.id) return;
      const pokemonStat = pokemonStatObjs.find(
        (x) => x.id === pokemonId && x.statId === this.id
      );
      if (pokemonStat) return pokemonStat.effort;
    }
  }
  