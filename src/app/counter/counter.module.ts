import { ContainerModule, Factory  } from "inversify";
import { COUNTER_TYPES } from "./counter.constants.ts";
import { CounterService } from "./counter.service";
import { CounterStore } from "./counter.store";



export const counterModule = new ContainerModule(({bind}) => {
  bind(COUNTER_TYPES.CounterService).to(CounterService).inSingletonScope();
  bind(COUNTER_TYPES.CounterStore).to(CounterStore).inTransientScope();

  bind<Map<string, CounterStore>>(COUNTER_TYPES.CounterStoreCacheMap).toConstantValue(new Map());

  bind<Factory<CounterStore>>(COUNTER_TYPES.CounterFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, CounterStore>>(COUNTER_TYPES.CounterStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<CounterStore>(COUNTER_TYPES.CounterStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});