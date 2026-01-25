import pathUtils from "@/utils/pathUtils.ts";
import {JustId} from "@kangtae49/just-layout";

export const GRID_DATA_TYPES = {
  GridDataService: Symbol.for("GridDataService"),
  GridDataStore: Symbol.for("GridDataStore"),
  GridDataStoreCacheMap: Symbol.for("GridDataStoreCacheMap"),
  GridDataFactory: Symbol.for("GridDataFactory"),
}

export const GRID_DATA_ID = "GRID_DATA"

export const GRID_DATA_KEYS: JustId [] = [
  {viewId: "grid-data-view", title: "업체명", params: {file: pathUtils.getScriptSubPath("data\\company.xlsx")}}
]

