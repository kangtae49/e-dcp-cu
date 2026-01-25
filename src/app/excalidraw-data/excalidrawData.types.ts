import {ExcalidrawDataStore} from "./excalidrawData.store.ts";
import type {ExcalidrawState} from "@/app/excalidraw/excalidraw.types.ts";

export type ExcalidrawDataFactory = (id: string) => ExcalidrawDataStore;



export interface ExcalidrawData {
  path: string,
  timestamp?: number,
  isLocked?: boolean,
  data: ExcalidrawState

}
export type ExcalidrawDataMap = Record<string, ExcalidrawData>

