import {createSliceThunk} from "@/store/hooks.ts";
import {JobEvent, JobStatus} from "@/types.ts";

interface PayloadGetJobStatus {
  jobId: string
}
interface PayloadGetJobEvents {
  jobId: string
}

export function createJobMonitorThunks(sliceId: string) {
  return {
    getJobStatus: createSliceThunk(sliceId, ({jobId}: PayloadGetJobStatus, {sliceState}): JobStatus | null => {
      // const jobMonitorActions = getActions<JobMonitorActions>(sliceId);
      return sliceState.status[jobId] ?? null
    }),
    getJobEvents: createSliceThunk(sliceId, ({jobId}: PayloadGetJobEvents , {sliceState}): JobEvent [] => {
      return sliceState.events[jobId] ?? []
    }),
  }
}