import 'reflect-metadata';
import {app, BrowserWindow, protocol} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {
  getIconSubPath,
  registerHandlers,
} from "./api_core";
import {FileWatcher} from "./file_watcher.ts";
import { enableLogging } from "mobx-logger";
import fs from "node:fs";
import {Readable} from "node:stream";
import mime from "mime-types";

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
app.on('ready', async () => {
  // console.log(app.isPackaged)
  // path.dirname()
  // const cur_path = await getCurPath(process.argv, app.isPackaged);

  // installExtensions()
  if (process.env.NODE_ENV === 'development') {
    enableLogging({
      action: true,
      reaction: false,
      transaction: true,
      compute: true,
    });

    protocol.handle('local-resource', async (request: Request): Promise<Response> => {
      try {
        const url = new URL(request.url);
        const normalizedPath = decodeURIComponent(url.pathname);

        // const normalizedPath = path.normalize(
        //   process.platform === 'win32' && decodedPath.startsWith('/')
        //     ? decodedPath.slice(1)
        //     : decodedPath
        // )

        const stats = await fs.promises.stat(normalizedPath);
        const fileSize = stats.size;
        const contentType = mime.lookup(normalizedPath) || 'application/octet-stream';

        const range = request.headers.get('range');

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          if (start >= fileSize || end >= fileSize) {
            return (new Response("Requested range not satisfiable", {
              status: 416,
              headers: { 'Content-Range': `bytes */${fileSize}` }
            })) as Response;
          }

          const chunkSize = (end - start) + 1;
          const nodeStream = fs.createReadStream(normalizedPath, { start, end });
          const webStream = Readable.toWeb(nodeStream) as ReadableStream;

          return (new Response(webStream, {
            status: 206, // Partial Content
            headers: {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize.toString(),
              'Content-Type': contentType,
            }
          })) as Response
        } else {
          const nodeStream = fs.createReadStream(normalizedPath);
          const webStream = Readable.toWeb(nodeStream) as ReadableStream;

          return (new Response(webStream, {
            status: 200,
            headers: {
              'Content-Length': fileSize.toString(),
              'Content-Type': contentType,
              'Accept-Ranges': 'bytes'
            }
          })) as Response
        }
        // return (new Response(webStream, {
        //   status: 200,
        //   headers: { 'Content-Type': contentType }
        // })) as Response
      } catch (error) {
        console.error('Protocol Error:', error);
        return (new Response('File Not Found or Access Denied', { status: 404 })) as Response
      }
    });


  }



  const mainWindow = createWindow()

  const fileWatcher = new FileWatcher(mainWindow, []);

  await registerHandlers(mainWindow, fileWatcher);

  // fileWatcher.startWatching();
  app.on('before-quit', () => {
    // fileWatcher?.stopWatching();
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
