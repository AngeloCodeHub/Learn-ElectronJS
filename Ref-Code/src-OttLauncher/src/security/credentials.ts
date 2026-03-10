import * as crypto from 'crypto';

export type EncryptedBlob = {
  iv: string;
  tag: string;
  ciphertext: string;
};

export type Credentials = {
  accounts: { username: string; password: string }[];
};

// 內建解密金鑰（請自行更換為你的金鑰）
const BUILTIN_SECRET = 'Egbf7983';

export const credentialsCipher: EncryptedBlob = {
  iv: 'h8KIZm5ZTB4fmiOh',
  tag: 'zXMn4ei/lGSisjDnm3qxeA==',
  ciphertext: 'ygtGNGAF4Xo7VajiPctJQ9X8M1vUSEbb+rvw4y/rHzjt4m5ct+5CHuTQOd31VM4foKb2F6MhQ74GPErMwweRiqeK6OM4paBbQI3dRCfSERzIgkC2iJ4b19zygYUVg/YdgjvG3zeUdLtOpR7Ay/Z9xN6VE4onAXU0IbUWxvU9VpXjMpCEsax2ApMhoHSJgzhc8boEATF9wAsmat7zXTM3A5JT+elXov7bGf6HKG3/7Io43qxjy6iMmJbfHyY=',
};

function hasPlaceholder(blob: EncryptedBlob): boolean {
  return [blob.iv, blob.tag, blob.ciphertext].some(v => v.startsWith('REPLACE_'));
}

export function decryptCredentials(): Credentials {
  if (hasPlaceholder(credentialsCipher)) throw new Error('尚未設定密文，請先產生並貼入');
  const key = crypto.createHash('sha256').update(BUILTIN_SECRET).digest();
  const iv = Buffer.from(credentialsCipher.iv, 'base64');
  const tag = Buffer.from(credentialsCipher.tag, 'base64');
  const data = Buffer.from(credentialsCipher.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  return JSON.parse(plaintext) as Credentials;
}
