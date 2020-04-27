function isDef(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export const isDefStr = (str) => isDef("String", str);
export const isDefValidStr = (str) => isDefStr(str) && str.length > 0;
export const isDefNum = (number) => isDef("Number", number) && !Number.isNaN(number) ;
export const isDefArr = (arr) => isDef('Array', arr);
export const isDefDate = isDef.bind(null, 'Date')
export const isDefBool = isDef.bind(null, 'Boolean')
export const isDefObj = isDef.bind(null, 'Object')
export const isDefTrue = (val) => val === true
export const isDefNull = (val) => val === null
export const isDefFalse = (val) => val === false

