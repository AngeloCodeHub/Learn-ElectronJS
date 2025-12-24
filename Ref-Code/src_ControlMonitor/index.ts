import { app, BrowserWindow, globalShortcut } from 'electron';
import { exec } from 'child_process';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 300,
    width: 450,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });
  // 固定視窗長與寬
  mainWindow.setResizable(false);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on('ready', createWindow);

app.whenReady().then(() => {
  const GamePress = 17
  const KTVPress = 18

  const F5Press = globalShortcut.register('F5', () => {
    // console.log('F5 is pressed')
    // 執行外部程式ControlMyMonitor.exe
    exec(`ControlMyMonitor.exe /SetValue Primary 60 ${GamePress}`, (err: any, stdout: any, stderr: any) => {

      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
    )

  })
  const F6Press = globalShortcut.register('F6', () => {
    // console.log('F6 is pressed')
    exec(`ControlMyMonitor.exe /SetValue Primary 60 ${KTVPress}`, (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
    )
  })
  // if (!ret) {
  //   console.log('registration failed')
  // }

  // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('F5'))
})

app.on('will-quit', () => {
  // globalShortcut.unregister('F5')
  // globalShortcut.unregister('F6')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
