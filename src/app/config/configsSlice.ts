import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {ConfigTable} from "@/types.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";

export const CONFIG_ID = "CONFIGS"



export interface ConfigsState {
  configs: Record<string, ConfigTable>
  keys: JustId[]
}

export const CONFIG_KEYS: JustId[] = [
  {viewId: "setting-config", params: {title: "업체명", file: "data\\company.xlsx"}}
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
