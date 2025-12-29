import {app, BrowserWindow, ipcMain, shell, dialog, type IpcMainEvent} from 'electron'
import path from 'node:path';
import * as XLSX from 'xlsx';
import {SCRIPT_DIR} from "./constants.ts";
import * as fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import {GridData, Env, JobEvent, JobStatus, DragStartItem, DialogResult} from "./types.ts";
import iconv from 'iconv-lite';
// import nativeImage = Electron.nativeImage;


// const START_DRAG_IMG = nativeImage.createFromPath(getIconSubPath('download.png'))
const START_DRAG_IMG = getIconSubPath('download.png')

const runningProcesses: Map<string, ChildProcess> = new Map();

export function getAppResourcePath() {
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
    return path.join(app.getAppPath(), 'src/assets', subpath)
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

export function isLockScriptSubPath(subpath: string) {
  const filePath = path.join(getScriptPath(), subpath);
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const lockFileName = `~$${fileName}`;
  const lockFilePath = path.join(fileDir, lockFileName);
  return fs.existsSync(lockFilePath)
}


export function readDataExcel(subpath: string): GridData | null {
  const filePath = getScriptSubPath(subpath)

  if (!fs.existsSync(filePath)) {
    return null
  }

  if (isLockScriptSubPath(filePath)) {
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
    key: subpath,
    timestamp,
    header,
    data
  }
}

export function startDataFile(subpath: string) {
  shell.openPath(getScriptSubPath(subpath))
}

function dispatchJobEvent(window: BrowserWindow, jobEvent: JobEvent) {
  window.webContents.send('job-event', jobEvent);
}

export function startScript(window: BrowserWindow, jobId: string, subpath: string, args: string[] = []) {
  const scriptsRoot = getScriptPath();

  const pythonExecutable = path.resolve(path.join(scriptsRoot, '.venv', 'Scripts', 'python.exe'));

  const scriptPathAbs = path.resolve(getScriptSubPath(subpath));
  console.log('startScript', jobId, subpath, args)
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

export function getEnv() {
  const myEnv: Env = { ...process.env };
  return myEnv;
}

export function onDragStart(event: IpcMainEvent, item: DragStartItem) {
  try {
    // console.log(filePath, item)
    // const icon = getIconSubPath(item.icon)
    const icon = START_DRAG_IMG
    const file = getScriptSubPath(item.file)
    // const files = item.files ? item.files.map(getScriptSubPath) : []
    console.log(file, icon)
    if (!fs.existsSync(file)) {
      console.error('Not Exists file: ', file);
      return;
    }
    event.sender.startDrag({
      file,
      icon,
    });

    // setImmediate(() => {
    //   if (event.sender.isDestroyed()) return;
    //
    //     event.sender.startDrag({
    //       file,
    //       icon,
    //     });
    // });
  } catch (e) {
    console.error('Native drag failed:', e);
  }
}


export const openSaveDialog = async (subpath: string, defaultName: string): Promise<DialogResult> => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Save',
    defaultPath: defaultName,
    buttonLabel: 'Save',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false, message: 'Cancel' };
  }

  try {
    fs.copyFileSync(getScriptSubPath(subpath), filePath)
    return { success: true, file: filePath, message: 'Success' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export const registerHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.handle('echo', async (_event, message: string) => message);
  ipcMain.handle('get-dirname', () => __dirname);
  ipcMain.handle('get-app-resource-path', () => getAppResourcePath());
  ipcMain.handle('read-data-excel', (_, subpath: string) => readDataExcel(subpath));
  ipcMain.handle('start-data-file', (_, subpath: string) => startDataFile(subpath));
  ipcMain.handle('start-script', async (_event, jobId: string, subpath: string, args: string []) => startScript(mainWindow, jobId, subpath, args))
  ipcMain.handle('stop-script', async (_event, jobId: string) => stopScript(mainWindow, jobId))
  ipcMain.handle('is-lock-script-path', (_event, subpath: string) => isLockScriptSubPath(subpath))
  ipcMain.handle('get-env', () => getEnv())
  ipcMain.handle('open-save-dialog', (_event, subpath: string, defaultName: string) => openSaveDialog(subpath, defaultName))
  ipcMain.on('ondragstart', onDragStart);
}