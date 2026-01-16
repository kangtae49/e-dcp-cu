import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import pathUtils from "@/utils/pathUtils.ts";

export const EXCALIDRAW_DATA_ID = "EXCALIDRAW_DATA_ID"

export const EXCALIDRAW_DATA_KEYS: JustId [] = [
  {viewId: "excalidraw-data-view", title: "Help", params: {file: pathUtils.getScriptSubPath("data\\help.excalidraw")}}
]
