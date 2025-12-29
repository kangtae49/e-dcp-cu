// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer, webUtils } from 'electron'
import {GridData, DragStartItem, Env, JobEvent, WatchEvent, DialogResult} from "@/types.ts";



export interface Api {
  echo(message: string): Promise<string>,
  getArgs: () => string [],
  getEnv: () => Promise<Env>,
  openSaveDialog: (subpath: string, defaultName: string) => Promise<DialogResult>,
  uploadFile: (sourcePath: string, subpath: string) => Promise<void>,

  getResourcePath(): Promise<string>,
  // getResourceSubPath(subpath: string): Promise<string>,
  getPathForFile(file: File): string
  readDataExcel(subpath: string): Promise<GridData | null>,
  startDataFile(subpath: string): Promise<void>,
  startScript(jobId: string, subpath: string, args: string[]): Promise<void>,
  stopScript(jobId: string): Promise<void>,
  isLockScriptSubPath(subpath: string): Promise<boolean>,
  startDrag(item: DragStartItem): void,
  // startDrag(filePath: string): void,

  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void): void,
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void): void,
}

const api: Api = {
  echo: (message: string): Promise<string> => {
    return ipcRenderer.invoke('echo', message);
  },
  getArgs: () => process.argv,
  getEnv: () => {
    return ipcRenderer.invoke('get-env');
  },
  openSaveDialog: (subpath: string, defaultName: string): Promise<DialogResult> => {
    return ipcRenderer.invoke('open-save-dialog', subpath, defaultName);
  },
  uploadFile: (sourcePath, subpath): Promise<void> => {
    return ipcRenderer.invoke('upload-file', sourcePath, subpath);
  },
  getResourcePath: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-resource-path');
  },
  readDataExcel(subpath: string): Promise<GridData | null> {
    return ipcRenderer.invoke('read-data-excel', subpath);
  },
  startDataFile(subpath: string) {
    return ipcRenderer.invoke('start-data-file', subpath);
  },
  startScript(jobId: string, subpath: string, args: string[]) {
    return ipcRenderer.invoke('start-script', jobId, subpath, args)
  },
  stopScript(jobId: string) {
    return ipcRenderer.invoke('stop-script', jobId)
  },
  isLockScriptSubPath(subpath) {
    return ipcRenderer.invoke("is-lock-script-path", subpath);
  },
  startDrag(item: DragStartItem) {
    ipcRenderer.send('ondragstart', item)
  },
  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void) {
    ipcRenderer.removeAllListeners('job-event');
    ipcRenderer.on('job-event', callback)
  },
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void) {
    ipcRenderer.removeAllListeners('watch-event');
    ipcRenderer.on('watch-event', callback)
  },
  getPathForFile(file: File) {
    return webUtils.getPathForFile(file)
  },

}

contextBridge.exposeInMainWorld('api', api);