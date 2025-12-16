import {createSliceThunk} from "@/store/hooks";
import {JobEvent, JobStatus} from "@/types";

export function createJobMonitorThunks(sliceId: string) {
  return {
    getJobStatus: createSliceThunk(sliceId, ({jobId}, {sliceState}): JobStatus | null => {
      // const jobMonitorActions = getActions<JobMonitorActions>(sliceId);
      return sliceState.status[jobId] ?? null
    }),
    getJobEvents: createSliceThunk(sliceId, ({jobId}, {sliceState}): JobEvent [] => {
      return sliceState.events[jobId] ?? []
    }),
  }
}