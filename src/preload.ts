// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "reflect-metadata";
import {contextBridge, ipcRenderer, webUtils } from 'electron'
import {DragStartItem, Env, WatchEvent, DialogResult, AppInfo} from "@/types.ts";
import {GridData} from "@/app/grid-data/gridData.types.ts";
import {JobEvent} from "@/app/job/jobMonitor.types.ts";
import * as Electron from "electron";
import {ExcalidrawData} from "@/app/excalidraw-data/excalidrawData.types.ts";



export interface Api {
  appInfo: AppInfo
  getArgs: () => string []
  echo(message: string): Promise<string>
  setFullScreen(flag: boolean): Promise<void>
  isFullScreen(): Promise<boolean>
  isMaximized(): Promise<boolean>
  // getVersions: () => Promise<Versions>
  getEnv: () => Promise<Env>
  openSaveDialog: (subpath: string, defaultName: string) => Promise<DialogResult>
  uploadFile: (sourcePath: string, subpath: string) => Promise<void>
  existsFile: (filePath: string) => Promise<boolean>
  startWatching: () => Promise<void>
  stopWatching: () => Promise<void>
  addWatchPath: (watchPath: string[]) => Promise<void>
  unWatchPath: (watchPath: string[]) => Promise<void>

  getPathForFile(file: File): string
  readExcel(filePath: string): Promise<GridData | null>
  readExcalidraw(filePath: string): Promise<ExcalidrawData | null>
  startFile(filePath: string): Promise<void>
  startScript(jobId: string, filePath: string, args: string[]): Promise<void>
  stopScript(jobId: string): Promise<void>
  isLockScriptSubPath(subpath: string): Promise<boolean>
  startDrag(item: DragStartItem): void
  minimize(): void
  maximize(): void
  unmaximize(): void
  close(): void

  onJobEvent(callback: (event: Electron.IpcRendererEvent, data: JobEvent) => void): void
  onWatchEvent(callback: (event: Electron.IpcRendererEvent, data: WatchEvent) => void): void

  onSuspend(callback: (event: Electron.IpcRendererEvent) => void): void
  onChangeFullScreen(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void): () => void
  onChangeMaximize(callback: (event: Electron.IpcRendererEvent, flag: boolean) => void): () => void
}

const getApi = async (): Promise<Api> => {
  return {
    appInfo: await ipcRenderer.invoke('get-app-info'),
    getArgs: () => process.argv,
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
    // getVersions: (): Promise<Versions> => {
    //   return ipcRenderer.invoke('get-versions')
    // },
    getEnv: () => {
      return ipcRenderer.invoke('get-env');
    },
    openSaveDialog: (subpath: string, defaultName: string): Promise<DialogResult> => {
      return ipcRenderer.invoke('open-save-dialog', subpath, defaultName);
    },
    uploadFile: (sourcePath, subpath): Promise<void> => {
      return ipcRenderer.invoke('upload-file', sourcePath, subpath);
    },
    existsFile: (filePath): Promise<boolean> => {
      return ipcRenderer.invoke('exists-file', filePath)
    },
    startWatching: (): Promise<void> => {
      return ipcRenderer.invoke('start-watching')
    },
    stopWatching: (): Promise<void> => {
      return ipcRenderer.invoke('stop-watching')
    },
    addWatchPath: (watchPath): Promise<void> => {
      return ipcRenderer.invoke('add-watch-path', watchPath)
    },
    unWatchPath: (watchPath): Promise<void> => {
      return ipcRenderer.invoke('un-watch-path', watchPath)
    },
    readExcel(filePath: string): Promise<GridData | null> {
      return ipcRenderer.invoke('read-excel', filePath);
    },
    readExcalidraw(filePath: string): Promise<ExcalidrawData | null> {
      return ipcRenderer.invoke('read-excalidraw', filePath);
    },
    startFile(filePath: string) {
      return ipcRenderer.invoke('start-file', filePath);
    },
    startScript(jobId: string, filePath: string, args: string[]) {
      return ipcRenderer.invoke('start-script', jobId, filePath, args)
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
}

getApi().then((api) => {
  contextBridge.exposeInMainWorld('api', api);
});
