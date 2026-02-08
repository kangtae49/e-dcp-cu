import {useEffect} from "react";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {JobStatusData, JobStreamData} from "@/app/job/jobMonitor.types.ts";
import {observer} from "mobx-react-lite";
import {terminalManager} from "@/app/components/terminal/TerminalManager.ts";

const JobListener = observer((): null => {

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID);

  useEffect(() => {
    window.api.onJobEvent((event, jobEvent) => {
      console.log(jobEvent)
      if (jobEvent.action === "JOB_STATUS") {
        const dataStatus = jobEvent.data as JobStatusData
        jobMonitorStore.setStatus({jobId: jobEvent.jobId, status: dataStatus.status})
      }
      jobMonitorStore.addEvent({jobId: jobEvent.jobId, event: jobEvent})
      if (jobEvent.action === 'JOB_STREAM') {
        const data = jobEvent.data as JobStreamData
        terminalManager.writeToTerminal(jobEvent.jobId, data.message)
      }
    })
  }, [])
  return null
})

export default JobListener
