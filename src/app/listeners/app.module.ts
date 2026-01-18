import { ContainerModule, Factory  } from "inversify";
import { APP_TYPES } from "./app.types";
import { AppService } from "./app.service";
import { AppStore } from "./app.store";
import {container, storeCache} from "@/inversify.config.ts";

// const storeCache = new Map<string, AppStore>();


export const appModule = new ContainerModule(({bind}) => {
  bind(APP_TYPES.AppService).to(AppService).inSingletonScope();

  bind(APP_TYPES.AppStore).to(AppStore).inTransientScope();

  bind<Factory<AppStore>>(APP_TYPES.AppFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<AppStore>(APP_TYPES.AppStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});