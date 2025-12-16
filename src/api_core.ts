import {app, BrowserWindow, shell} from 'electron'
import path from 'node:path';
import * as XLSX from 'xlsx';
import {SCRIPT_DIR} from "./constants";
import * as fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import {ConfigTable, JobData, JobEvent, JobStatus} from "./types";
const runningProcesses: Map<string, ChildProcess> = new Map();

export function getAppResourcePath() {
  if (app.isPackaged) {
    // app.getAppPath(): C:\Users\kkt\AppData\Local\e_dcp_cu\app-1.0.0\resources\app.asar
    return path.dirname(app.getAppPath())
  } else {
    return app.getAppPath()
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


export function readDataExcel(subpath: string): ConfigTable {
  const fileBuffer = fs.readFileSync(getScriptSubPath(subpath));
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

  if (!fs.existsSync(pythonExecutable) || !fs.existsSync(scriptPathAbs)) {
    console.log('startScript not fount script')
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      data: {message: 'not found script'},
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

  runningProcesses.set(jobId, child);
  dispatchJobEvent(window, {
    action: 'JOB_STATUS',
    jobId,
    data: {status: 'RUNNING'},
    timestamp: Date.now()
  });

  child.stdout.on('data', (data) => {
    console.log(data.toString());
    dispatchJobEvent(window, {
      action: 'JOB_STREAM',
      jobId,
      data: {message: data.toString(), messageType: 'STDOUT'},
      timestamp: Date.now()
    });
  });

  child.stderr.on('data', (data) => {
    console.log(data.toString());
    dispatchJobEvent(window, {
      action: 'JOB_STREAM',
      jobId,
      data: {message: data.toString(), messageType: 'STDERR'},
      timestamp: Date.now()
    });
  });

  child.on('close', (code) => {
    runningProcesses.delete(jobId);

    const status: JobStatus = code === 0 ? 'DONE' : 'DONE';

    dispatchJobEvent(window, {
      action: 'JOB_STATUS',
      jobId,
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
      data: {status: 'STOPPED'},
      timestamp: Date.now()
    });
    runningProcesses.delete(jobId);

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    dispatchJobEvent(window, {
      action: 'JOB_ERROR',
      jobId,
      data: {message},
      timestamp: Date.now()
    });
  }
}