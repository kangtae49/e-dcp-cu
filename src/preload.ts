// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron'
import {ConfigTable, JobEvent, WatchEvent} from "./types";
import * as Electron from "electron";

export interface Api {
  echo(message: string): Promise<string>,
  getResourcePath(): Promise<string>,
  // getResourceSubPath(subpath: string): Promise<string>,

  readDataExcel(subpath: string): Promise<ConfigTable>,
  startDataFile(subpath: string): Promise<void>,
  startScript(jobId: string, subpath: string, args: string[]): Promise<void>,
  stopScript(jobId: string): Promise<void>,
  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void): void,
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void): void,

  // write_file(fullpath: string, content: string): Promise<void>,
  // start_script(job_id: string, subpath: string, args: string[]): Promise<void>,
  // stop_script(job_id: string): Promise<void>,
  // start_data_file(subpath: string): Promise<void>,
  // start_file(filepath: string): Promise<void>,
  // read_data_excel(subpath: string): Promise<string>,
  // re_send_events(): Promise<void>,
  // app_read_file(subpath: string): Promise<string>,
}

const api: Api = {
  echo: (message: string): Promise<string> => {
    return ipcRenderer.invoke('echo', message);
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