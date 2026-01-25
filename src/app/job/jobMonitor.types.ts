import {JobMonitorStore} from "@/app/job/jobMonitor.store.ts";

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
  action: JobAction
  data: JobData
  timestamp: number
  pid?: number
}

export type JobMonitorFactory = (id: string) => JobMonitorStore;

export type JobStatus = 'RUNNING' | 'DONE' | 'STOPPED';

export type StreamType = 'STDOUT' | 'STDERR';

export type JobAction = 'JOB_STREAM' | 'JOB_STATUS' | 'JOB_ERROR'
