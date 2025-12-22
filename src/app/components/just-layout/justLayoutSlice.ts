import {createSlice, current, type PayloadAction} from "@reduxjs/toolkit";
// import { castDraft } from 'immer';
import {
  activeWinId, addTabWin, getTabBranch, hasWinId,
  insertWinId,
  moveWinId, removeAllTabs, removeEmpty,
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

export interface JustPayloadMoveWin {
  branch: JustBranch
  justId: JustId
  direction: JustDirection
  pos: JustPos
  index: number
}

export interface JustLayoutState {
  layout: JustNode | null
}


const initialState: JustLayoutState = {
  layout: null,
}



export const createJustLayoutSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setLayout: (state, { payload }: PayloadAction<JustNode | null>) => { 
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        state.layout = payload
      },
      insertWin: (state, { payload }: PayloadAction<JustPayloadInsert>) => {
        state.layout = insertWinId(
          state.layout == null ? null : current(state.layout),
          payload
        )
      },
      addTab: (state, { payload }: PayloadAction<JustPayloadAddTab>) => {
        const layout = state.layout == null ? null : current(state.layout)
        const branch = getTabBranch(layout, [])
        if (branch == null) return;
        if (hasWinId(layout, payload.justId)) {
          state.layout = activeWinId(layout, payload.justId)
        } else {
          state.layout = addTabWin(layout, branch, payload.justId)
        }
      },
      removeWin: (state, { payload }: PayloadAction<JustPayloadRemove>) => {
        state.layout = removeEmpty(removeWinId(
          state.layout == null ? null : current(state.layout),
          payload.justId
        ))
      },
      removeAllTabs: (state, { payload }: PayloadAction<JustPayloadAllTabs>) => {
        state.layout = removeEmpty(removeAllTabs(
          state.layout == null ? null : current(state.layout),
          payload.branch
        ))
      },
      activeWin: (state, { payload }: PayloadAction<JustPayloadActive>) => {
        state.layout = activeWinId(
          state.layout == null ? null : current(state.layout),
          payload.justId
        )
      },
      updateResize: (state, { payload }: PayloadAction<JustPayloadResize>) => {
        state.layout = updateSplitSize(
          state.layout == null ? null : current(state.layout),
          payload.branch,
          payload.size
        )
      },
      moveWin: (state, { payload }: PayloadAction<JustPayloadMoveWin>) => {
        state.layout = removeEmpty(moveWinId(
          state.layout == null ? null : current(state.layout),
          payload.justId,
          payload.branch,
          payload.pos,
          payload.direction,
          payload.index
        ))
      },
    }
  })

export type JustLayoutSlice = ReturnType<typeof createJustLayoutSlice>;

export type JustLayoutActions = JustLayoutSlice["actions"];


