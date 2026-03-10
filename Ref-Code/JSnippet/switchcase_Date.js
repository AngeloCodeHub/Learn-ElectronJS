/* 
    switch('程式敘述'){
        case '值1':
            '程式敘述';
            break;
        case '值2':
            '程式敘述';
            break;
        case '值n':
            '程式敘述';
            break;
        default:
            '程式敘述';
    };
拿掉break則敘述不會被忽略

Date()內建物件
寫法 new Date.getDay();

n = new Date;  可以不括號
new Date().getDay();  Date一定要括號
 */

let day;

switch (new Date().getDay()) {
    case 0:
        day = "星期日";
        break;
    case 1:
        day = "星期一";
        break;
    case 2:
        day = "星期二";
        break;
    case 3:
        day = "星期三";
        break;
    case 4:
        day = "星期四";
        break;
    case 5:
        day = "星期五";
    //break;
    case 6:
        day = "星期六";
        break;
    default:
        day = '鬼日子';
        break;
};

console.log('今天是 ' + day);



