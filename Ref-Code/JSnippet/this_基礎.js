/**
 * this代表函式的綁定物件
 * 
 * JavaScript 的 this 到底是誰？
 * https://ithelp.ithome.com.tw/articles/10191393?sc=pt
 * 
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this
 * 
 * 淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂
 * https://blog.techbridge.cc/2019/02/23/javascript-this/
 * 
 * 澎澎javascript
 * https://www.youtube.com/watch?v=5Vi5idUkuyA
 * 以下幾種情境：
 * 1.一般獨立函式
 * 2.物件的方法
 * 3.事件處理函式
 * 4.建構函式
 */

// 情況1：一般獨立函式：指向window
/* 
function myFunc1() {
    console.log(this);
    console.log(this.innerWidth)
};
myFunc1();
 */

// 情況2：物件的方法
/* 
let obj={
    x:3,
    test:function(){
        console.log(this);  //this就是方法所屬的物件本身
        console.log(this.x);
    };
};
obj.test();
 */

// 情況3：事件處理函式
/* 
document.addEventListener("click", function () {
    console.log(this);  //this 就是觸發事件的對象物件
    this.body.innerHTML="Clicked";
});
 */

// 情況4：建構函式
function Point() {
    console.log(this);  //this就是瀏覽器自動幫我們新建立好的空白物件，此行代表產生空白物件
    this.x=3;
    this.y=4;
}
let p1=new Point();
console.log(p1)
/*
class myClass{
    constructor(){
        console.log(this);
    };
};
new myClass;
*/

//箭頭函式沒有自己的this
//document.addEventListener('click',()=>{console.log(this)})

/**
 * 類別建構子裡的函式this指向是 undefined，類別下this指物件本身(只有一層，第2層是undefind)
 * 可使用this重新指向 XXX=this
 * 全域下函式裡的函式this還是指向全域window
 */

// class Person {
//     constructor(name, id, age) {
//         this.name = name; this.id = id, this.age = age;
//         function aa() {
//             console.log('以下是建構子內的函式的this');
//             console.log(this);
//         };
//         aa();
//     };
//     showinfo() {
//         console.log(this);
//         console.log('姓名：' + this.name + '  身分證：' + this.id + '  年齡：' + this.age);
//     };
// };
// let mary = new Person('瑪莉', 'S12555666', 20);
// mary.showinfo();


/**
 * 函式依呼叫的方式的不同而有所不同，1.正常函式呼叫 2.new呼叫(視為物件)
 * 呼叫方式不同導致this指向不同,以下是2種呼叫方式
 */

// function person(username) {
//     console.log(this);
//     this.username = username;
// };
// let aaa = new person;
// person();
