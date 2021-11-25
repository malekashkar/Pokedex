import { IName, IType } from "../util/types";
import { TYPES_JSON_PATH, TYPE_NAMES_JSON_PATH } from "../util/constants";

const typeObjs: IType[] = require(TYPES_JSON_PATH);
const typeNameObjs: IName[] = require(TYPE_NAMES_JSON_PATH);

export class Type implements IType {
  constructor(idOrName: string | number) {
    if (typeof idOrName === "string") {
      const typeObj = typeObjs.find(
        (x, i) =>
          x.identifier.toLowerCase() === idOrName.toLowerCase() ||
          typeNameObjs[i].name.toLowerCase() === idOrName.toLowerCase()
      );
      if (!typeObj) return;
      const typeNameObj = typeNameObjs.find(
        (x) => x.languageId === 9 && x.id === typeObj.id
      );
      if (!typeNameObj) return;
      for (const key in typeObj) {
        if (typeObj.hasOwnProperty(key)) {
          // eslint-disable-next-line
          const element = (typeObj as any)[key];
          // eslint-disable-next-line
          (this as any)[key] = element;
        }
      }
      this.name = typeNameObj.name;
    } else if (typeof idOrName === "number" && !isNaN(idOrName)) {
      const typeObj = typeObjs.find((x) => x.id === idOrName);
      if (!typeObj) return;
      const typeNameObj = typeNameObjs.find(
        (x) => x.languageId === 9 && x.id === typeObj.id
      );
      if (!typeNameObj) return;
      for (const key in typeObj) {
        if (typeObj.hasOwnProperty(key)) {
          // eslint-disable-next-line
          const element = (typeObj as any)[key];
          // eslint-disable-next-line
          (this as any)[key] = element;
        }
      }
      this.name = typeNameObj.name;
    } else {
      throw Error("You must provide a string or a number!");
    }
  }

  id: number;
  name: string;
  identifier: string;
  generationId: number;
  romanGenerationId: string;
  damageClassId: number;
}

export default Type;
