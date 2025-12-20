import {useDynamicSlice} from "@/store/hooks.ts";
import {createJustLayoutSlice, JustLayoutActions, JustLayoutState} from "./justLayoutSlice.ts";
import {createJustLayoutThunks} from "./justLayoutThunks.ts";

const useJustLayout = (layoutId: string) => {
  console.log(layoutId)
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
  const addTabWin = (winId: string) => {
    dispatch(justLayoutActions.addTab({winId}))
  }

  const state = justLayoutState
  return {
    state,
    toggleWin,
    addTabWin
  }
}

export default useJustLayout
