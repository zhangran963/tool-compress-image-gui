import * as utils from "./index";

/**
 * 日期字符串 => 日期对象
 * @param {string} dateStr 日期字符串, 1999-01-01
 */
export function getDateObj(dateStr = "") {
  let [year, month, date] = dateStr.split(/[^\d]+/g);
  year = parseInt(year);
  month = parseInt(month) - 1;
  date = parseInt(date);
  return new Date(year, month, date, 0, 0, 0);
}

/**
 * 日期对象 => 日期字符串
 * @param {Date} dateObj 日期对象
 */
export function getDateStr(dateObj) {
  if (!utils.isDefDate(dateObj)) {
    dateObj = new Date(dateObj);
  }
  if (utils.isDefDate(dateObj)) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth()+1;
    const date = dateObj.getDate();
    return `${year}-${addZero(month)}-${addZero(date)}`;
  }else{
    return null
  }
}

/* 补零 */
function addZero(val) {
  val = parseInt(val);
  return val >= 10 ? `${val}` : `0${val}`;
}


/* 简单深度复制 */
export function copy(val){
  return JSON.parse(JSON.stringify(val))
}