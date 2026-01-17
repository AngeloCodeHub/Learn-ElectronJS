


//continue意義是說，回到迴圈開始的地方，所以continue以下程式不會執行
//從下一個疊代4開始
for (let a = 0; a <= 10; a++) {
    if (a === 3) {
        console.log(a);
        continue;
    };
    if (a === 8) {
        console.log(a);
        break;
    };
    console.log('for迴圈 a= ' + a);
};