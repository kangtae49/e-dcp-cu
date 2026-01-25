import {ExcalidrawStore} from "@/app/excalidraw/excalidraw.store.ts";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";

export type ExcalidrawFactory = (id: string) => ExcalidrawStore;




export interface ExcalidrawState {
  elements: readonly OrderedExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}


