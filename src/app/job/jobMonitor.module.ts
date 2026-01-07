import { ContainerModule, Factory  } from "inversify";
import {container} from "@/inversify.config.ts";
import {JOB_MONITOR_TYPES} from "@/app/job/jobMonitor.types.ts";
import {JobMonitorStore} from "@/app/job/jobMonitor.store.ts";
import {JobMonitorService} from "@/app/job/jobMonitor.service.ts";

const storeCache = new Map<string, JobMonitorStore>();


export const jobMonitorModule = new ContainerModule(({bind}) => {
  bind(JOB_MONITOR_TYPES.JobMonitorService).to(JobMonitorService).inSingletonScope();
  bind(JOB_MONITOR_TYPES.JobMonitorStore).to(JobMonitorStore).inTransientScope();

  bind<Factory<JobMonitorStore>>(JOB_MONITOR_TYPES.JobMonitorFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<JobMonitorStore>(JOB_MONITOR_TYPES.JobMonitorStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});