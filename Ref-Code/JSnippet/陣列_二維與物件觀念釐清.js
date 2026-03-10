/**
 * 二維陣列的定義與使用
 * https://tw511.com/a/01/2531.html
 * 
 * 2維陣列，計算學生平均成績，全班總成績
 * https://acupun.site/lecture/html5_CSS_javascript/8-array03-part2.html
 */

/* 
// 陣列變成物件
// let Gems = [];
// let Gems={};

// 變成物件物件宣告非陣列，16js(P.208)
// 2維陣列不是用此表達式宣告
Gems[[0, 0]] = "寶石-藍";
Gems[[0, 1]] = "寶石-紅";
Gems[[1, 0]] = "寶石-綠";
Gems[[1, 1]] = "寶石-黃";

// 陣列，變成物件方式表達(索引=key，元素=value)
console.log("型別是：" + typeof (Gems))
// 物件，有key:value
console.log("Gems是：物件=>", Gems);
console.log(Gems[[0, 1]]);   //索引是key
console.log(Gems[[1, 1]]);   //索引是key
console.log("Gems陣列長度是(其實非陣列)：" + Gems.length);
console.log("判斷是不是陣列：" + Array.isArray(Gems));
// 陣列也是物件
 */


/* // 二維陣列
// 宣告：方法一
let myArray2D = [["0-1", "0-2", "0-3"], ["1-1", "1-2", "1-3"], ["2-1", "2-2", "2-3"], ["3-1", "3-2", "3-3"]];
console.log(myArray2D[2].length);
// 二維陣列單元素
console.log(myArray2D[1][2]); */

/* // 宣告：方法二
let myArray2D = [];
myArray2D[0] = ["0-1", "0-2", "0-3"];
myArray2D[1] = ["1-1", "1-2", "1-3"];
myArray2D[2] = ["2-1", "2-2", "2-3"];
myArray2D[3] = ["3-1", "3-2", "3-3"];
console.log(myArray2D.length);
// 二維陣列單元素
console.log(myArray2D[1][2]); */

// 以印加寶石座標為例
const coordX = [103, 228, 350, 476, 603, 728, 858, 992];
const coordY = [725, 855, 983, 1115, 1245, 1374, 1505, 1636];
let mainCoordXY = []
// 第一維
mainCoordXY[0] =
    [
        [coordX[0], coordY[0]], [coordX[0], coordY[1]], [coordX[0], coordY[2]], [coordX[0], coordY[3]], [coordX[0], coordY[4]], [coordX[0], coordY[5]], [coordX[0], coordY[6]], [coordX[0], coordY[7]]
    ]
// 第二維
mainCoordXY[1] =
    [
        [coordX[1], coordY[0]], [coordX[1], coordY[1]], [coordX[1], coordY[2]], [coordX[1], coordY[3]], [coordX[1], coordY[4]], [coordX[1], coordY[5]], [coordX[1], coordY[6]], [coordX[1], coordY[7]]
    ]

// for (let i = 0; i < coordX.length; i++) {
//     mainCoordXY[0] = [[coordX[0], coordY[i]]];
// };
console.log(mainCoordXY[1]);
console.log(mainCoordXY[0][5][1]);
console.log(mainCoordXY.length)

for (const iter of mainCoordXY[0]) {
    // console.log(iter)
}




