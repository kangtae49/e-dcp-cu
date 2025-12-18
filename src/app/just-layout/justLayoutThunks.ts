import {
  getActiveWinIds,
  getBranchByWinId,
  getBranchRightTop,
  hasWinId,
  queryWinIdByViewId
} from "@/app/just-layout/layoutUtil.ts";
import {createSliceThunk} from "@/store/hooks.ts";
import {getActions} from "@/store";
import type {JustLayoutActions} from "@/app/just-layout/justLayoutSlice.ts";
import {WinObj} from "@/app/just-layout/index.ts";

export function createJustLayoutThunks(sliceId: string) {
  const toggleSideMenu = createSliceThunk(sliceId, ({size}, {dispatch, sliceState}) => {
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    if (sliceState.layout.type === 'stack') {
      return;
    }
    const newSize = sliceState.layout.size <= 0 ? size : 0;
    dispatch(justLayoutActions.updateResize({
      branch: [],
      size: newSize
    }))
  })

  const openWin = createSliceThunk(sliceId, ({winId}, {dispatch, sliceState}) => {
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    if (hasWinId(sliceState?.layout ?? null, winId)) {
      dispatch(justLayoutActions.activeWin({
        winId
      }))
    } else {
      const activeWinIds = getActiveWinIds(sliceState?.layout ?? null);
      const targetWinIds = activeWinIds.filter(activeWinId => WinObj.toWinObjId(activeWinId).viewId  !== 'side-menu');
      if (targetWinIds.length === 0) {

        const branch = getBranchRightTop(sliceState?.layout)
        dispatch(justLayoutActions.insertWin({
          branch: branch, direction: "row", index: -1, pos: "stack", winId: winId,
        }))

        // dispatch(justLayoutActions.insertWin({
        //   branch: [], direction: "row", index: -1, pos: "second", winId: winId, size: 25,
        // }))
      } else {
        const targetBranch = getBranchByWinId(sliceState?.layout ?? null, targetWinIds[0])
        if (targetBranch !== null) {
          dispatch(justLayoutActions.insertWin({
            branch: targetBranch, direction: "row", index: -1, pos: "stack", winId: winId, size: 25,
          }))
        }
      }

    }
  })
  const getWinIds = createSliceThunk(sliceId, ({viewId}, {sliceState}) => {
    return queryWinIdByViewId(sliceState?.layout ?? null, viewId, [])
  })
  const openWinMenu = createSliceThunk(sliceId, ({winId}, {dispatch}) => {
    const viewId = WinObj.toWinObjId(winId).viewId;
    const winIds: string[] = dispatch(getWinIds({viewId})) as unknown as string[];
    if (winIds.includes(winId) || winIds.length === 0) {
      dispatch(openWin({winId}))
    } else {
      dispatch(openWin({winId: winIds.at(-1)}))
    }

  })

  return {
    toggleSideMenu,
    openWin,
    openWinMenu,
    getWinIds,
  }
}



