
/*
    函式中的函式
    javascript函式是後進先出，所以會從1!開始列印
    factorial(6) 呼叫 factorial(5)...直到factorial(1)就沒有呼叫
    此時x=1，myfunc(1)=factorial(1)=1的回傳值 
    依序把factorial(1)...factorial(6)實現
*/

var myfunc = function factorial(n) {
    //console.log('測試文字一')
    let x = (n == 1 ? n : n * factorial(n - 1));
    //console.log('測試文字二')
    console.log(n + "! → " + x);
    return x;
};
console.log(myfunc(6));


