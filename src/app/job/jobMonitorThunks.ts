import {createSliceThunk} from "@/store/hooks.ts";
import type {JobStatus, PyJobEvent} from "@/types/models";

export function createJobMonitorThunks(sliceId: string) {
  return {
    getJobStatus: createSliceThunk(sliceId, ({jobId}, {sliceState}): JobStatus | null => {
      // const jobMonitorActions = getActions<JobMonitorActions>(sliceId);
      return sliceState.status[jobId] ?? null
    }),
    getJobEvents: createSliceThunk(sliceId, ({jobId}, {sliceState}): PyJobEvent [] => {
      return sliceState.events[jobId] ?? []
    }),
  }
}