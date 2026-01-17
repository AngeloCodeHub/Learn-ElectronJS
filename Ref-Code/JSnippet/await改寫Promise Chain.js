//async/await改寫Promise Chain
function play1(n) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("play1 =", n * n);
            resolve(n * n);
        }, 3000);
    })
};
function play2(n) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("play2 =", n + n);
            resolve(n + n);
        }, 5000)
    })
};

async function add1(x) {
    try {
        let play1value = await play1(20);
        let play2value = await play2(play1value);
        console.log(x + play1value + play2value);
    } catch (err) {
        console.log(err);
    }
}

add1(10)