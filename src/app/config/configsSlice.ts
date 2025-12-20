import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {ConfigTable} from "@/types.ts";
import {WinObj, WinObjId} from "@/app/components/just-layout";
import {ViewId} from "@/app/layout/layout-util.tsx";

export const CONFIG_ID = "CONFIGS"



export interface ConfigsState {
  configs: Record<string, ConfigTable>
  keys: WinObjId<ViewId>[]
}

export const CONFIG_KEYS: WinObjId<ViewId>[] = [
  new WinObj({viewId: "setting-config", params: {"title": "업체명", "file": "data\\company.xlsx"}}).toWinObjId()
]

const initialState: ConfigsState = {
  configs: {} as Record<string, ConfigTable>,
  keys: CONFIG_KEYS
}

export interface ConfigsPayloadSetConfig {
  key: string,
  val: ConfigTable
}
export interface ConfigsPayloadUpdateConfigs {
  configs: Record<string, ConfigTable>,
}


export const createConfigsSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setConfig: (state, { payload }: PayloadAction<ConfigsPayloadSetConfig>) => {
        state.configs[payload.key] = payload.val
      },
      updateConfigs: (state, { payload }: PayloadAction<ConfigsPayloadUpdateConfigs>) => {
        state.configs = {
          ...state.configs,
          ...payload.configs,
        }
      },
    }
  })

export type ConfigsSlice = ReturnType<typeof createConfigsSlice>;

export type ConfigsActions = ConfigsSlice["actions"];
