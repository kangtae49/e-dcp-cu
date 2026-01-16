import {
  app, BrowserWindow, powerMonitor, ipcMain, shell, dialog,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
} from 'electron'
import path from 'node:path';
import * as XLSX from 'xlsx';
import {SCRIPT_DIR} from "./constants.ts";
import * as fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import {Env, DragStartItem, DialogResult, Versions, AppInfo} from "./types.ts";
import iconv from 'iconv-lite';
import * as os from "node:os";
import {GridData} from "@/app/grid-data/gridData.types.ts";
import {JobEvent} from "@/app/job/jobMonitor.types.ts";
import {JobStatus} from "@/app/job/jobMonitor.constants.ts";
import {ExcalidrawData} from "@/app/excalidraw-data/excalidrawData.types.ts";
import {ExcalidrawState} from "@/app/excalidraw/excalidraw.types.ts";
import {FileWatcher} from "@/file_watcher.ts";
// import nativeImage = Electron.nativeImage;


// const START_DRAG_IMG = nativeImage.createFromPath(getIconSubPath('download.png'))
const START_DRAG_IMG = getIconSubPath('assets/download.png')

const runningProcesses: Map<string, ChildProcess> = new Map();


export function handleEcho(_event: IpcMainInvokeEvent, message: string) {
    return message;
}
export function handleSetFullScreen(window: BrowserWindow, flag: boolean) {
  console.log('handleSetFullScreen', flag)
  window.setFullScreen(flag)
}

export function handleIsFullScreen(window: BrowserWindow) {
  return window.isFullScreen()
}
export function handleIsMaximized(window: BrowserWindow) {
  return window.isMaximized()
}

export function handleExistsFile(_event: IpcMainInvokeEvent, filePath: string) {
  return fs.existsSync(filePath)
}

export function getVersions(): Versions {
  return {
    app: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8,
    osType: os.type(),
    osArch: os.arch(),
    osRelease: os.release(),
  };
}


export function handleReadExcel(_event: IpcMainInvokeEvent, filePath: string) {
  return readExcel(filePath);
}


export function handleReadExcalidraw(_event: IpcMainInvokeEvent, filePath: string) {
  return readExcalidraw(filePath);
}

export function handleStartFile(_event: IpcMainInvokeEvent, filePath: string) {
  startFile(filePath);
}

export function handleIsLockScriptPath(_event: IpcMainInvokeEvent, filePath: string) {
  return isLockScriptPath(filePath);
}

export function handleGetEnv() {
  const myEnv: Env = { ...process.env };
  return myEnv;
}

export function handleOpenSaveDialog(_event: IpcMainInvokeEvent, filePath: string, defaultName: string) {
  return openSaveDialog(filePath, defaultName);
}

export function handleUploadFile(_event: IpcMainInvokeEvent, sourcePath: string, targetPath: string) {
  return uploadFile(sourcePath, targetPath);
}
export function handleStartWatching(fileWatcher: FileWatcher) {
  fileWatcher.startWatching();
}
export function handleStopWatching(fileWatcher: FileWatcher) {
  fileWatcher.stopWatching();
}

export function handleAddWatchPath(fileWatcher: FileWatcher, watchPath: string[]) {
  fileWatcher.add(watchPath);
}
export function handleUnWatchPath(fileWatcher: FileWatcher, watchPath: string[]) {
  fileWatcher.unwatch(watchPath);
}



function readExcel(filePath: string): GridData | null {

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileStats = fs.statSync(filePath);
  const timestamp = fileStats.mtime.getTime();

  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]]

  const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
    header: 1,
    raw: true,
    defval: null
  });

  const [headerRow, ...dataRows] = rows;
  const header = (headerRow as string[]) || [];
  const data = dataRows.map((row) => {
    const obj: Record<string, string | number | boolean | null> = {};
    header.forEach((key, index) => {
      obj[key] = row[index] ?? null;
    });
    return obj;
  });

  // const data = XLSX.utils.sheet_to_json(sheet, {
  //   raw: true,
  //   defval: null,
  // }) as Record<string, string | number | boolean | null> [];

  return {
    path: filePath,
    timestamp,
    header,
    data
  }
}


function readExcalidraw(filePath: string): ExcalidrawData | null {
  if (!fs.existsSync(filePath)) {
    return null
  }

  // if (isLockScriptPath(filePath)) {
  //   return null
  // }

  const fileBuffer = fs.readFileSync(filePath);
  const fileStats = fs.statSync(filePath);
  const timestamp = fileStats.mtime.getTime();

  const excalidrawState = JSON.parse(fileBuffer.toString()) as ExcalidrawState;

  return {
    path: filePath,
    timestamp,
    data: excalidrawState
  }
}

function getAppResourcePath() {
  if (app.isPackaged) {
    // app.getAppPath(): C:\Users\kkt\AppData\Local\e_dcp_cu\app-1.0.0\resources\app.asar
    return path.dirname(app.getAppPath())
  } else {
    return app.getAppPath()
  }
}

export function getIconSubPath(subpath: string) {
  if (app.isPackaged) {
    // app.getAppPath(): C:\Users\kkt\AppData\Local\e_dcp_cu\app-1.0.0\resources\app.asar
    return path.join(path.dirname(app.getAppPath()), subpath)
  } else {
    return path.join(app.getAppPath(), 'src', subpath)
  }

}

export function getResourceSubPath(subpath: string) {
  return path.join(getAppResourcePath(), subpath)
}

export function getScriptPath() {
  return path.join(getResourceSubPath(SCRIPT_DIR))
}

export function getScriptSubPath(subpath: string) {
  return path.join(getScriptPath(), subpath)
}

function isLockScriptPath(filePath: string) {
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const lockFileName = `~$${fileName}`;
  const lockFilePath = path.join(fileDir, lockFileName);
  return fs.existsSync(lockFilePath)
}




function startFile(filePath: string) {
  shell.openPath(filePath)
}

function dispatchJobEvent(window: BrowserWindow, jobEvent: JobEvent) {
  window.webContents.send('on-job-event', jobEvent);
}

export function startScript(window: BrowserWindow, jobId: string, filePath: string, args: string[] = []) {
  const scriptsRoot = getScriptPath();

  const pythonExecutable = path.resolve(path.join(scriptsRoot, '.venv', 'Scripts', 'python.exe'));

  const scriptPathAbs = path.resolve(filePath);
  console.log('startScript', jobId, filePath, args)
  console.log(scriptsRoot, pythonExecutable, scriptPathAbs)

  try{

    fs.accessSync(pythonExecutable, fs.constants.X_OK)
    fs.accessSync(scriptPathAbs, fs.constants.R_OK);
  } catch (err) {
    console.log('startScript not fount script')
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      data: {message: err.toString()},
      timestamp: Date.now()
    });
    return;
  }

  console.log('startScript spawn')

  const child = spawn(
    pythonExecutable,
    [scriptPathAbs, ...args],
    {
      cwd: scriptsRoot,
      shell: false,
    }
  );
  const pid = child.pid;

  runningProcesses.set(jobId, child);
  dispatchJobEvent(window, {
    action: 'JOB_STATUS',
    jobId,
    pid,
    data: {status: 'RUNNING'},
    timestamp: Date.now()
  });

  child.stdout.on('data', (data) => {
    // console.log(data.toString());
    const decodedMessage = iconv.decode(data, 'euc-kr');
    process.stdout.write(data)
    dispatchJobEvent(window, {
      action: 'JOB_STREAM',
      jobId,
      pid,
      data: {message: decodedMessage, messageType: 'STDOUT'},
      timestamp: Date.now()
    });
  });

  child.stderr.on('data', (data) => {
    const decodedMessage = iconv.decode(data, 'euc-kr');
    // console.log(data.toString());
    process.stderr.write(data)
    dispatchJobEvent(window, {
      action: 'JOB_STREAM',
      jobId,
      pid,
      data: {message: decodedMessage, messageType: 'STDERR'},
      timestamp: Date.now()
    });
  });

  child.on('close', (code) => {
    runningProcesses.delete(jobId);

    const status: JobStatus = code === 0 ? 'DONE' : 'DONE';

    dispatchJobEvent(window, {
      action: 'JOB_STATUS',
      jobId,
      pid,
      data: {status},
      timestamp: Date.now()
    });
    console.log(`Process exit. Job ID: ${jobId}, Exit Code: ${code}`);
  });

  child.on('error', (err) => {
    runningProcesses.delete(jobId);
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      pid,
      data: {message: `Process Execution err: ${err.message}` },
      timestamp: Date.now()
    });
  });
}


export function stopScript(window: BrowserWindow, jobId: string) {
  const p = runningProcesses.get(jobId);

  if (!p) {
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      data: {message: "not found process" },
      timestamp: Date.now()
    });
    return;
  }
  const pid = p.pid;
  try {
    p.kill('SIGTERM');

    setTimeout(() => {
      if (!p.killed) {
        p.kill('SIGKILL');
      }
    }, 1000);
    dispatchJobEvent(window, {
      action: 'JOB_STATUS',
      jobId,
      pid,
      data: {status: 'STOPPED'},
      timestamp: Date.now()
    });
    runningProcesses.delete(jobId);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      pid,
      data: {message},
      timestamp: Date.now()
    });
  }
}



export function onDragStart(event: IpcMainEvent, item: DragStartItem) {
  try {
    const icon = START_DRAG_IMG
    const file = item.file
    console.log(file, icon)
    if (!fs.existsSync(file)) {
      console.error('Not Exists file: ', file);
      return;
    }
    event.sender.startDrag({
      file,
      icon,
    });

  } catch (e) {
    console.error('Native drag failed:', e);
  }
}

const onWindowMinimize = (window: BrowserWindow) => {
  window.minimize()
}
const onWindowMaximize = (window: BrowserWindow) => {
  window.maximize();
}

const onWindowUnMaximize = (window: BrowserWindow) => {
  window.unmaximize();
}


const onWindowClose = (window: BrowserWindow) => {
  window.close()
}


const openSaveDialog = async (filePath: string, defaultName: string): Promise<DialogResult> => {
  const { filePath: savePath, canceled } = await dialog.showSaveDialog({
    title: 'Save',
    defaultPath: defaultName,
    buttonLabel: 'Save',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !savePath) {
    return { success: false, message: 'Cancel' };
  }

  try {
    fs.copyFileSync(filePath, savePath)
    return { success: true, file: savePath, message: 'Success' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function uploadFile (sourcePath: string, targetPath: string) {
  if (!fs.existsSync(sourcePath)) {
    return
  }
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath)
  }
  fs.copyFileSync(sourcePath, targetPath)
}

export const getAppInfo = async (): Promise<AppInfo> => {
  return {
    versions: getVersions(),
    resourcePath: getAppResourcePath(),
    scriptPath: getScriptPath(),
  }
}

export const registerHandlers = async (mainWindow: BrowserWindow, fileWatcher: FileWatcher) => {
  ipcMain.handle('get-app-info', async (_event) => await getAppInfo())
  ipcMain.handle('echo', handleEcho);
  ipcMain.handle('set-full-screen', (_event, flag) => handleSetFullScreen(mainWindow, flag))
  ipcMain.handle('is-full-screen', (_event) => handleIsFullScreen(mainWindow))
  ipcMain.handle('is-maximized', (_event) => handleIsMaximized(mainWindow))
  ipcMain.handle('read-excel', handleReadExcel);
  ipcMain.handle('read-excalidraw', handleReadExcalidraw);
  ipcMain.handle('start-file', handleStartFile);
  ipcMain.handle('exists-file', handleExistsFile);
  ipcMain.handle('start-script', async (_event, jobId: string, filePath: string, args: string []) => startScript(mainWindow, jobId, filePath, args))
  ipcMain.handle('stop-script', async (_event, jobId: string) => stopScript(mainWindow, jobId))
  ipcMain.handle('is-lock-script-path', handleIsLockScriptPath)
  ipcMain.handle('get-env', handleGetEnv)
  ipcMain.handle('open-save-dialog', handleOpenSaveDialog)
  ipcMain.handle('upload-file', handleUploadFile)
  ipcMain.handle('start-watching', (_event) => handleStartWatching(fileWatcher))
  ipcMain.handle('stop-watching', (_event) => handleStopWatching(fileWatcher))
  ipcMain.handle('add-watch-path', (_event, watchPath: string[]) => handleAddWatchPath(fileWatcher, watchPath))
  ipcMain.handle('un-watch-path', (_event, watchPath: string[]) => handleUnWatchPath(fileWatcher, watchPath))

  ipcMain.on('ondragstart', onDragStart);
  ipcMain.on('window-minimize', () => onWindowMinimize(mainWindow))
  ipcMain.on('window-maximize', () => onWindowMaximize(mainWindow))
  ipcMain.on('window-unmaximize', () => onWindowUnMaximize(mainWindow))
  ipcMain.on('window-close', () => onWindowClose(mainWindow))

  powerMonitor.on('suspend', () => mainWindow.webContents.send('on-suspend'))
  mainWindow.on('enter-full-screen', () => mainWindow.webContents.send('on-change-full-screen', true))
  mainWindow.on('leave-full-screen', () => mainWindow.webContents.send('on-change-full-screen', false))
  mainWindow.on('maximize', () => mainWindow.webContents.send('on-change-maximize', true))
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('on-change-maximize', false))
}
