/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 * 
 * 我
 * unicode表現方式：\u6211
 * 十進位：25105
 * 十六進位：151813(十進位表示)
 * 
 * 關鍵字：javascript string to unicode
 * 
 */
let str1 = '我是偉人';
let str2 =
    `我是偉人`;
console.log("普通字串型態：" + typeof (str1))
console.log("板模字串型態：" + typeof (str2))
// 字串轉成十進位，index=0
let codeInt = str1.charCodeAt(0)

console.log("十進位表示：" + codeInt);
console.log("二進未表示：" + codeInt.toString(2))
console.log("跳脫字元表示：\u6211")
console.log("十進位還原中文字：" + String.fromCodePoint(codeInt))
