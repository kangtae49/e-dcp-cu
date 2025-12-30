import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {
  activeWinId, addTabWin, getBranchByWinId, getNodeAtBranch, getTabBranch, hasWinId, JustUtil,
  moveWinIdToSplit, moveWinIdToStack, removeAllTabs, removeEmpty,
  removeWinId,
  updateSplitSize,
} from "./layoutUtil.ts";

export type JustDirection = 'row' | 'column';
export type JustSplitDirection = 'first' | 'second';
export type JustSplitTypeUnit = 'split-percentage' | 'split-pixels';

type JSONPrimitive = string | number | boolean | null | undefined;
export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | { [key: string]: JSONValue }
export type JSONObject = { [key: string]: JSONValue };
// export type JustId = JSONObject | string | number;

export interface JustId extends JSONObject {
  title: string
  viewId: string
  dupId?: string
  params?: Record<string, JSONValue>
}

export type JustNode = JustStack | JustSplitType

export type JustBranch = JustSplitDirection []

export interface JustStack {
  type: 'stack'
  tabs: JustId[]
  active: JustId | null
}

export type JustSplitType = JustSplitPercentage | JustSplitPixels;


export interface JustSplitBase {
  type: JustSplitTypeUnit
  direction: JustDirection
  first: JustNode
  second: JustNode
  size: number
  show: boolean
  minSize?: number
}

export interface JustSplitPercentage extends JustSplitBase {
  type: 'split-percentage'
}

export interface JustSplitPixels extends JustSplitBase {
  type: 'split-pixels'
  name: string
  primary: JustSplitDirection
  primaryDefaultSize: number
  noSplitter?: boolean
}

export type JustPos = JustSplitDirection | 'stack'

export interface JustPayloadInsert {
  branch: JustBranch
  justId: JustId
  direction: JustDirection
  pos: JustPos
  index: number
  size?: number
}
export interface JustPayloadAddTab {
  justId: JustId
}
export interface JustPayloadCloneTab {
  justId: JustId
  cloneJustId: JustId
}

export interface JustPayloadRemove {
  justId: JustId
}
export interface JustPayloadAllTabs {
  branch: JustBranch
}

export interface JustPayloadActive {
  justId: JustId
}

export interface JustPayloadResize {
  branch: JustBranch
  size: number
}

// export interface JustPayloadMoveWin {
//   branch: JustBranch
//   justId: JustId
//   direction: JustDirection
//   pos: JustPos
//   index: number
// }

export type JustPayloadMoveWin = JustPayloadMoveWinStack | JustPayloadMoveWinSplit

export interface JustPayloadMoveWinStack {
  pos: "stack"
  justId: JustId
  branch: JustBranch
  index: number
}
export interface JustPayloadMoveWinSplit {
  pos: "first" | "second"
  justId: JustId
  branch: JustBranch
  direction: JustDirection
  size?: number
}

export interface JustLayoutState {
  layout: JustNode | null
  lastActiveId: JustId | null
  lastActiveTm: number
}


const initialState: JustLayoutState = {
  layout: null,
  lastActiveId: null,
  lastActiveTm: new Date().getTime(),
}



export const createJustLayoutSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setLayout: (state, { payload }: PayloadAction<JustNode | null>) => {
        const justState = state as any;
        justState.layout = payload
      },
      addTab: (state, { payload }: PayloadAction<JustPayloadAddTab>) => {
        const justState = state as any;
        const branch = getTabBranch(justState.layout, [])
        if (branch == null) return;
        if (hasWinId(justState.layout, payload.justId)) {
          justState.layout = activeWinId(justState.layout, payload.justId)
        } else {
          justState.layout = addTabWin(justState.layout, branch, payload.justId, -1)
        }
        justState.lastActiveId = payload.justId
        justState.lastActiveTm = new Date().getTime()
      },
      cloneTab: (state, { payload }: PayloadAction<JustPayloadCloneTab>) => {
        const justState = state as any;
        // const stackNode = getNodeByWinId(justState.layout, payload.justId)
        const branch = getBranchByWinId(justState.layout, payload.justId)
        if (branch == null) return;
        const stackNode = getNodeAtBranch(justState.layout, branch)
        let newIndex: number = 0;
        if (stackNode?.type === 'stack' && stackNode.active != null) {
          newIndex = JustUtil.indexOf(stackNode.tabs, payload.justId) + 1
        }
        justState.layout = addTabWin(justState.layout, branch, payload.cloneJustId, newIndex)
        justState.lastActiveId = payload.cloneJustId
        justState.lastActiveTm = new Date().getTime()
      },
      removeWin: (state, { payload }: PayloadAction<JustPayloadRemove>) => {
        const justState = state as any;
        justState.layout = removeEmpty(removeWinId(
          justState.layout,
          payload.justId
        ))
      },
      removeAllTabs: (state, { payload }: PayloadAction<JustPayloadAllTabs>) => {
        const justState = state as any;
        justState.layout = removeEmpty(removeAllTabs(
          justState.layout,
          payload.branch
        ))
      },
      activeWin: (state, { payload }: PayloadAction<JustPayloadActive>) => {
        const justState = state as any;
        justState.layout = activeWinId(
          justState.layout,
          payload.justId
        )
        justState.lastActiveId = payload.justId as JustId | null | any
        justState.lastActiveTm = new Date().getTime()
      },
      updateResize: (state, { payload }: PayloadAction<JustPayloadResize>) => {
        const justState = state as any;
        justState.layout = updateSplitSize(
          justState.layout,
          payload.branch,
          payload.size
        )
      },
      moveWin: (state, { payload }: PayloadAction<JustPayloadMoveWin>) => {
        const justState = state as any;
        if (payload.pos === 'stack') {
          justState.layout = removeEmpty(moveWinIdToStack(
            justState.layout,
            payload
          ))
        } else {
          justState.layout = removeEmpty(moveWinIdToSplit(
            justState.layout,
            payload
          ))
        }
      },
    }
  })

export type JustLayoutSlice = ReturnType<typeof createJustLayoutSlice>;

export type JustLayoutActions = JustLayoutSlice["actions"];


