import { useState } from "react";
import { container } from "@/inversify.config";
import { EXCALIDRAW_TYPES, ExcalidrawFactory } from "./excalidraw.types";

export const useExcalidrawStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<ExcalidrawFactory>(EXCALIDRAW_TYPES.ExcalidrawFactory);
    return factory(id);
  });

  return store;
};