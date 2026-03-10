/* 
    重點
    console.error用法
    if...else if
    try...catch
    instanceof運算子
 */

try {
    let n = 65;
    if (n >= 50) {
        console.log(a + '大於等於50');
    }
} catch (e) {
    if (e instanceof TypeError) {
        console.error('這是TypeError錯誤類型');
    } else if (e instanceof RangeError) {
        console.error('這是RangeError錯誤類型');
    } else if (e instanceof ReferenceError) {
        console.error('這是RefernceError錯誤類型');
    } else {
        console.error('error');
    }
};

