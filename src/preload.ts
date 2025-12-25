// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer, webUtils } from 'electron'
import {ConfigTable, DragStartItem, Env, JobEvent, WatchEvent} from "@/types.ts";
import * as Electron from "electron";



export interface Api {
  echo(message: string): Promise<string>,
  getArgs: () => string [],
  getEnv: () => Promise<Env>,

  getResourcePath(): Promise<string>,
  // getResourceSubPath(subpath: string): Promise<string>,
  getPathForFile(file: File): string
  readDataExcel(subpath: string): Promise<ConfigTable>,
  startDataFile(subpath: string): Promise<void>,
  startScript(jobId: string, subpath: string, args: string[]): Promise<void>,
  stopScript(jobId: string): Promise<void>,

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
  startDrag(item: DragStartItem) {
    ipcRenderer.send('ondragstart', item)
  },
  // startDrag(filePath: string) {
  //   ipcRenderer.send('ondragstart', filePath)
  // },

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