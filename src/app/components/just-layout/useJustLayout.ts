import {useDynamicSlice} from "@/store/hooks.ts";
import {createJustLayoutSlice, JustId, JustLayoutActions, JustLayoutState} from "./justLayoutSlice.ts";
import {createJustLayoutThunks} from "./justLayoutThunks.ts";

const useJustLayout = (layoutId: string) => {
  const {
    state: justLayoutState,
    actions: justLayoutActions,
    thunks: justLayoutTrunks,
    dispatch
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice, createJustLayoutThunks)

  const toggleWin = (nodeName: string) => {
    console.log(nodeName)
    dispatch(justLayoutTrunks.toggleWin({nodeName}))
  }
  const addTabWin = (justId: JustId) => {
    const ids: JustId [] = dispatch(justLayoutTrunks.getDupWinIds({justId}))

    const dupWinId = ids.toSorted((a, b) => (a.dupId ?? '') >= (b.dupId ?? '') ? 1 : -1).at(-1) ?? justId;
    dispatch(justLayoutActions.addTab({justId: dupWinId}))
  }

  const getSizeByNodeName = (nodeName: string): number | null => {
    return dispatch(justLayoutTrunks.getSizeByNodeName({nodeName}))
  }

  const state = justLayoutState
  return {
    state,
    toggleWin,
    getSizeByNodeName,
    addTabWin
  }
}

export default useJustLayout
