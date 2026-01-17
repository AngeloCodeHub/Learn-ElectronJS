/**
 * 箭頭函式的屬性如有2個以上，則須用小括號
 * 
 * 一般函式與建構函式(視為物件)最大的不同就是呼叫的方式
 * 函式依呼叫的方式的不同而有所不同，1.正常函式呼叫 2.new呼叫(視為物件)
 * 
 */

function aa() {
    return '函式宣告式~';
};

let bb = function () {
    return '函式表達式(匿名)'
};

let cc = function dd() {
    return '函式表達式(具名)'   //具名只能函式本身使用
};

let dd = function () {
    return '立即執行函式';
}()

    (function () {
        return '宣告式不可匿名，但可用小括號變成立即執行函式'
    })();

//箭頭函式沒有自己的this、argument、super或new.target
let EE = () => { console.log('這是箭頭函式'); }

//=======================================================================================
//立即執行函式與非立即執行函式差異，試試以下console.log，思考差異
let helo = function () {
    return 'Hello~~~';
}();
console.log(helo);
console.log(typeof helo);
//console.log(typeof helo());
//console.log(helo());

//=======================================================================================
