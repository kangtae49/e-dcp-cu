import {ExcalidrawDataStore} from "./excalidrawData.store.ts";
import {ExcalidrawState} from "@/app/excalidraw/excalidraw.types.ts";

export type ExcalidrawDataFactory = (id: string) => ExcalidrawDataStore;

export const EXCALIDRAW_DATA_TYPES = {
  ExcalidrawDataService: Symbol.for("ExcalidrawDataService"),
  ExcalidrawDataStore: Symbol.for("ExcalidrawDataStore"),
  ExcalidrawDataFactory: Symbol.for("ExcalidrawDataFactory"),
};

export interface ExcalidrawData {
  path: string,
  timestamp?: number,
  isLocked?: boolean,
  data: ExcalidrawState

}
export type ExcalidrawDataMap = Record<string, ExcalidrawData>

