import {
  getBranchByWinId,
  getBranchByNodeName,
  hasWinId, queryWinIdsByStack,
  queryWinIdsByViewId, buildSpecFromUpdateSpec, updateNode, getNodeAtBranch, queryDupWinIdsByWinId, JustUtil
} from "./layoutUtil.ts";
import {createSliceThunk} from "@/store/hooks.ts";
import {getActions} from "@/store";
import type {JustBranch, JustId, JustLayoutActions} from "./justLayoutSlice.ts";


interface PayloadToggleWin {
  nodeName: string
}

interface PayloadOpenWin {
  justId: JustId
}

interface PayloadGetWinIds {
  viewId: string
}

interface PayloadGetDupWinIds{
  justId: JustId
}

interface PayloadGetWinIdsByBranch {
  branch: JustBranch
}

interface PayloadOpenWinMenu {
  justId: JustId
}

interface PayloadCloneWin {
  justId: JustId
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

  const openWin = createSliceThunk(sliceId, ({justId}: PayloadOpenWin, {dispatch, sliceState}) => {
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    if (hasWinId(sliceState?.layout ?? null, justId)) {
      dispatch(justLayoutActions.activeWin({
        justId
      }))
    } else {
      dispatch(justLayoutActions.addTab({
        justId: justId,
      }))
    }
  })
  const getWinIds = createSliceThunk(sliceId, ({viewId}: PayloadGetWinIds, {sliceState}) => {
    return queryWinIdsByViewId(sliceState?.layout ?? null, viewId, [])
  })
  const getDupWinIds = createSliceThunk(sliceId, ({justId}: PayloadGetDupWinIds, {sliceState}) => {
    return queryDupWinIdsByWinId(sliceState?.layout ?? null, justId, [])
  })
  const getWinIdsByBranch = createSliceThunk(sliceId, ({branch}: PayloadGetWinIdsByBranch, {sliceState}) => {
    return queryWinIdsByStack(sliceState?.layout ?? null, branch)
  })
  const openWinMenu = createSliceThunk(sliceId, ({justId}: PayloadOpenWinMenu, {dispatch}) => {
    const viewId = justId.viewId;
    const winIds: JustId[] = dispatch(getWinIds({viewId})) as unknown as JustId[];
    if (winIds.length === 0) {
      console.log('openWinMenu1', winIds, justId)
      dispatch(openWin({justId}))
    } else {
      const newJustId = winIds
        .toSorted((a, b) => (a.dupId ?? '') <= (b.dupId ?? '') ? -1: 1)
        .at(-1)
      console.log('openWinMenu2', winIds, newJustId)
      dispatch(openWin({justId: newJustId}))
    }
  })
  const cloneWin = createSliceThunk(sliceId, ({justId}: PayloadCloneWin, {dispatch, sliceState}) => {
    const targetBranch = getBranchByWinId(sliceState?.layout ?? null, justId);
    if (targetBranch === null) return;
    const justLayoutActions = getActions<JustLayoutActions>(sliceId);
    dispatch(justLayoutActions.addTab({
      justId: JustUtil.replaceDup(justId),
    }))
  })

  return {
    toggleSideMenu,
    toggleWin,
    openWin,
    openWinMenu,
    getWinIds,
    getDupWinIds,
    getWinIdsByBranch,
    cloneWin,
  }
}



