/**
 * 只有原型method或屬性才能由產生的物件實體(instance)調用
 * myArray.length
 * myArray.indexOf()
 * 
 * 錯誤寫法(非原型)
 * myArray.isArray()
 * 正確寫法：Array.isArray(myArray)
 */

// 要點：
// 以下為產生物件之2種寫法
// class裡面成員與方法不使用宣告關鍵字，直接使用即宣告
// 建構子(constructor)在new物件實體時就會執行

// constructor（建構子）是個隨著 class 一同建立並初始化物件的特殊方法。
// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes/constructor

class myObj {
    constructor() { };
    myself(name, age) {
        this.name = name;
        this.age = age;
        console.log('我叫 ' + this.name + '、今年' + this.age + ' 歲')
    };
};
let aa = new myObj('約翰', '26');
aa.myself();

/*
//第2種，此種寫法沒有建構子，不用產生新實體，可直接呼叫
let aa = {
    myself:function(name,age){
        this.name = name;
        this.age = age;
        console.log('我叫 ' + this.name + '、今年' + this.age +' 歲')
    },

    himself:function(){
        console.log('很高興認識大家');
    }
}
aa.myself('瑪莉','20').himself();
*/

/* 
//第3種
let myOb = new Object();
 */