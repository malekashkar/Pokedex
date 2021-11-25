import { getRandomIntInclusive } from "../util";
import {
  NATURE_NAMES_JSON_PATH,
  NATURES_JSON_PATH,
} from "../util/constants";

import { IName, INature } from "../util/types";

const natureNameObjs: IName[] = require(NATURE_NAMES_JSON_PATH);
const natureObjs: INature[] = require(NATURES_JSON_PATH);

export default class Nature implements INature {
  id: number;
  identifier: string;
  decreasedStatId: number;
  increasedStatId: number;
  hatesFlavorId: number;
  likesFlavorId: number;
  gameIndex: number;
  name: string;

  /**
   * Returns nature data by name
   * @param {string} name
   */
  static getByName(name: string) {
    let natureOrNatureNameObj: IName | INature = natureNameObjs.find(
    (x) => x.name.toLowerCase() === name.toLowerCase() && x.languageId === 9
    );
    if (!natureOrNatureNameObj || !natureOrNatureNameObj.id) {
    natureOrNatureNameObj = natureObjs.find(
        (x) => x.identifier.toLowerCase() === name.toLowerCase()
    );
    }

    if (!natureOrNatureNameObj || !natureOrNatureNameObj.id) return;
    return new Nature(natureOrNatureNameObj.id);
  }

  /**
   * Gives the nature data given the nature id
   * @param {number} id The id of the nature
   */
  constructor(id: number) {
    if (!id) return;
    if (typeof id !== "number") {
      id = parseInt(id);
    }
    if (isNaN(id)) return;

    const natureObj = natureObjs.find((x) => x.id === id);
    if (!natureObj) return;
    const natureNameObj = natureNameObjs.find(
    (x) => x.id === id && x.languageId === 9
    );
    if (!natureNameObj) return;
    for (const key in natureObj) {
    if (natureObj.hasOwnProperty(key)) {
        // eslint-disable-next-line
        const element = (natureObj as any)[key];
        // eslint-disable-next-line
        (this as any)[key] = element;
    }
    }
    this.name = natureNameObj.name;
  }

  static random() {
    return new Nature(getRandomIntInclusive(1, 25));
  }

  toString() {
    return this.name;
  }
}
