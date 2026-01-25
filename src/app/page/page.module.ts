import { ContainerModule, Factory  } from "inversify";
import { PAGE_TYPES } from "./page.constants.ts";
import { PageService } from "./page.service.ts";
import { PageStore } from "./page.store";


export const pageModule = new ContainerModule(({bind}) => {
  bind(PAGE_TYPES.PageService).to(PageService).inSingletonScope();
  bind(PAGE_TYPES.PageStore).to(PageStore).inTransientScope();

  bind<Map<string, PageStore>>(PAGE_TYPES.PageStoreCacheMap).toConstantValue(new Map());
  bind<Factory<PageStore>>(PAGE_TYPES.PageFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, PageStore>>(PAGE_TYPES.PageStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<PageStore>(PAGE_TYPES.PageStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});
