import { spawn } from 'child_process';
import { readFileSync } from 'fs';
// import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export type LaunchResult = {
  status: 'success' | 'error';
  message: string;
  pid?: number;
};

/**
 * 使用 Chrome 啟動 Disney+ 網頁
 * 使用 --app 參數以應用程式模式開啟
 */
const getChromePath = (): string => {
  try {
    const clientVhdxFile = 'd:\\ClientVHDXDriverLetter.json';
    const data = readFileSync(clientVhdxFile, 'utf-8');
    const { driveLetter } = JSON.parse(data) as { driveLetter: string };
    return `${driveLetter}:\\Chrome\\Chrome.exe`;
  } catch (error) {
    console.error('Failed to read ClientVHDXDriverLetter.json:', error);
    return '';
  }
};

export async function launchDisneyPlus(): Promise<LaunchResult> {
  try {
    const chromePath = getChromePath();
    const disneyUrl = process.env.Disney_URL || 'https://www.disneyplus.com';
    const userDataDir = process.env.USER_DATA_DIR;

    if (!chromePath) {
      return {
        status: 'error',
        message: 'Chrome 路徑未設置 (ClientVHDXDriverLetter.json)',
      };
    }

    // 使用 --app 參數以應用程式模式啟動
    const args = [`--app=${disneyUrl}`];

    // 如果設置了 USER_DATA_DIR，加入參數
    if (userDataDir) {
      args.push(`--user-data-dir=${userDataDir}`);
    }

    const chrome = spawn(chromePath, args, {
      detached: true,
      stdio: 'ignore',
    });

    const pid = chrome.pid;

    // 允許父進程獨立退出
    chrome.unref();

    console.log(`Disney+ 已啟動 (PID: ${pid})`);

    return {
      status: 'success',
      message: `應用程式模式啟動 Disney+`,
      pid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('啟動 Disney+ 失敗:', errorMessage);
    return {
      status: 'error',
      message: `啟動失敗: ${errorMessage}`,
    };
  }
}
