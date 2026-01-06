import { ContainerModule, Factory  } from "inversify";
import {container} from "@/inversify.config.ts";
import {GRID_DATA_TYPES} from "@/app/grid/gridData.types.ts";
import {GridDataStore} from "@/app/grid/gridData.store.ts";
import {GridDataService} from "@/app/grid/gridData.service.ts";

const storeCache = new Map<string, GridDataStore>();


export const gridDataModule = new ContainerModule(({bind}) => {
  bind(GRID_DATA_TYPES.GridDataService).to(GridDataService).inSingletonScope();
  bind(GRID_DATA_TYPES.GridDataStore).to(GridDataStore).inTransientScope();

  bind<Factory<GridDataStore>>(GRID_DATA_TYPES.GridDataFactory)
    .toFactory((_context) => {
      return (id: string) => {
        if (!storeCache.has(id)) {
          const newStore = container.get<GridDataStore>(GRID_DATA_TYPES.GridDataStore);
          storeCache.set(id, newStore);
        }
        return storeCache.get(id)!;
      }
    })
});