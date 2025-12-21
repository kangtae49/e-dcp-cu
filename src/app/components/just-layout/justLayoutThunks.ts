import {
  getActiveWinIds,
  getBranchByWinId,
  getBranchByNodeName,
  getBranchRightTop,
  hasWinId, queryWinIdsByStack,
  queryWinIdsByViewId, buildSpecFromUpdateSpec, updateNode, getNodeAtBranch
} from "./layoutUtil.ts";
import {createSliceThunk} from "@/store/hooks.ts";
import {getActions} from "@/store";
import type {JustBranch, JustLayoutActions} from "./justLayoutSlice.ts";
import {WinObj, WinObjId} from "./index.ts";


interface PayloadToggleWin {
  nodeName: string
}

interface PayloadOpenWin {
  winId: string
}

interface PayloadGetWinIds {
  viewId: string
}

interface PayloadGetWinIdsByBranch {
  branch: JustBranch
}

interface PayloadOpenWinMenu {
  winId: string
}

interface PayloadCloneWin {
  winId: string
}

export function createJustLayoutThunks(sliceId: string) {
  const toggleSideMenu = createSliceThunk(sliceId, (_, {dispatch, sliceState}) => {
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    if (sliceState.layout.type === 'stack') {
      return;
    }
    const newSize = sliceState.layout.size <= 0 ? sliceState.layout.primaryDefaultSize : 0;
    dispatch(justLayoutActions.updateResize({
      branch: [],
      size: newSize
    }))
  })
  const toggleWin = createSliceThunk(sliceId, ({nodeName}: PayloadToggleWin, {dispatch, sliceState}) => {
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    const layout = sliceState?.layout;
    const branch = getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return;
    const node = getNodeAtBranch(layout, branch)
    if (node == null) return;
    if (node.type !== 'split-pixels') return;
    const newSize = node.size === 0 ? node.primaryDefaultSize : 0;
    const updateSpec = buildSpecFromUpdateSpec(branch, {
      $merge: {
        size: newSize
      }
    })
    const newLayout = updateNode(node, updateSpec)
    if (newLayout == null) return;
    dispatch(justLayoutActions.setLayout(newLayout))
  })

  const openWin = createSliceThunk(sliceId, ({winId}: PayloadOpenWin, {dispatch, sliceState}) => {
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
  const getWinIds = createSliceThunk(sliceId, ({viewId}: PayloadGetWinIds, {sliceState}) => {
    return queryWinIdsByViewId(sliceState?.layout ?? null, viewId, [])
  })
  const getWinIdsByBranch = createSliceThunk(sliceId, ({branch}: PayloadGetWinIdsByBranch, {sliceState}) => {
    return queryWinIdsByStack(sliceState?.layout ?? null, branch)
  })
  const openWinMenu = createSliceThunk(sliceId, ({winId}: PayloadOpenWinMenu, {dispatch}) => {
    const viewId = WinObj.toWinObjId(winId).viewId;
    const winIds: string[] = dispatch(getWinIds({viewId})) as unknown as string[];
    if (winIds.length === 0) {
      console.log('openWinMenu1', winIds, winId)
      dispatch(openWin({winId}))
    } else {
      const newWinId = winIds
        .toSorted((a, b) => (WinObj.toWinObjId(a).dupId ?? '') <= (WinObj.toWinObjId(b).dupId ?? '') ? -1: 1)
        .at(-1)
      console.log('openWinMenu2', winIds, newWinId)
      dispatch(openWin({winId: newWinId}))
    }
  })
  const cloneWin = createSliceThunk(sliceId, ({winId}: PayloadCloneWin, {dispatch, sliceState}) => {
    const targetBranch = getBranchByWinId(sliceState?.layout ?? null, winId);
    if (targetBranch === null) return;
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    const dupId = `${new Date().getTime()}`
    const newWinObjId: WinObjId = {
      ...WinObj.toWinObjId(winId),
      dupId
    }
    const newWinId = WinObj.toWinId(newWinObjId)
    dispatch(justLayoutActions.insertWin({
      branch: targetBranch, direction: "row", index: -1, pos: "stack", winId: newWinId,
    }))
  })

  return {
    toggleSideMenu,
    toggleWin,
    openWin,
    openWinMenu,
    getWinIds,
    getWinIdsByBranch,
    cloneWin,
  }
}



