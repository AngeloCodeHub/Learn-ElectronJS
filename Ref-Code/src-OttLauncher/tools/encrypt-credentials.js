import { config } from 'dotenv';
import { randomBytes, createHash, createCipheriv } from 'crypto';

config();

const secret = process.argv[2];
if (!secret) {
  console.error('Usage: node tools\\encrypt-credentials.js <secret>');
  process.exit(1);
}

const payload = {
  accounts: [
    { username: process.env.NETFLIX_USER_01 || '', password: process.env.NETFLIX_PASS_01 || '' },
    { username: process.env.NETFLIX_USER_02 || '', password: process.env.NETFLIX_PASS_02 || '' },
    { username: process.env.NETFLIX_USER_03 || '', password: process.env.NETFLIX_PASS_03 || '' },
  ],
};

const iv = randomBytes(12);
const key = createHash('sha256').update(secret).digest();
const cipher = createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

const result = {
  iv: iv.toString('base64'),
  tag: tag.toString('base64'),
  ciphertext: enc.toString('base64'),
};

console.log(JSON.stringify(result, null, 2));
