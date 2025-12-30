import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {GridData} from "@/types.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";

export const GRID_DATA_ID = "GRID_DATA"



export interface GridDataState {
  gridDataMap: Record<string, GridData>
}

export const CONFIG_KEYS: JustId[] = [
  {viewId: "grid-view", title: "업체명", params: {file: "data\\company.xlsx"}}
]

export type GridDataMap = Record<string, GridData>

const initialState: GridDataState = {
  gridDataMap: {} as GridDataMap,
}



export interface GridDataPlayloadIsLocked {
  key: string
  isLocked: boolean
}


export const createGridDataSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setGridDataMap: (state, { payload }: PayloadAction<GridDataMap>) => {
        state.gridDataMap = payload
      },
      updateGridDataMap: (state, { payload }: PayloadAction<GridDataMap>) => {
        state.gridDataMap = {
          ...state.gridDataMap,
          ...payload,
        }
      },
      updateGridData: (state, { payload }: PayloadAction<GridData>) => {

        const newGridData: GridData = {
          ...state.gridDataMap[payload.key],
          data: payload.data,
          header: payload.header,
          timestamp: payload.timestamp,
        }

        state.gridDataMap = {
          ...state.gridDataMap,
          [payload.key]: newGridData
        }

      },
      updateIsLocked: (state, { payload }: PayloadAction<GridDataPlayloadIsLocked>) => {
        const newGridData: GridData = {
          ...state.gridDataMap[payload.key],
          isLocked: payload.isLocked
        }

        state.gridDataMap = {
          ...state.gridDataMap,
          [payload.key]: newGridData
        }
      }
    }
  })

export type GridDataSlice = ReturnType<typeof createGridDataSlice>;

export type GridDataActions = GridDataSlice["actions"];
