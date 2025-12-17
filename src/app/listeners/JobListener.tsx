import {useEffect} from "react";
import {useDynamicSlice} from "@/store/hooks.ts";
import {createJobMonitorSlice, JOB_MONITOR_ID, JobMonitorActions, JobMonitorState} from "@/app/job/jobMonitorSlice.ts";
import {JobStatusData} from "@/types.ts";

function JobListener(): null {
  const {
    // state: jobMonitorState,
    actions: jobMonitorActions,
    dispatch
  } = useDynamicSlice<JobMonitorState, JobMonitorActions>(JOB_MONITOR_ID, createJobMonitorSlice)


  useEffect(() => {
    window.api.onJobEvent((event, jobEvent) => {
      console.log(jobEvent)
      if (jobEvent.action === "JOB_STATUS") {
        const dataStatus = jobEvent.data as JobStatusData
        dispatch(jobMonitorActions.setStatus({jobId: jobEvent.jobId, status: dataStatus.status}))
      }
      dispatch(jobMonitorActions.addEvent({jobId: jobEvent.jobId, event: jobEvent}))
    })
  }, [])
  return null
}

export default JobListener
