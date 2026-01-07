import {JobAction, JobStatus, StreamType} from "@/app/job/jobMonitor.constants.ts";
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

export const JOB_MONITOR_TYPES = {
  JobMonitorService: Symbol("JobMonitorService"),
  JobMonitorStore: Symbol("JobMonitorStore"),
  JobMonitorFactory: Symbol("JobMonitorFactory"),
}