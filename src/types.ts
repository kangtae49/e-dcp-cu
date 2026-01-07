
export type WatchAction = 'WATCH_FILE'


// Watch file
export type WatchStatus = 'CREATED' | 'MODIFIED' | 'DELETED';

export interface WatchFileData {
  status: WatchStatus
  path: string
  key: string
  mtime: number
}

export interface WatchEvent {
  action: WatchAction
  data: WatchFileData
}




export interface Env {
  [key: string]: string | undefined;
}

export interface DragStartItem {
  file: string
}

export interface DialogResult {
  success: boolean,
  file?: string
  message: string
}

export interface FileItem {
  files: File[];
}

export interface Versions {
  app: string,
  electron: string,
  chrome: string,
  node: string,
  v8: string,
  osType: string,
  osArch: string,
  osRelease: string,
}