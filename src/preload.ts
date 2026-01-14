// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "reflect-metadata";
import {contextBridge, ipcRenderer, webUtils } from 'electron'
import {DragStartItem, Env, WatchEvent, DialogResult, Versions} from "@/types.ts";
import {GridData} from "@/app/grid-data/gridData.types.ts";
import {JobEvent} from "@/app/job/jobMonitor.types.ts";
import * as Electron from "electron";
import {ExcalidrawData} from "@/app/excalidraw-data/excalidrawData.types.ts";



export interface Api {
  echo(message: string): Promise<string>
  setFullScreen(flag: boolean): Promise<void>
  isFullScreen(): Promise<boolean>
  isMaximized(): Promise<boolean>
  getVersions: () => Promise<Versions>
  getArgs: () => string []
  getEnv: () => Promise<Env>
  openSaveDialog: (subpath: string, defaultName: string) => Promise<DialogResult>
  uploadFile: (sourcePath: string, subpath: string) => Promise<void>

  getResourcePath(): Promise<string>
  // getResourceSubPath(subpath: string): Promise<string>
  getPathForFile(file: File): string
  readDataExcel(subpath: string): Promise<GridData | null>
  readDataExcalidraw(subpath: string): Promise<ExcalidrawData | null>
  startDataFile(subpath: string): Promise<void>
  startScript(jobId: string, subpath: string, args: string[]): Promise<void>
  stopScript(jobId: string): Promise<void>
  isLockScriptSubPath(subpath: string): Promise<boolean>
  startDrag(item: DragStartItem): void
  minimize(): void
  maximize(): void
  unmaximize(): void
  close(): void
  // startDrag(filePath: string): void

  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void): void
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void): void

  onSuspend(callback: (event: Electron.IpcRendererEvent) => void): void
  onChangeFullScreen(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void): () => void
  onChangeMaximize(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void): () => void
}

const api: Api = {
  echo: (message: string): Promise<string> => {
    return ipcRenderer.invoke('echo', message);
  },
  setFullScreen(flag: boolean): Promise<void> {
    return ipcRenderer.invoke('set-full-screen', flag)
  },
  isFullScreen(): Promise<boolean> {
    return ipcRenderer.invoke('is-full-screen')
  },
  isMaximized(): Promise<boolean> {
    return ipcRenderer.invoke('is-maximized')
  },
  getVersions: (): Promise<Versions> => {
    return ipcRenderer.invoke('get-versions')
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
  readDataExcalidraw(subpath: string): Promise<ExcalidrawData | null> {
    return ipcRenderer.invoke('read-data-excalidraw', subpath);
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
  getPathForFile(file: File) {
    return webUtils.getPathForFile(file)
  },
  startDrag(item: DragStartItem) {
    ipcRenderer.send('ondragstart', item)
  },
  minimize() {
    ipcRenderer.send('window-minimize')
  },
  maximize() {
    ipcRenderer.send('window-maximize')
  },
  unmaximize() {
    ipcRenderer.send('window-unmaximize')
  },
  close() {
    ipcRenderer.send('window-close')
  },
  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void) {
    ipcRenderer.removeAllListeners('on-job-event');
    ipcRenderer.on('on-job-event', callback)
  },
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void) {
    ipcRenderer.removeAllListeners('on-watch-event');
    ipcRenderer.on('on-watch-event', callback)
  },
  onSuspend(callback: (event: Electron.IpcRendererEvent) => void) {
    console.log("onSuspend")
    ipcRenderer.removeAllListeners('on-suspend');
    ipcRenderer.on('on-suspend', callback)
  },
  onChangeFullScreen(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void) {
    ipcRenderer.on('on-change-full-screen', callback)
    return () => {
      ipcRenderer.removeListener('on-change-full-screen', callback);
    }
  },
  onChangeMaximize(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void) {
    // ipcRenderer.removeAllListeners('on-change-maximize');
    ipcRenderer.on('on-change-maximize', callback)
    return () => {
      ipcRenderer.removeListener('on-change-maximize', callback);
    }
  }

}

contextBridge.exposeInMainWorld('api', api);