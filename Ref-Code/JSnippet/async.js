/**
 * 
 */

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
    // let play1value = await play1(20);
    let play1value = play1(20);
    console.log("x + play1value =", x + play1value);
}

add1(10)
