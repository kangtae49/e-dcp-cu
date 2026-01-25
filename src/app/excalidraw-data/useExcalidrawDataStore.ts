import { useState } from "react";
import type { ExcalidrawDataFactory } from "./excalidrawData.types";
import { EXCALIDRAW_DATA_TYPES } from "./excalidrawData.constants";
import {useInjection} from "inversify-react";

export const useExcalidrawDataStore = (id: string) => {
  const factory = useInjection<ExcalidrawDataFactory>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataFactory);
  const [store] = useState(() => {
    return factory(id);
  });

  return store;
};