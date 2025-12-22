// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron'
import {ConfigTable, Env, JobEvent, WatchEvent} from "@/types.ts";
import * as Electron from "electron";



export interface Api {
  echo(message: string): Promise<string>,
  getArgs: () => string [],
  getEnv: () => Promise<Env>,

  getResourcePath(): Promise<string>,
  // getResourceSubPath(subpath: string): Promise<string>,

  readDataExcel(subpath: string): Promise<ConfigTable>,
  startDataFile(subpath: string): Promise<void>,
  startScript(jobId: string, subpath: string, args: string[]): Promise<void>,
  stopScript(jobId: string): Promise<void>,
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
  getResourcePath: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-resource-path');
  },
  readDataExcel(subpath: string): Promise<ConfigTable> {
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
  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void) {
    ipcRenderer.removeAllListeners('job-event');
    ipcRenderer.on('job-event', callback)
  },
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void) {
    ipcRenderer.removeAllListeners('watch-event');
    ipcRenderer.on('watch-event', callback)
  },
}

contextBridge.exposeInMainWorld('api', api);