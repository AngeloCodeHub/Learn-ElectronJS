/**
 * https://ithelp.ithome.com.tw/articles/10192739
 * 
 * for迴圈不會等待setTimeout()
 * 
 * 原文中的i全部都=5，javascript似乎已作修正
 * 
 * 注意timer要*i
 */


for (let i = 0; i < 5; i++) {

    setTimeout(() => {
        console.log(i);
    }, 1000 * i);
};

