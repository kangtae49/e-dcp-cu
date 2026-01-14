import { injectable, inject } from "inversify";
import {EXCALIDRAW_TYPES} from "./excalidraw.types";
import { ExcalidrawService } from "./excalidraw.service";
import {makeAutoObservable} from "mobx";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";

@injectable()
export class ExcalidrawStore {
  service: ExcalidrawService;

  elements: readonly OrderedExcalidrawElement[]
  appState: AppState
  files: BinaryFiles

  constructor(
    @inject(EXCALIDRAW_TYPES.ExcalidrawService) service: ExcalidrawService
  ) {
    this.service = service;

    makeAutoObservable(this, {
      service: false
    }, { autoBind: true });
  }

  setState = (payload: {elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles}) => {
    this.elements = payload.elements
    this.appState = payload.appState
    this.files = payload.files
  }

}