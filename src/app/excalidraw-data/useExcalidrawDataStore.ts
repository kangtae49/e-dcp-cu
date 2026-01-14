import { useState } from "react";
import { container } from "@/inversify.config";
import { EXCALIDRAW_DATA_TYPES, ExcalidrawDataFactory } from "./excalidrawData.types";

export const useExcalidrawDataStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<ExcalidrawDataFactory>(EXCALIDRAW_DATA_TYPES.ExcalidrawDataFactory);
    return factory(id);
  });

  return store;
};