import { injectable, inject } from "inversify";
import {EXCALIDRAW_DATA_TYPES, ExcalidrawData, ExcalidrawDataMap} from "./excalidrawData.types";
import { ExcalidrawDataService } from "./excalidrawData.service.ts";
import {makeAutoObservable} from "mobx";
import {GridDataPlayloadIsLocked} from "@/app/grid-data/gridData.store.ts";

@injectable()
export class ExcalidrawDataStore {
  service: ExcalidrawDataService;
  excalidrawDataMap: ExcalidrawDataMap = {}

  constructor(
    @inject(EXCALIDRAW_DATA_TYPES.ExcalidrawDataService) service: ExcalidrawDataService
  ) {
    this.service = service;

    makeAutoObservable(this, {
      service: false
    }, { autoBind: true });
  }

  updateExcalidrawData = (payload: ExcalidrawData) => {
    const existing = this.excalidrawDataMap[payload.path] || {};
    const newExcalidrawData: ExcalidrawData = {
      ...existing,
      data: payload.data,
      timestamp: payload.timestamp,
    }

    this.excalidrawDataMap = {
      ...this.excalidrawDataMap,
      [payload.path]: newExcalidrawData
    }
  }

  updateIsLocked = (payload: GridDataPlayloadIsLocked) => {
    const existing = this.excalidrawDataMap[payload.key] || {};
    const newExcalidrawData: ExcalidrawData = {
      ...existing,
      isLocked: payload.isLocked
    }

    this.excalidrawDataMap = {
      ...this.excalidrawDataMap,
      [payload.key]: newExcalidrawData
    }
  }
}