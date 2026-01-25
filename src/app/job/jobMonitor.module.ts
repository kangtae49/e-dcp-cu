import { ContainerModule, Factory  } from "inversify";
import {JOB_MONITOR_TYPES} from "@/app/job/jobMonitor.constants.ts";
import {JobMonitorStore} from "@/app/job/jobMonitor.store.ts";
import {JobMonitorService} from "@/app/job/jobMonitor.service.ts";


export const jobMonitorModule = new ContainerModule(({bind}) => {
  bind(JOB_MONITOR_TYPES.JobMonitorService).to(JobMonitorService).inSingletonScope();
  bind(JOB_MONITOR_TYPES.JobMonitorStore).to(JobMonitorStore).inTransientScope();

  bind<Map<string, JobMonitorStore>>(JOB_MONITOR_TYPES.JobMonitorStoreCacheMap).toConstantValue(new Map());
  bind<Factory<JobMonitorStore>>(JOB_MONITOR_TYPES.JobMonitorFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, JobMonitorStore>>(JOB_MONITOR_TYPES.JobMonitorStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<JobMonitorStore>(JOB_MONITOR_TYPES.JobMonitorStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});