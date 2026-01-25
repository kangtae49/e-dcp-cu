import { ContainerModule, Factory  } from "inversify";
import { EXCALIDRAW_DATA_TYPES } from "./excalidrawData.constants.ts";
import { ExcalidrawDataService } from "./excalidrawData.service.ts";
import { ExcalidrawDataStore } from "./excalidrawData.store.ts";


export const excalidrawDataModule = new ContainerModule(({bind}) => {
  bind(EXCALIDRAW_DATA_TYPES.ExcalidrawDataService).to(ExcalidrawDataService).inSingletonScope();
  bind(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStore).to(ExcalidrawDataStore).inTransientScope();

  bind<Map<string, ExcalidrawDataStore>>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStoreCacheMap).toConstantValue(new Map());
  bind<Factory<ExcalidrawDataStore>>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, ExcalidrawDataStore>>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<ExcalidrawDataStore>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});
