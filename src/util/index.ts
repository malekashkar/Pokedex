import { Response } from "node-fetch";

function addAfterField(obj: any, prevKey: string, key: string, value: any) {
  const newObj: any = {};
  const objKeys = Object.keys(obj);
  for (const currentKey of objKeys) {
    if (obj.hasOwnProperty(currentKey)) {
      const element = obj[currentKey];
      if (prevKey === objKeys[objKeys.indexOf(currentKey) - 1]) {
        newObj[key] = value;
      }
      newObj[currentKey] = element;
    }
  }
  return newObj;
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function identifierToName(identifier: string) {
  return (identifier || "").replace(/-/g, " ");
}

function romanize(num: number) {
  if (isNaN(num)) return "";
  const digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ];
  let roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

function toTitleCase(str: string) {
  return str?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export class FetchError extends Error {
  constructor(message: string, public response: Response) {
    super(message);
  }
}

export {
  addAfterField,
  identifierToName,
  getRandomIntInclusive,
  romanize,
  toTitleCase,
};
