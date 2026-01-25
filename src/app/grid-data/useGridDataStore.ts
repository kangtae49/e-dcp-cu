import {useState} from "react";
import type {GridDataFactory} from "@/app/grid-data/gridData.types.ts";
import {GRID_DATA_TYPES} from "@/app/grid-data/gridData.constants.ts";
import {useInjection} from "inversify-react";

function useGridDataStore(id: string) {
  const factory = useInjection<GridDataFactory>(GRID_DATA_TYPES.GridDataFactory);
  const [store] = useState(() => {
    return factory(id);
  })

  return store
}

export default useGridDataStore
