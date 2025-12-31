import {useDynamicSlice} from "@/store/hooks.ts";
import {createJobMonitorSlice, JobMonitorActions, JobMonitorState} from "@/app/job/jobMonitorSlice.ts";
import {createJobMonitorThunks} from "@/app/job/jobMonitorThunks.ts";
import {JobEvent, JobStatus} from "@/types.ts";

function useJobMonitor(monitorId: string) {
  const {
    state,
    actions: jobMonitorActions,
    thunks: jobMonitorThunks,
    dispatch
  } = useDynamicSlice<JobMonitorState, JobMonitorActions>(monitorId, createJobMonitorSlice, createJobMonitorThunks)

  const getJobStatus = (jobId: string): JobStatus | null => {
    return dispatch(jobMonitorThunks.getJobStatus({jobId}))
  }
  const getJobEvents = (jobId: string): JobEvent[] => {
    return dispatch(jobMonitorThunks.getJobEvents({jobId}))
  }

  const setStatus = (jobId: string, status: JobStatus) => {
    dispatch(jobMonitorActions.setStatus({jobId, status}))
  }

  const addEvent = (jobId: string, event: JobEvent) => {
    dispatch(jobMonitorActions.addEvent({jobId, event}))
  }

  const clearEvents = (jobId: string) => {
    dispatch(jobMonitorActions.clearEvents({jobId}))
  }

  const isRunning = (jobId: string): boolean => {
    return dispatch(jobMonitorThunks.isRunning({jobId}))
  }

  return {
    state,
    getJobStatus,
    getJobEvents,
    setStatus,
    addEvent,
    clearEvents,
    isRunning,
  }
}

export default useJobMonitor