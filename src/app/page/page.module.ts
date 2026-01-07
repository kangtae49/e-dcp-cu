import { ContainerModule, Factory  } from "inversify";
import { PAGE_TYPES } from "./page.types";
import { PageService } from "./page.service.ts";
import { PageStore } from "./page.store";
import {container} from "@/inversify.config.ts";

const storeCache = new Map<string, PageStore>();


export const pageModule = new ContainerModule(({bind}) => {
  bind(PAGE_TYPES.PageService).to(PageService).inSingletonScope();

  bind(PAGE_TYPES.PageStore).to(PageStore).inTransientScope();

  bind<Factory<PageStore>>(PAGE_TYPES.PageFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<PageStore>(PAGE_TYPES.PageStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});
