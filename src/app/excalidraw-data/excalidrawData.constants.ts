import pathUtils from "@/utils/pathUtils.ts";
import {JustId} from "@kangtae49/just-layout";

export const EXCALIDRAW_DATA_TYPES = {
  ExcalidrawDataService: Symbol.for("ExcalidrawDataService"),
  ExcalidrawDataStore: Symbol.for("ExcalidrawDataStore"),
  ExcalidrawDataStoreCacheMap: Symbol.for("ExcalidrawDataStoreCacheMap"),
  ExcalidrawDataFactory: Symbol.for("ExcalidrawDataFactory"),
};

export const EXCALIDRAW_DATA_ID = "EXCALIDRAW_DATA_ID"

export const EXCALIDRAW_DATA_KEYS: JustId [] = [
  {viewId: "excalidraw-data-view", title: "Help", params: {file: pathUtils.getScriptSubPath("data\\help.excalidraw")}}
]
