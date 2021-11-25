import {
    POKEMON_JSON_PATH,
    POKEMON_EVOLUTION_JSON_PATH,
    POKEMON_MOVES_JSON_PATH,
    POKEMON_SPECIES_JSON_PATH,
    POKEMON_TYPES_JSON_PATH,
    POKEMON_SPECIES_NAMES_JSON_PATH,
  } from "../util/constants";
  import {
    IPokemon,
    IPokemonEvolution,
    IPokemonMove,
    IPokemonSpecies,
    IPokemonType,
    IPokemonSpeciesName,
  } from "../util/types";
  import EvolutionChain from "./EvolutionChain";
  import Type from "./Type";
  import Species from "./Species";
  import LearnedMove from "./LearnedMove";
  
  const pokemonObjs: IPokemon[] = require(POKEMON_JSON_PATH);
  const evolutionObjs: IPokemonEvolution[] = require(POKEMON_EVOLUTION_JSON_PATH);
  const pokemonMoveObjs: IPokemonMove[] = require(POKEMON_MOVES_JSON_PATH);
  const pokemonSpeciesObjs: IPokemonSpecies[] = require(POKEMON_SPECIES_JSON_PATH);
  const pokemonTypesObjs: IPokemonType[] = require(POKEMON_TYPES_JSON_PATH);
  const pokemonSpeciesNamesObjs: IPokemonSpeciesName[] = require(POKEMON_SPECIES_NAMES_JSON_PATH);
  
  const COLORS = {
    BLACK: 0x000000,
    BLUE: 0x6890f0,
    BROWN: 0x927d44,
    GRAY: 0x95a5a6,
    GREEN: 0x78c850,
    PINK: 0xee99ac,
    PURPLE: 0xa040a0,
    RED: 0xe74c3c,
    WHITE: 0xffffff,
    YELLOW: 0xffff00,
    // BLUE: 0x3498db,
  };
  
  export default class Pokemon implements IPokemon {
    /**
     * Get a Pokémon with its id or name
     * @param {string | number} idOrName The id or the name of the Pokémon
     */
    static get(idOrName: string | number): Pokemon | undefined {
      try {
        const pokemon = new Pokemon(idOrName);
        return pokemon;
      } catch {
        return;
      }
    }
  
    /**
     * Using `new Pokemon(idOrName)` directly will throw an error if no Pokémon was found with the specified id or name
     * Use the `Pokemon.get(idOrName)` method if you don't want it to throw an error, that method returns undefined if the Pokémon was not found.
     * @throws `Pokémon not found!` Error
     * @param {string | number} idOrName The ID or the name of the Pokémon
     */
  
    constructor(idOrName: string | number) {
      if (typeof idOrName === "string") {
        let pokemonObj;
        pokemonObj = pokemonObjs.find(
          (x) =>
            x.identifier.toLowerCase() === idOrName.toLowerCase() ||
            x.name.toLowerCase() === idOrName.toLowerCase()
        );
  
        if (!pokemonObj) {
          let id: number,
            namesObjs = pokemonSpeciesNamesObjs.filter(
              (x) => x.name.toLowerCase() === idOrName.toLowerCase()
            );
          if (!namesObjs?.length) {
            namesObjs = pokemonSpeciesNamesObjs.filter(
              (x) =>
                x.name.toLowerCase() ===
                idOrName.toLowerCase().replace(/'|"/, "’")
            );
          }
          if (namesObjs) id = namesObjs[0]?.id;
          if (id) pokemonObj = pokemonObjs.find((x) => x.id === id);
        }
  
        // if (!pokemonObj) {
        //   pokemonObj = pokemonObjs.find(
        //     (x) =>
        //       x.formName &&
        //       (`${x.formName} ${x.name}`.toLowerCase() ===
        //         idOrName.toLowerCase() ||
        //         `${x.name} ${x.formName}`.toLowerCase() ===
        //           idOrName.toLowerCase() ||
        //         `${x.formName}-${x.name}`.toLowerCase() ===
        //           idOrName.toLowerCase() ||
        //         `${x.name}-${x.formName}`.toLowerCase() ===
        //           idOrName.toLowerCase())
        //   );
        // }
  
        if (!pokemonObj) throw "Pokémon not found";
        for (const key in pokemonObj) {
          if (key === "name") continue;
          if (pokemonObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (pokemonObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
      } else if (typeof idOrName === "number" && !isNaN(idOrName)) {
        const pokemonObj = pokemonObjs.find((x) => x.id === idOrName);
        if (!pokemonObj) throw "Pokémon not found";
        for (const key in pokemonObj) {
          if (key === "name") continue;
          if (pokemonObj.hasOwnProperty(key)) {
            // eslint-disable-next-line
            const element = (pokemonObj as any)[key];
            // eslint-disable-next-line
            (this as any)[key] = element;
          }
        }
      } else {
        throw "You must provide a string or a number!";
      }
    }
    get moves() {
      if (!this._moves) {
        this._moves = [];
        const pokemonMoveObj = pokemonMoveObjs.find((x) => x.id === this.id);
        for (const move of pokemonMoveObj.moves) {
          this._moves.push(new LearnedMove(move.id, this.id));
        }
      }
      return this._moves;
    }
  
    get nextEvolutions() {
      if (!this._nextEvolutions) {
        this._nextEvolutions = [];
        const evolutionChain = evolutionObjs.filter((x) =>
          EvolutionChain.of(this.id).pokemonIds.includes(x.evolvedSpeciesId)
        );
        for (const evolution of evolutionChain) {
          const lastEvolutionSpecies = pokemonSpeciesObjs.find(
            (x) => x.id === evolution.evolvedSpeciesId
          );
          if (lastEvolutionSpecies.evolvesFromSpeciesId === this.id) {
            if (!this._nextEvolutions.includes(evolution.evolvedSpeciesId))
              this._nextEvolutions.push(evolution.evolvedSpeciesId);
          }
        }
      }
      return this._nextEvolutions;
    }
  
    get species() {
      if (!this._species) {
        this._species = Species.get(this.speciesId);
      }
      return this._species;
    }
  
    get types() {
      if (!this._types) {
        this._types = [];
        const pokemonTypeObj = pokemonTypesObjs.find((x) => x.id === this.id);
        if (pokemonTypeObj) {
          this._types = pokemonTypeObj.types.map((x) => new Type(x));
        }
      }
      return this._types;
    }
  
    get name() {
      return this.species.name;
    }
  
    get colorCode() {
      return Object.values(COLORS)[this.species.colorId - 1];
    }
  
    id: number;
    identifier: string;
    speciesId: number;
    height: number;
    weight: number;
    baseExp: number;
    order: number;
    isDefault: boolean;
    formName: string;
  
    protected _moves: LearnedMove[];
    private _nextEvolutions: number[];
    private _species: Species;
    private _types: Type[];
  }
  