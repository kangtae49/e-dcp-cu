import {JustId} from "@/app/components/just-layout/justLayout.types.ts";

export const EXCALIDRAW_DATA_ID = "EXCALIDRAW_DATA_ID"

// export const EXCALIDRAW_DATA_KEYS: JustId [] = [
//   {viewId: "excalidraw-data-view", title: "Help", params: {file: await window.api.getScriptSubPath("data\\help.excalidraw")}}
// ]

export const getExcalidrawDataKeys = async (): Promise<JustId []> => {
  return [
    {viewId: "excalidraw-data-view", title: "Help", params: {file: await window.api.getScriptSubPath("data\\help.excalidraw")}}
  ]
}