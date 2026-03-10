/** var 與 let
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/let
 * https://tw.alphacamp.co/blog/javascript-var-let-const
 * https://realdennis.medium.com/%E9%96%92%E8%81%8A-var%E8%88%87let%E7%9A%84%E6%87%B6%E4%BA%BA%E5%8C%85-javascript-b5a3f40ee28d
 * 16JS(P.64)
 */

// let 宣告只是block，宣告後不屬於父物件，只存在block
// let 並不會在全域物件中建立變數
// let a = "Global"

// var宣告會屬於父物件
var a = "Global"

console.log(this)
console.log(a)
console.log(this.a)

// 物件內或函式不能以本身名呼叫自己，必須使用this
console.log(Window.a)

