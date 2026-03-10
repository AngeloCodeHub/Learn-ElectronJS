/* 
可使用自由變數的內部函式稱為閉包
閉包很佔記憶體，要警慎使用，引用完將之設為null，讓GC回收
 */

let account = function () {
    let balance = 1000;  //自由變數,外部無法存取
    return {
        //以下3個函式為閉包
        depsite: function (d) {
            balance += d;
        },
        withdraw: function (w) {
            balance -= w;
        },
        value: function () {
            return balance;
        }
    };
}();
account.depsite(600);
account.withdraw(300);
console.log(account.value());

account = null;

/**
 * balance變數隱藏在'匿名函式'裡面，外部無法存取，只能透過公開的函式depsite、withdrao、value
 * 這三個閉包(closure)，才能改改變balance值
 * 
 */
