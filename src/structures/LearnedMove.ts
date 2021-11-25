import Move from "./Move";
import { IPokemonMove } from "../util/types";
import { POKEMON_MOVES_JSON_PATH } from "../util/constants";

const pokemonMoveObjs: IPokemonMove[] = require(POKEMON_MOVES_JSON_PATH);

export default class LearnedMove extends Move {
  /**
   * Gives the learned move data given the move id
   * @param {number} id The id of the move
   * @param {number} pokemonId The id of thet pokemon that learned this move
   */
  constructor(id: number, pokemonId: number) {
    super(id);

    const pokemonMoves = pokemonMoveObjs.find((x) => x.id === pokemonId);
    if (pokemonMoves) {
      const pokemonMove = pokemonMoves.moves.find((x) => x.id === id);
      if (pokemonMove) {
        this.moveMethodId = pokemonMove.moveMethodId;
        this.order = pokemonMove.order;
        this.requiredLevel = pokemonMove.requiredLevel;
        this.versionGroupId = pokemonMove.versionGroupId;
        this.available = true;
      }
    }
  }

  available = false;

  moveMethodId: number;
  order: number;
  requiredLevel: number;
  versionGroupId: number;
}
