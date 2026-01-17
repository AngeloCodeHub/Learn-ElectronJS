
let sglist = [25, 31, 58]
let color = [5, 2, 0]
let arr2D = []
let tmpIndex = 0
for (let Y = 0; Y < 8; Y++) {
    for (let X = 0; X < 8; X++) {

        if (sglist[0] === tmpIndex) {
            arr2D[[X, Y]] = color[0]
        } else {
            arr2D[[X, Y]] = false
        }

        if (sglist[1] === tmpIndex) {
            arr2D[[X, Y]] = color[1]
        } else {
            arr2D[[X, Y]] = false
        }

        tmpIndex++
    }
}

console.log(arr2D);
console.log(arr2D.length);