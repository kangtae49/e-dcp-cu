import { useState } from "react";
import { EXCALIDRAW_TYPES } from "./excalidraw.constants.ts";
import { ExcalidrawFactory } from "./excalidraw.types";
import {useInjection} from "inversify-react";

export const useExcalidrawStore = (id: string) => {
  const factory = useInjection<ExcalidrawFactory>(EXCALIDRAW_TYPES.ExcalidrawFactory);
  const [store] = useState(() => {
    return factory(id);
  });

  return store;
};