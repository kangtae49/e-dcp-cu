import {createSlice, current, type PayloadAction} from "@reduxjs/toolkit";
import {
  activeWinId,
  insertWinId,
  moveWinId, removeAllTabs, removeEmpty,
  removeWinId,
  updateSplitSize,
} from "@/app/just-layout/layoutUtil.ts";



export type JustDirection = 'row' | 'column';
export type JustSplitDirection = 'first' | 'second';
export type JustSplitTypeUnit = 'split-percentage' | 'split-pixels';

export type JustNode = JustStack | JustSplitType

export type JustBranch = JustSplitDirection []

export interface JustStack {
  type: 'stack'
  tabs: string[]
  active: string | null
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
  primary: JustSplitDirection
}

export type JustPos = JustSplitDirection | 'stack'

export interface JustPayloadInsert {
  branch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
  size?: number
}

export interface JustPayloadRemove {
  winId: string
}
export interface JustPayloadAllTabs {
  branch: JustBranch
}

export interface JustPayloadActive {
  winId: string
}

export interface JustPayloadHasWin {
  winId: string
}

export interface JustPayloadResize {
  branch: JustBranch
  size: number
}

export interface JustPayloadMoveWin {
  branch: JustBranch
  winId: string
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
      setLayout: (state, { payload }: PayloadAction<JustNode>) => { state.layout = payload },
      insertWin: (state, { payload }: PayloadAction<JustPayloadInsert>) => {
        state.layout = insertWinId(
          state.layout == null ? null : current(state.layout),
          payload
        )
      },
      removeWin: (state, { payload }: PayloadAction<JustPayloadRemove>) => {
        state.layout = removeEmpty(removeWinId(
          state.layout == null ? null : current(state.layout),
          payload.winId
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
          payload.winId
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
          payload.winId,
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


