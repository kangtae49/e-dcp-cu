import { useState } from "react";
import { container } from "@/inversify.config";
import { JUST_LAYOUT_TYPES, JustLayoutFactory } from "./justLayout.types";

export const useJustLayoutStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<JustLayoutFactory>(JUST_LAYOUT_TYPES.JustLayoutFactory);
    return factory(id);
  });

  return store;
};