import {useState} from "react";
import {GRID_DATA_TYPES, GridDataFactory} from "@/app/grid-data/gridData.types.ts";
import {container} from "@/inversify.config.ts";

function useGridDataStore(id: string) {
  const [store] = useState(() => {
    const factory = container.get<GridDataFactory>(GRID_DATA_TYPES.GridDataFactory);
    return factory(id);
  })

  return store
}

export default useGridDataStore
