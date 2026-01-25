import {useState} from "react";
import {JobMonitorFactory} from "@/app/job/jobMonitor.types.ts";
import {JOB_MONITOR_TYPES} from "@/app/job/jobMonitor.constants.ts";
import {useInjection} from "inversify-react";

function useJobMonitor(id: string) {
  const factory = useInjection<JobMonitorFactory>(JOB_MONITOR_TYPES.JobMonitorFactory);
  const [store] = useState(() => {
    return factory(id);
  })

  return store
}

export default useJobMonitor
