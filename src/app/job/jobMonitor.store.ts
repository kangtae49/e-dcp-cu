import {inject, injectable} from "inversify";
import {makeAutoObservable} from "mobx";
import {JobStatus} from "@/app/job/jobMonitor.constants.ts";
import {JOB_MONITOR_TYPES, JobEvent} from "@/app/job/jobMonitor.types.ts";
import {JobMonitorService} from "@/app/job/jobMonitor.service.ts";

export interface JobMonitorSetStatus {
  jobId: string,
  status: JobStatus
}

export interface JobMonitorAddEvent {
  jobId: string,
  event: JobEvent
}
export interface JobMonitorClearEvent {
  jobId: string,
}

@injectable()
export class JobMonitorStore {
  service: JobMonitorService;
  status: Record<string, JobStatus> = {}
  events: Record<string, JobEvent []> = {}

  constructor(
    @inject(JOB_MONITOR_TYPES.JobMonitorService) service: JobMonitorService
  ) {
    makeAutoObservable(this, {service: false}, { autoBind: true })
  }

  setStatus = (payload: JobMonitorSetStatus) => {
    this.status[payload.jobId] = payload.status
  }
  addEvent = (payload: JobMonitorAddEvent) => {
    this.events[payload.jobId] = [...(this.events[payload.jobId] ?? []), payload.event]
  }
  clearEvents = (payload: JobMonitorClearEvent) => {
    this.events[payload.jobId] = []
  }

  getJobStatus = (jobId: string): JobStatus | null => {
    // const jobMonitorActions = getActions<JobMonitorActions>(sliceId);
    return this.status[jobId] ?? null
  }

  getJobEvents = (jobId: string): JobEvent [] => {
    return this.events[jobId] ?? []
  }

  isRunning = (jobId: string): boolean => {
    return this.status[jobId] === 'RUNNING'
  }

}
