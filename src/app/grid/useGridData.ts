import {useDynamicSlice} from "@/store/hooks.ts";
import {GridDataActions, GridDataState, createGridDataSlice} from "@/app/grid/gridDataSlice.ts";
import {GridData} from "@/types.ts";

function useGridData(configId: string) {
  const {
    state,
    actions: gridDataActions,
    dispatch
  } = useDynamicSlice<GridDataState, GridDataActions>(configId, createGridDataSlice)

  const updateGridData = (gridData: GridData) => {
    dispatch(
      gridDataActions.updateGridData(gridData)
    )
  }

  const updateIsLocked = (key: string, isLocked: boolean) => {
    dispatch(
      gridDataActions.updateIsLocked({key, isLocked})
    )
  }

  return {
    state,
    updateGridData,
    updateIsLocked,
  }
}

export default useGridData
