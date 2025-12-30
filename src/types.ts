export type Action = 'JOB_STREAM' | 'JOB_STATUS' | 'JOB_ERROR' | 'WATCH_FILE'

// Job
export type JobStatus = 'RUNNING' | 'DONE' | 'STOPPED';

export type StreamType = 'STDOUT' | 'STDERR';


export type JobData = JobStreamData | JobStatusData | JobErrorData

export interface JobStreamData {
  message: string,
  messageType: StreamType
}

export interface JobStatusData {
  status: JobStatus
}

export interface JobErrorData {
  message: string
}

export interface JobEvent {
  jobId: string
  action: Action
  data: JobData
  timestamp: number
  pid?: number
}

// Watch file
export type WatchStatus = 'CREATED' | 'MODIFIED' | 'DELETED';

export interface WatchFileData {
  status: WatchStatus
  path: string
  key: string
  mtime: number
}

export interface WatchEvent {
  action: Action
  data: WatchFileData
}


export interface GridData {
  key: string,
  timestamp?: number,
  isLocked?: boolean,
  header: string [],
  data: Record<string, string | number | boolean | null> []
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