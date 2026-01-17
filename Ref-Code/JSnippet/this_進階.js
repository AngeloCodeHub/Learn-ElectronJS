/**
 * https://www.youtube.com/watch?v=NHliVGQef-4
 * bind、apply、call
 * 自訂綁定物件
 */

// 使用bind重新綁定物件
/* 
function test() {
    console.log("綁定物件：", this);
}
test();
let test2 = test.bind({ x: 3 })
test2();
let test3 = test.bind(document);
test3();
 */

// 使用apply呼叫函式，可自己設定綁定物件
function add(n1, n2) {
    console.log("結果：", n1 + n2)
    console.log("綁定物件：", this)
}
add(3, 4);  //基本的函式呼叫，無法自己設定綁定物件
add.apply({ y: 4 }, [4, 5])
add.apply(document, [5, 6]);
// 使用call呼叫函式，可自己設定綁定物件
add.call({z:10},10,4)
