import {ExcalidrawStore} from "@/app/excalidraw/excalidraw.store.ts";

export type ExcalidrawFactory = (id: string) => ExcalidrawStore;

export const EXCALIDRAW_TYPES = {
  ExcalidrawService: Symbol.for("ExcalidrawService"),
  ExcalidrawStore: Symbol.for("ExcalidrawStore"),
  ExcalidrawFactory: Symbol.for("ExcalidrawFactory"),
};