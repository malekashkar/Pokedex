import {
    POKEMON_EVOLUTION_JSON_PATH,
    POKEMON_SPECIES_JSON_PATH,
  } from "../util/constants";
  
  import { IPokemonEvolution, IPokemonSpecies } from "../util/types";
  
  export interface IEvolutionChain {
    id: number;
    pokemonIds: number[];
  }
  
  const pokemonSpeciesObjs: IPokemonSpecies[] = require(POKEMON_SPECIES_JSON_PATH);
  const pokemonEvolutionObjs: IPokemonEvolution[] = require(POKEMON_EVOLUTION_JSON_PATH);
  
  const evolutionChains: IEvolutionChain[] = [];
  
  for (const pokemonSpeciesObj of pokemonSpeciesObjs) {
    let evolutionChain = evolutionChains.find(
      (x) => x.id === pokemonSpeciesObj.evolutionChainId
    );
    if (!evolutionChain) {
      evolutionChain = {
        id: pokemonSpeciesObj.evolutionChainId,
        pokemonIds: [pokemonSpeciesObj.id],
      };
      evolutionChains.push(evolutionChain);
    } else evolutionChain.pokemonIds.push(pokemonSpeciesObj.id);
  }
  
  function details(evolvedSpeciesId: number) {
    return pokemonEvolutionObjs.find(
      (x) => x.evolvedSpeciesId === evolvedSpeciesId
    );
  }
  
  function get(id: number) {
    return evolutionChains.find((x) => x.id === id);
  }
  
  function of(pokemonId: number) {
    return evolutionChains.find((x) => x.pokemonIds.includes(pokemonId));
  }
  
  export default {
    details,
    get,
    of,
  };
  