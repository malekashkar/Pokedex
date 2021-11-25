import {
    GROWTH_RATES_JSON_PATH,
    EXPERIENCE_JSON_PATH,
    POKEMON_HABITAT_NAMES_JSON_PATH,
    POKEMON_SPECIES_JSON_PATH,
    POKEMON_SPECIES_NAMES_JSON_PATH,
  } from "../util/constants";
  import {
    IExperience,
    IName,
    IPokemonSpeciesName,
    IPokemonSpecies,
  } from "../util/types";
  
  const experienceObjs: IExperience[] = require(EXPERIENCE_JSON_PATH);
  const growthRateObjs: IName[] = require(GROWTH_RATES_JSON_PATH);
  const habitatNameObjs: IName[] = require(POKEMON_HABITAT_NAMES_JSON_PATH);
  const pokemonSpeciesObjs: IPokemonSpecies[] = require(POKEMON_SPECIES_JSON_PATH);
  const pokemonSpeciesNamesObjs: IPokemonSpeciesName[] = require(POKEMON_SPECIES_NAMES_JSON_PATH);
  
  export default class Species implements IPokemonSpecies {
    /**
     * Get a Pokémon with its id or name
     * @param {string | number} idOrName The id or the name of the Pokémon
     */
    static get(idOrName: string | number) {
      try {
        const pokemon = new Species(idOrName);
        return pokemon;
      } catch {
        return;
      }
    }
  
    constructor(idOrName: string | number) {
      if (typeof idOrName === "string") {
        let id: number;
        const namesObjs = pokemonSpeciesNamesObjs.filter(
          (x) => x.name.toLowerCase() === idOrName.toLowerCase()
        );
        if (namesObjs) id = namesObjs[0]?.id;
        const pokemonSpeciesObj: IPokemonSpecies = id
          ? pokemonSpeciesObjs.find((x) => x.id === id)
          : pokemonSpeciesObjs.find(
              (x) => x.identifier.toLowerCase() === idOrName.toLowerCase()
            );
  
        if (!pokemonSpeciesObj) return;
        for (const key in pokemonSpeciesObj) {
          if (pokemonSpeciesObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (pokemonSpeciesObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
      } else if (typeof idOrName === "number" && !isNaN(idOrName)) {
        const pokemonSpeciesObj = pokemonSpeciesObjs.find(
          (x) => x.id === idOrName
        );
        if (!pokemonSpeciesObj) return;
        for (const key in pokemonSpeciesObj) {
          if (pokemonSpeciesObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (pokemonSpeciesObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
      } else {
        throw Error("You must provide a string or a number!");
      }
    }
  
    /**
     * @returns {IName} the growth rate of this pokemon species
     */
    get growthRate(): IName {
      if (!this._growthRate) {
        this._growthRate = growthRateObjs.find(
          (x) => x.id === this.growthRateId && x.languageId === 9
        );
      }
      return this._growthRate;
    }
  
    /**
     * @returns {IName} the habitat of this pokemon species
     */
    get habitat(): IName {
      if (!this._habitat) {
        this._habitat = habitatNameObjs.find(
          (x) => x.languageId === 9 && x.id === this.habitatId
        );
        if (!this._habitat) {
          this._habitat = {
            id: this.habitatId,
            languageId: 9,
            name: "None",
          };
        }
      }
      return this._habitat;
    }
  
    /**
     *
     * @param {number} level The current level of the pokemon species
     * @param {number} xp The current xp of the pokemon species
     * @returns The amount of xp needed for this pokemon species to level up
     */
    getXpUntilNextLevel(level: number, xp: number) {
      if (level >= 100) return -1;
      const speciesExperienceObjs = experienceObjs.filter(
        (x) => x.growthRateId === this.growthRateId
      );
  
      const lastExperienceObj = speciesExperienceObjs.find(
        (x) => x.level === level
      );
      const experienceObj = speciesExperienceObjs.find(
        (x) => x.level === level + 1
      );
      return experienceObj.experience - lastExperienceObj.experience - xp;
    }
  
    get names() {
      if (!this._names) {
        this._names = pokemonSpeciesNamesObjs.filter((x) => x.id === this.id);
      }
      return this._names;
    }
  
    get name() {
      return this.names.find((x) => x.languageId === 9).name;
    }
  
    get genus() {
      return this.names.find((x) => x.languageId === 9).genus;
    }
  
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
  
    _growthRate: IName;
    _habitat: IName;
    _names: IPokemonSpeciesName[];
  }
  