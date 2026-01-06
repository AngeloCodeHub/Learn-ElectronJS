import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO:讀取日誌檔案
const logFilePath = path.join(__dirname, 'log', 'Switch-1.log');
const logData = fs.readFileSync(logFilePath, 'utf-8');

// 解析日誌檔案
const logLines = logData.split('\n');
const interfaceDownUpPairs = {};
const result = new Set();

logLines.forEach(line => {
  const match = line.match(
    /Jan \d{2} (\d{2}:\d{2}:\d{2}) INTERFACE-4: interface eth-0-(\d+) state change to (down|up)/
  );
  if (match) {
    const time = match[1];
    const interfaceNumber = match[2];
    const state = match[3];

    if (!interfaceDownUpPairs[interfaceNumber]) {
      interfaceDownUpPairs[interfaceNumber] = {};
    }

    if (state === 'down') {
      interfaceDownUpPairs[interfaceNumber].down = time;
    } else if (state === 'up') {
      interfaceDownUpPairs[interfaceNumber].up = time;
    }

    if (interfaceDownUpPairs[interfaceNumber].down && interfaceDownUpPairs[interfaceNumber].up) {
      const downTime = new Date(`1970-01-01T${interfaceDownUpPairs[interfaceNumber].down}Z`);
      const upTime = new Date(`1970-01-01T${interfaceDownUpPairs[interfaceNumber].up}Z`);
      const timeDiff = (upTime - downTime) / 1000;
      // TODO:
      // if (timeDiff !== 3) {
      if (timeDiff > 9) {
        result.add(parseInt(interfaceNumber, 10));
      }

      // 重置狀態
      interfaceDownUpPairs[interfaceNumber] = {};
    }
  }
});

// 將結果轉換為排序的陣列
const sortedResult = Array.from(result).sort((a, b) => a - b);

console.log(sortedResult);
console.log(sortedResult.length);
