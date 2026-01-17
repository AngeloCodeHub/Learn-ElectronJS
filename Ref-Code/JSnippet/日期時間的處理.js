
/**
 * 取得本月第一天與最後一天
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */

const aa = new Date()
const bb = new Date(aa.getFullYear(),aa.getMonth(),1);
const cc = new Date(aa.getFullYear(),aa.getMonth()+1,0);

console.log(bb);
console.log(cc);
// console.log(aa.getMonth()+1);
// 特定日期
let now_1 = new Date('August 1, 2023 15:15:30')
let now_2 = new Date('12 31, 2022 23:15:30')



