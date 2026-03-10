console.group();
let target = "Life was like a box of chocolates.\nYou never know what you're gonna get.\r\n--Forrest Gump"
let reg = /\r\n|\n/g
// split方法傳回一個陣列物件
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
let arr = target.split(reg);
console.log("陣列的長度："+arr.length)
console.log(arr[1])
// 陣列物件的forEach方法
arr.forEach(function (value, key) {
    console.log(key,value)
});
console.log(reg.source);
console.log(reg.flags);
console.groupEnd();

console.group();
let reg1=/you/g;
let m1;
while((m1=reg1.exec(target))!==null){
    console.log("找到",m1[0],"下一次搜尋開始位置",reg1.lastIndex);
};
console.groupEnd();

/* 
let target = "18, 2150, 310\n, Sunday, Monday, Tuesday"
// 符合以18為開頭
let reg1 = /^18/gi
let reg2 = /day$/g
let reg3 = /310$/
let reg4 = /310$/m
console.log(target.match(reg1));
console.log(target.match(reg2));
console.log(target.match(reg3));
console.log(target.match(reg4));
 */
/* 
let target = "18, 2150, 310, Sunday, Monday, Tuesday"
// 全域比對f、g、h、i、j、k、l、m，忽略大小寫
let reg1 = /[f-m]/gi
// 搜尋Sunday,，一次或一次以上的逗號
let reg2 = /Sunday,+/g
// 比對有3~4位數的數字字串，上面數字前後有逗號，所以不會搜出整個字串
// 符合數字出現3~4次
let reg3 = /\d{3,4}/g
console.log(target.match(reg1));
console.log(target.match(reg2));
console.log(target.match(reg3));
 */

/*
let target = "good morning"
// 比對good字串
let reg1 = /good/
// 比對任一字元，預設只會傳回一個字元
let reg2 = /./
// 全域模式會傳回所有字元
let reg3 = /./g
// 比對i加任一字元
let reg4 = /i./

console.log(target.match(reg1));
console.log(target.match(reg2));
console.log(target.match(reg3));
console.log(target.match(reg4));
 */