/**
 * Object
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object
 * 
 * 繼承與原型鏈
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
 * 
 * ES6 class 的原形方法外部是無法存取，除非宣告為static或是產生一個實體
 */

// 沒有prototype宣告只能本身取用，繼承與實體不能取用
function Person(username) {
    this.username = username;
    // this.run=function(){
    //     console.log(this.username,"喜歡跑馬拉松~~~")
    // };
};
Person.prototype.run = function () {
    console.log(this.username + ' 正在跑步~~~');
};

//宣告建構子的成員，無效
Person.prototype.bb = '大家好';
// console.log("呼叫Person.bb"+Person.bb);

function student(username, classname) {
    Person.call(this, username);  //call Person建構子函式
    this.b = classname;
};

// 擴充(extends)父類別
student.prototype = Object.create(Person.prototype);

//子類別的study方法
student.prototype.study = function () {
    console.log(this.b + ' 的' + this.username + '正在用功唸書!!!');
};

let John = new Person('約翰');
John.run();
console.log(John.bb)
//擴充只能往上找,以下錯誤
// John.study();

let Mary = new student('瑪莉', '三年一班');
Mary.study();
Mary.run();
console.log(Mary.bb)

// console.log(John);
// console.log(Mary);