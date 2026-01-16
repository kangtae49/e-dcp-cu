import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import pathUtils from "@/utils/pathUtils.ts";

export const GRID_DATA_ID = "GRID_DATA"

export const GRID_DATA_KEYS: JustId [] = [
  {viewId: "grid-data-view", title: "업체명", params: {file: pathUtils.getScriptSubPath("data\\company.xlsx")}}
]

