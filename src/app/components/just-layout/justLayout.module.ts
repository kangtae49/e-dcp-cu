import { ContainerModule, Factory  } from "inversify";
import { JUST_LAYOUT_TYPES } from "./justLayout.types";
import { JustLayoutService } from "./justLayout.service";
import { JustLayoutStore } from "./justLayout.store";
import {container} from "@/inversify.config.ts";

const storeCache = new Map<string, JustLayoutStore>();
(window as any).storeJustLayout = storeCache;


export const justLayoutModule = new ContainerModule(({bind}) => {
  bind(JUST_LAYOUT_TYPES.JustLayoutService).to(JustLayoutService).inSingletonScope();

  bind(JUST_LAYOUT_TYPES.JustLayoutStore).to(JustLayoutStore).inTransientScope();

  bind<Factory<JustLayoutStore>>(JUST_LAYOUT_TYPES.JustLayoutFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<JustLayoutStore>(JUST_LAYOUT_TYPES.JustLayoutStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});