import {ExcalidrawStore} from "@/app/excalidraw/excalidraw.store.ts";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";

export type ExcalidrawFactory = (id: string) => ExcalidrawStore;

export const EXCALIDRAW_TYPES = {
  ExcalidrawService: Symbol.for("ExcalidrawService"),
  ExcalidrawStore: Symbol.for("ExcalidrawStore"),
  ExcalidrawFactory: Symbol.for("ExcalidrawFactory"),
};


export interface ExcalidrawState {
  elements: readonly OrderedExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}


