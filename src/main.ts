import 'reflect-metadata';
import { app, BrowserWindow  } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {
  getIconSubPath,
  getScriptPath,
  registerHandlers,
} from "./api_core";
import {FileWatcher} from "./file_watcher.ts";


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

console.log('__dirname:', __dirname)
// DEV: C:\sources\e-dcp-cu\.vite\build
// PACKAGE:

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    // icon: path.join(__dirname, 'assets/icon.ico'),
    icon: getIconSubPath('assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: process.argv,
      // sandbox: false,
      // contextIsolation: false,
      // nodeIntegration: true
    },
    titleBarStyle: 'hidden',
    // transparent: true,
    // titleBarOverlay: {
    //   color: '#2e2e2e',
    //   symbolColor: '#74b1be',
    //   height: 32
    // }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  return mainWindow;
};

// const installExtensions = async () => {
//   if (process.env.NODE_ENV === 'development') {
//     const { default: installExtension, MOBX_DEVTOOLS } = await import('electron-devtools-installer');
//
//     try {
//       const extension = await installExtension(MOBX_DEVTOOLS);
//       console.log(`Added Extension: ${extension.name}`);
//     } catch (err) {
//       console.error('An error occurred: ', err);
//     }
//
//
//   }
// };

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // console.log(app.isPackaged)
  // path.dirname()
  // const cur_path = await getCurPath(process.argv, app.isPackaged);

  // installExtensions()


  const mainWindow = createWindow()
  registerHandlers(mainWindow);

  const watchPath = getScriptPath();
  const watcher = new FileWatcher(mainWindow, watchPath);
  watcher.startWatching();

  app.on('before-quit', () => {
    watcher?.stopWatching();
  });

});




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
