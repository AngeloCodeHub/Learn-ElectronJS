const dataPath = '/log/Switch-2.log';
const logDataPromise = Bun.file(__dirname + dataPath).text();

// console.log('logDataPromise：', logDataPromise);

let logLines: string[] = [];

await logDataPromise.then((data) => {
  logLines = data.split('\n');
  // You can now use logLines here
  // console.log(logLines);
}).catch((err) => {
  console.error('Error reading log file:', err);
});

console.log(logLines[61]);
console.log(logLines[61].length);
console.log(logLines[61][64]);
// console.log(logLines.length);

// logDataPromise.text().then((data) => {
//   let logLine=0;
//   data.split('\n').forEach((line) => {
//     console.log(line);
//     logLine++;
//   });
//   console.log('Line：', logLine);

// }).catch((err) => {
//   console.error('Error reading log file:', err);
// });

