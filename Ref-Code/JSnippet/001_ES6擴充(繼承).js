/**
 * ★class裡可以static宣告為靜態，此時物件實體不能調用，只有直接物件本身能用
 * ★(誤)類別內無法呼叫全域函式，如console.log
 * ★類別內無論是函式內或函式外，皆不用宣告關鍵字let,var
 * 
 * super
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/super
 * 
 * class類別內只能宣告，宣告函式與屬性。不能直接呼叫
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes
 * 
 */
// 產生的物件實體，父類方法或成員都可調用(因為都屬於prototype)
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    showinfo() {
        return '我是 ' + this.name + ' 、 今年  ' + this.age + ' 歲';
    }
};
/**
 * 子類別透過super關鍵字存取(呼叫)父類別的成員(建構子)，相當於Person.call(this,...)
 */
class student extends Person {
    // 子類別本身建構子(constructor)可新增自己的參數
    constructor(s_name, s_age, tel) {
        super(s_name, s_age);  //對應(繼承自)父類別建構子(name,age)，參數可自取名,但是要對應
        this.tt = tel;
    };
    showinfo() {  //覆寫(overriding)或延伸父類別的showinfo()方法
        return super.showinfo() + '、電話： ' + this.tt;
    };
    static test() {
        return '這一行是靜態方法~~~';
    };
};

let Mary = new Person('瑪莉', '19');
let Angelo = new student('Angelo', '26', '0920217700');

console.log(Mary.showinfo());
console.log(Angelo.showinfo());

console.log(student.test());  //靜態方法
// 非靜態方法,會出現"is not a function"錯誤
// console.log(student.showinfo());

// 物件實體無法使用靜態方法
// console.log(Angelo.test());