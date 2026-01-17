/**
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array
 * 方法中有callback(回呼函式)可自訂函式當參數，也可帶入內建物建進行運算
 * 如map()、reduce()
 * 
 * 陣列也是物件的一種，有value(元素),key(索引)
 * forEach方法內的函式第一個是value
 */

/* 
let myArray1 = ['魔羯', '天秤', '天蠍', '牡羊', '天秤', '處女'];
let myArray2 = [1, 2, 3];

console.log(myArray1.concat(myArray2));  //結合兩個陣列
console.log(myArray1.includes('處女座'));
console.log(myArray1.indexOf('處女'));  //回傳元素的索引值
console.log(myArray1.join('***'));
console.log(myArray1.slice(5));   //提取指定索引值的元素，未填參數就是全部提取
console.log(myArray1.toString());   //陣列轉換為字串，用逗號分隔
console.log(myArray1.copyWithin(0, 3, 4));

//console.log(myArray1[5]());

//疊代器物件的方法next()
let iter = myArray2[Symbol.iterator]();   //是一種方法(method)，傳回疊代器的方法
console.log(iter);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
 */

/* 
//使用Array.prototype方法產生新的疊代器物件
let myArray = [10, 20, 30, 40, 50];
console.log('原始陣列', myArray);

let iterator1 = myArray.entries();
console.log(iterator1.next().value);

let iterator2 = myArray.values();
console.log(iterator1.next().value);

let filtered = myArray.filter(value => value > 25);
console.log(filtered);

let new1 = myArray.map(x => x * 2); //產生新的陣列
console.log(new1);
 */

let myArray = [1, 2, 3, 4];
let reduceArr = myArray.reduce((acc, cur, idx, src) => {
    console.log(acc, cur, idx);
    return acc + cur;
})


