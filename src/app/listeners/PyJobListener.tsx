import {useEffect} from "react";
import type {JobDataStatus, PyJobEvent} from "@/types/models";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJobMonitorSlice,
  JOB_MONITOR_ID,
  type JobMonitorActions,
  type JobMonitorState
} from "@/app/job/jobMonitorSlice.ts";


function PyJobListener() {
  const {
    // state: jobMonitorState,
    actions: jobMonitorActions,
    dispatch
  } = useDynamicSlice<JobMonitorState, JobMonitorActions>(JOB_MONITOR_ID, createJobMonitorSlice)

  useEffect(() => {
    const handler = (e: CustomEvent<PyJobEvent>) => {
      const pyJobEvent = e.detail;
      console.log(pyJobEvent)
      if (pyJobEvent.action === "PY_JOB_STATUS") {
        const dataStatus = pyJobEvent.data as JobDataStatus
        dispatch(jobMonitorActions.setStatus({jobId: pyJobEvent.job_id!, status: dataStatus.status}))
      }
      dispatch(jobMonitorActions.addEvent({jobId: pyJobEvent.job_id!, event: pyJobEvent}))
    }
    const handleFocus = () => {
      console.log('re_send_events');
      window.pywebview.api.re_send_events()
    };

    const handleBlur = () => {
    };

    window.addEventListener("py-job-event", handler as EventListener);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("py-job-event", handler as EventListener);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    }

  }, [])
  return null;
}

export default PyJobListener
