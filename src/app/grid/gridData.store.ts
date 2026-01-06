import {injectable} from "inversify";
import {makeAutoObservable} from "mobx";
import {GridData, GridDataMap} from "@/app/grid/gridData.types.ts";

export interface GridDataPlayloadIsLocked {
  key: string
  isLocked: boolean
}

@injectable()
export class GridDataStore {
  gridDataMap: GridDataMap = {}

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setGridDataMap = (payload: GridDataMap) => {
    this.gridDataMap = payload
  }

  updateGridDataMap = (payload: GridDataMap) => {

    this.gridDataMap = {
    ...this.gridDataMap,
    ...payload,
    }
  }

  updateGridData = (payload: GridData) =>  {
    const existing = this.gridDataMap[payload.key] || {};
    const newGridData: GridData = {
      ...existing,
      data: payload.data,
      header: payload.header,
      timestamp: payload.timestamp,
    }

    this.gridDataMap = {
      ...this.gridDataMap,
      [payload.key]: newGridData
    }
  }

  updateIsLocked = (payload: GridDataPlayloadIsLocked) => {
    const existing = this.gridDataMap[payload.key] || {};
    const newGridData: GridData = {
      ...existing,
      isLocked: payload.isLocked
    }

    this.gridDataMap = {
      ...this.gridDataMap,
      [payload.key]: newGridData
    }
  }

}