import { ContainerModule, Factory  } from "inversify";
import { COUNTER_TYPES } from "./counter.types";
import { CounterService } from "./counter.service";
import { CounterStore } from "./counter.store";
import {container} from "@/core/container.ts";

const storeCache = new Map<string, CounterStore>();

export type StoreFactory = (id: string) => CounterStore;

export const counterModule = new ContainerModule(({bind}) => {
  bind(COUNTER_TYPES.CounterService).to(CounterService).inSingletonScope();

  bind(COUNTER_TYPES.CounterStore).to(CounterStore).inTransientScope();

  bind<Factory<CounterStore>>(COUNTER_TYPES.CounterFactory)
    .toFactory((context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<CounterStore>(COUNTER_TYPES.CounterStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});