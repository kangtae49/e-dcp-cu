import { ContainerModule, Factory  } from "inversify";
import { EXCALIDRAW_DATA_TYPES } from "./excalidrawData.types";
import { ExcalidrawDataService } from "./excalidrawData.service.ts";
import { ExcalidrawDataStore } from "./excalidrawData.store.ts";
import {container, storeCache} from "@/inversify.config.ts";

// const storeCache = new Map<string, ExcalidrawDataStore>();


export const excalidrawDataModule = new ContainerModule(({bind}) => {
  bind(EXCALIDRAW_DATA_TYPES.ExcalidrawDataService).to(ExcalidrawDataService).inSingletonScope();

  bind(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStore).to(ExcalidrawDataStore).inTransientScope();

  bind<Factory<ExcalidrawDataStore>>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<ExcalidrawDataStore>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});
