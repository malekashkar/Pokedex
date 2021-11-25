import Type from "./Type";
import { IMove, ITypeEfficacy, IMoveMeta } from "../util/types";
import {
  MOVES_JSON_PATH,
  MOVE_META_JSON_PATH,
  TYPE_EFFICACY_JSON_PATH,
} from "../util/constants";

const moveObjs: IMove[] = require(MOVES_JSON_PATH);
const moveMetaObjs: IMoveMeta[] = require(MOVE_META_JSON_PATH);
const typeEfficacies: ITypeEfficacy[] = require(TYPE_EFFICACY_JSON_PATH);

export default class Move implements IMove {
  /**
   * Returns move info by name
   * @param {string} name
   */
  static getByName(name: string) {
    const moveObj = moveObjs.find(
    (x) =>
        x.identifier.toLowerCase() === name.toLowerCase() ||
        x.name.toLowerCase() === name.toLowerCase()
    );
    if (!moveObj) return;
    return new Move(moveObj.id);
  }

  /**
   * Gives the move data given the move id
   * @param {number} id The id of the move
   */
  constructor(id: number) {
    if (!id) return;
    if (typeof id !== "number") {
      id = parseInt(id);
    }
    if (isNaN(id)) return;

    const moveObj = moveObjs.find((x) => x.id === id);
    for (const key in moveObj) {
    if (moveObj.hasOwnProperty(key)) {
        // eslint-disable-next-line
        const element = (moveObj as any)[key];
        // eslint-disable-next-line
        (this as any)[key] = element;
    }
    }
  }

  get type() {
    if (!this._type) {
      this._type = new Type(this.typeId);
    }
    return this._type;
  }

  get meta() {
    if (!this._meta) {
      this._meta = moveMetaObjs.find((x) => x.id === this.id);
    }
    return this._meta;
  }

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

  private _type: Type;
  private _meta: IMoveMeta;
}

// 32 bit integer OVERFLOW PROTECTION
function OF32(n: number) {
  return n > 0xffffffff ? n % 0x100000000 : n;
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getTypeEffectiveness(move: Move, defenderTypes: Type[]) {
  const effectivenesses = [];

  const efficacies = typeEfficacies.find((x) => x.id === move.type.id);
  if (efficacies) {
    for (const defenderType of defenderTypes) {
      const efficacy = efficacies.efficacies.find(
        (x) => x.targetTypeId === defenderType.id
      );
      if (efficacy) {
        effectivenesses.push(efficacy.damageFactor / 100);
      }
    }
  }

  if (!effectivenesses.length)
    return move.identifier === "shadow"
      ? defenderTypes.find((x) => x.identifier === "shadow")
        ? 0.5
        : 2
      : 1;
  return effectivenesses.reduce((a, b) => a * b) || 0;
}
