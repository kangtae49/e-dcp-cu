import { ContainerModule, Factory  } from "inversify";
import { APP_TYPES } from "./app.constants.ts";
import { AppService } from "./app.service";
import { AppStore } from "./app.store";


export const appModule = new ContainerModule(({bind}) => {
  bind(APP_TYPES.AppService).to(AppService).inSingletonScope();
  bind(APP_TYPES.AppStore).to(AppStore).inTransientScope();

  bind<Map<string, AppStore>>(APP_TYPES.AppStoreCacheMap).toConstantValue(new Map());
  bind<Factory<AppStore>>(APP_TYPES.AppFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, AppStore>>(APP_TYPES.AppStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<AppStore>(APP_TYPES.AppStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});