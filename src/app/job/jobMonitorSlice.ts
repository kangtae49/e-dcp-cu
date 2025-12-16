// import type {JobStatus, PyJobEvent} from "@/types/models";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {JobEvent, JobStatus} from "@/types";

export const JOB_MONITOR_ID = "JOB-MONITOR"

export interface JobMonitorState {
  status: Record<string, JobStatus>,
  events: Record<string, JobEvent []>
}

const initialState: JobMonitorState = {
  status: {} as Record<string, JobStatus>,
  events: {} as Record<string, JobEvent []>
}

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

export const createJobMonitorSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setStatus: (state, { payload }: PayloadAction<JobMonitorSetStatus>) => {
        state.status[payload.jobId] = payload.status
      },
      addEvent: (state, { payload }: PayloadAction<JobMonitorAddEvent>) => {
        state.events[payload.jobId] = [...(state.events[payload.jobId] ?? []), payload.event]
      },
      clearEvents: (state, { payload }: PayloadAction<JobMonitorClearEvent>) => {
        state.events[payload.jobId] = []
      }
    }
  })

export type JobMonitorSlice = ReturnType<typeof createJobMonitorSlice>;
export type JobMonitorActions = JobMonitorSlice["actions"];

