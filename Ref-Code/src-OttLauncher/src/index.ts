import { app, BrowserWindow, ipcMain } from 'electron';
import { existsSync, readFileSync } from 'fs';
// import { spawn } from 'child_process';
import squirrelStartup from 'electron-squirrel-startup';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (squirrelStartup) {
  app.quit();
}

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

const ensureChromeProfileReady = async (): Promise<void> => {
  const chromePath = getChromePath();
  const userProfilePath = process.env.USER_DATA_Profile ?? '';

  const chromeExists = chromePath ? existsSync(chromePath) : false;
  const profileExists = userProfilePath ? existsSync(userProfilePath) : false;

  if (chromeExists && profileExists) {
    return;
  }

  // const rarPath = process.env.RAR_PATH;
  // const compressPass = process.env.compress_Pass;
  // const userDataSrc = process.env.USER_DATA_Src;
  // const userDataDir = process.env.USER_DATA_DIR;

  // if (!compressPass || !userDataSrc || !userDataDir) {
  //   console.error('Missing env for WinRAR restore: RAR_PATH, compress_Pass, USER_DATA_Src, USER_DATA_DIR');
  //   return;
  // }

  // Restore user data archive when Chrome executable or profile is missing.
  // await new Promise<void>((resolve, reject) => {
  //   const rar = spawn(
  //     rarPath,
  //     ['x', `-hp${compressPass}`, '-o+', userDataSrc, userDataDir],
  //     { stdio: 'inherit' },
  //   );

  //   rar.on('error', reject);
  //   rar.on('exit', code => {
  //     if (code === 0) {
  //       resolve();
  //     } else {
  //       reject(new Error(`WinRAR exited with code ${code ?? -1}`));
  //     }
  //   });
  // });
};

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 1200,
    resizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

ipcMain.handle('netflix:login', async () => {
  try {
    // 動態載入模組，避免打包時被 Webpack 處理
    const { runNetflixAutoLogin } = await import('./lib/Netflix-AutoLogin');
    return await runNetflixAutoLogin();
  } catch (error) {
    console.error('Netflix login failed', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('disney:launch', async () => {
  try {
    const { launchDisneyPlus } = await import('./lib/Disney-Launch');
    return await launchDisneyPlus();
  } catch (error) {
    console.error('Disney launch failed', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
  }
});

app.whenReady()
  .then(async () => {
    try {
      await ensureChromeProfileReady();
    } catch (error) {
      console.error('Failed to ensure Chrome profile is ready:', error);
    }

    createWindow();
  })
  .catch(error => {
    console.error('App failed to start:', error);
    app.quit();
  });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
