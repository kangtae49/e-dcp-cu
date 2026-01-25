import { ContainerModule, Factory  } from "inversify";
import {GRID_DATA_TYPES} from "@/app/grid-data/gridData.constants.ts";
import {GridDataStore} from "@/app/grid-data/gridData.store.ts";
import {GridDataService} from "@/app/grid-data/gridData.service.ts";


export const gridDataModule = new ContainerModule(({bind}) => {
  bind(GRID_DATA_TYPES.GridDataService).to(GridDataService).inSingletonScope();
  bind(GRID_DATA_TYPES.GridDataStore).to(GridDataStore).inTransientScope();

  bind<Map<string, GridDataStore>>(GRID_DATA_TYPES.GridDataStoreCacheMap).toConstantValue(new Map());
  bind<Factory<GridDataStore>>(GRID_DATA_TYPES.GridDataFactory)
    .toFactory((context) => {
      const cacheMap = context.get<Map<string, GridDataStore>>(GRID_DATA_TYPES.GridDataStoreCacheMap);
      return (id: string) => {
        if (!cacheMap.has(id)) {
          const newStore = context.get<GridDataStore>(GRID_DATA_TYPES.GridDataStore);
          cacheMap.set(id, newStore);
        }
        return cacheMap.get(id)!;
      }
    })
});