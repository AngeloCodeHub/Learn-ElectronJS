

/**
 * 隨機亂數
 * 產生0-99隨機整數，判斷是否大於50
 * 使用if else與三元運算子敘述
 * 三元運算子可加上小括號方便閱讀
 */

let n = Math.floor(Math.random() * 100);

if (n >= 50) {
    console.log('n值= ' + n + '，大於等於50,此為if else敘述');
} else {
    console.log('n值= ' + n + '，小於等於50,此為if else敘述');
};

console.log(Math.random());

n >= 50 ? console.log('n值= ' + n + '，大於等於50,此為三元運算子敘述') :
    console.log('n值= ' + n + '，小於等於50,此為三元運算子敘述');