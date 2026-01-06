import { writeFileSync } from 'fs';

const filePath = './build/Command.sh';
const content = 'configure terminal\n';

writeFileSync(filePath, content);

for (let i = 1; i <= 20; i++) {
  if (i === 9 || i === 10 || i === 15) continue;
  const interfaceString = `interface eth-0-${i}\nduplex full\nexit\n`;
  writeFileSync(filePath, interfaceString, { flag: 'a' });
}
