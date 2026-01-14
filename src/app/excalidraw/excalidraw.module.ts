import { ContainerModule, Factory  } from "inversify";
import { EXCALIDRAW_TYPES } from "./excalidraw.types";
import { ExcalidrawService } from "./excalidraw.service.ts";
import { ExcalidrawStore } from "./excalidraw.store";
import {container} from "@/inversify.config.ts";

const storeCache = new Map<string, ExcalidrawStore>();



export const excalidrawModule = new ContainerModule(({bind}) => {
  bind(EXCALIDRAW_TYPES.ExcalidrawService).to(ExcalidrawService).inSingletonScope();

  bind(EXCALIDRAW_TYPES.ExcalidrawStore).to(ExcalidrawStore).inTransientScope();

  bind<Factory<ExcalidrawStore>>(EXCALIDRAW_TYPES.ExcalidrawFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<ExcalidrawStore>(EXCALIDRAW_TYPES.ExcalidrawStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});
