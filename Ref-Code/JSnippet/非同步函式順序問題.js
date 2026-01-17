/* 
function play1(n) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("play1 =", n * n);
            resolve(n * n);
        }, 5000);
    })
};

async function add1(x) {
    // 等待play1()執行，再繼續自己的函式
    let play1value = await play1(20);
    // let play1value = play1(20);
    console.log("x + play1value =", x + play1value);
}

add1(10)
 */


// let outsideVar
let outsideVar

function play2() {
    console.log("這是AAA函式~~~這是同步函式");
    outsideVar = 200
}
function play1() {
    return new Promise((res, rej) => {
        console.log("這是非同步函式");
        // outsideVar = 100
        res("OK~~~")
    })
}
console.log(outsideVar);
// async函式內的await是與外層併發執行，賦值會不成功
// play2往上提可成功(因為是同步函式，先執行play2在執行await函式)
async function MyAsyc() {
    await play1()
    play2()
}
MyAsyc()

// console.log(typeof play);
