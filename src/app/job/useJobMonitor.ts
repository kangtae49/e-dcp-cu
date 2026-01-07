import {useState} from "react";
import {container} from "@/inversify.config.ts";
import {JOB_MONITOR_TYPES, JobMonitorFactory} from "@/app/job/jobMonitor.types.ts";

function useJobMonitor(id: string) {
  const [store] = useState(() => {
    const factory = container.get<JobMonitorFactory>(JOB_MONITOR_TYPES.JobMonitorFactory);
    return factory(id);
  })

  return store
}

export default useJobMonitor
