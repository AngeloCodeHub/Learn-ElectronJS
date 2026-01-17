
function add(a, b) {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            let sum = a + b;
            sum > 0 ? resolve(`${sum}, 成功`) : reject(`${sum}, 失敗`);
        }, 1000);
    })
}

add(10, 10)
    .then(success => {
        console.log(success); //20, 成功
        return add(5, 10);
    })
    .then(success => {
        console.log(success); //15, 成功
        return add(3, -5);
    })
    .then(success => {
        console.log(success);
        return add(0, 2) //沒有被執行
    })
    .catch(error => {
        console.log(error); //-2, 失敗
    })
