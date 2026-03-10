class test1 {
    preload() {
        console.log('test1的函式');
        let aa = new test2;
        aa.preload();
    };
};

class test2 {
    preload() {
        console.log('test2的函式');
    };
};

let trtrt = new test1;
trtrt.preload();

