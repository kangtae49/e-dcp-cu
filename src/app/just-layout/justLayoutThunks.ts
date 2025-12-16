import {getActiveWinIds, getBranchByWinId, getBranchRightTop, hasWinId} from "@/app/just-layout/layoutUtil";
import {createSliceThunk} from "@/store/hooks";
import {getActions} from "@/store";
import type {JustLayoutActions} from "@/app/just-layout/justLayoutSlice";
import {fromWinObjId} from "@/App";

export function createJustLayoutThunks(sliceId: string) {
  return {
    toggleSideMenu: createSliceThunk(sliceId, ({size}, {dispatch, sliceState}) => {
      const justLayoutActions = getActions<JustLayoutActions>(sliceId);
      if (sliceState.layout.type === 'stack') {
        return;
      }
      const newSize = sliceState.layout.size <= 0 ? size : 0;
      dispatch(justLayoutActions.updateResize({
        branch: [],
        size: newSize
      }))
      // if (hasWinId(sliceState?.layout ?? null, "side-menu")) {
      //   dispatch(justLayoutActions.removeWin({
      //     winId: "side-menu"
      //   }))
      // } else {
      //   dispatch(justLayoutActions.insertWin({
      //     branch: [], direction: "row", index: -1, pos: "first", winId: "side-menu", size: 25,
      //   }))
      // }
    }),
    openWin: createSliceThunk(sliceId, ({winId}, {dispatch, sliceState}) => {
      const justLayoutActions = getActions<JustLayoutActions>(sliceId);
      if (hasWinId(sliceState?.layout ?? null, winId)) {
        dispatch(justLayoutActions.activeWin({
          winId
        }))
      } else {
        const activeWinIds = getActiveWinIds(sliceState?.layout ?? null);
        const targetWinIds = activeWinIds.filter(activeWinId => activeWinId !== fromWinObjId({viewId: 'side-menu'}));
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
    }),
  }
}



