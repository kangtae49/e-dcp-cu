import {JustId} from "@/app/components/just-layout/justLayout.types.ts";

export const GRID_DATA_ID = "GRID_DATA"


export const getGridDataKeys = async (): Promise<JustId[]> => {
  return [
    {viewId: "grid-data-view", title: "업체명", params: {file: await window.api.getScriptSubPath("data\\company.xlsx")}}
  ]
}