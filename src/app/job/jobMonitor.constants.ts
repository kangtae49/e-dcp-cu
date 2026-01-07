export const JOB_MONITOR_ID = "JOB-MONITOR"

export type JobStatus = 'RUNNING' | 'DONE' | 'STOPPED';

export type StreamType = 'STDOUT' | 'STDERR';

export type JobAction = 'JOB_STREAM' | 'JOB_STATUS' | 'JOB_ERROR'