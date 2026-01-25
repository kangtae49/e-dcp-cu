import { ContainerModule, Factory  } from "inversify";
import { EXCALIDRAW_TYPES } from "./excalidraw.constants.ts";
import { ExcalidrawService } from "./excalidraw.service.ts";
import { ExcalidrawStore } from "./excalidraw.store";


export const excalidrawModule = new ContainerModule(({bind}) => {
  bind(EXCALIDRAW_TYPES.ExcalidrawService).to(ExcalidrawService).inSingletonScope();
  bind(EXCALIDRAW_TYPES.ExcalidrawStore).to(ExcalidrawStore).inTransientScope();

  bind<Map<string, ExcalidrawStore>>(EXCALIDRAW_TYPES.ExcalidrawStoreCacheMap).toConstantValue(new Map());
  bind<Factory<ExcalidrawStore>>(EXCALIDRAW_TYPES.ExcalidrawFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, ExcalidrawStore>>(EXCALIDRAW_TYPES.ExcalidrawStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<ExcalidrawStore>(EXCALIDRAW_TYPES.ExcalidrawStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});



