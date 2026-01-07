import {useEffect} from "react";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {JobStatusData} from "@/app/job/jobMonitor.types.ts";

function JobListener(): null {

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID);

  useEffect(() => {
    window.api.onJobEvent((event, jobEvent) => {
      console.log(jobEvent)
      if (jobEvent.action === "JOB_STATUS") {
        const dataStatus = jobEvent.data as JobStatusData
        jobMonitorStore.setStatus({jobId: jobEvent.jobId, status: dataStatus.status})
      }
      jobMonitorStore.addEvent({jobId: jobEvent.jobId, event: jobEvent})
    })
  }, [])
  return null
}

export default JobListener
