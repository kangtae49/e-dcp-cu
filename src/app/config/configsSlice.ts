import {createSlice} from "@reduxjs/toolkit";
import {type WinObjId} from "@/App";
import {ConfigTable} from "@/types";

export const CONFIG_ID = "CONFIGS"



export interface ConfigsState {
  configs: Record<string, ConfigTable>
  keys: WinObjId[]
}

export const CONFIG_KEYS: WinObjId[] = [
  { viewId: "setting-config", params: {"title": "업체명", "file": "data\\company.xlsx"}}
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
      setConfig: (state, { payload }: {payload: ConfigsPayloadSetConfig}) => {
        state.configs[payload.key] = payload.val
      },
      updateConfigs: (state, { payload }: {payload: ConfigsPayloadUpdateConfigs}) => {
        state.configs = {
          ...state.configs,
          ...payload.configs,
        }
      },
    }
  })

export type ConfigsSlice = ReturnType<typeof createConfigsSlice>;

export type ConfigsActions = ConfigsSlice["actions"];
