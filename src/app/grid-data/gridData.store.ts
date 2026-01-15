import {inject, injectable} from "inversify";
import {makeAutoObservable} from "mobx";
import {GRID_DATA_TYPES, GridData, GridDataMap} from "@/app/grid-data/gridData.types.ts";
import {GridDataService} from "@/app/grid-data/gridData.service.ts";
import {CounterService} from "@/app/counter/counter.service.ts";

export interface GridDataPlayloadIsLocked {
  key: string
  isLocked: boolean
}

@injectable()
export class GridDataStore {
  service: CounterService;
  gridDataMap: GridDataMap = {}

  constructor(
    @inject(GRID_DATA_TYPES.GridDataService) service: GridDataService
  ) {
    makeAutoObservable(this, {service: false}, { autoBind: true })
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
    const existing = this.gridDataMap[payload.path] || {};
    const newGridData: GridData = {
      ...existing,
      data: payload.data,
      header: payload.header,
      timestamp: payload.timestamp,
    }

    this.gridDataMap = {
      ...this.gridDataMap,
      [payload.path]: newGridData
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