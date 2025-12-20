import {useEffect} from "react";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitorSlice.ts";
import {JobStatusData} from "@/types.ts";
import useJobMonitor from "@/app/job/useJobMonitor.ts";

function JobListener(): null {

  const {setStatus, addEvent} = useJobMonitor(JOB_MONITOR_ID);

  useEffect(() => {
    window.api.onJobEvent((event, jobEvent) => {
      console.log(jobEvent)
      if (jobEvent.action === "JOB_STATUS") {
        const dataStatus = jobEvent.data as JobStatusData
        setStatus(jobEvent.jobId, dataStatus.status)
      }
      addEvent(jobEvent.jobId, jobEvent)
    })
  }, [])
  return null
}

export default JobListener
