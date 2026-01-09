import { useState } from "react";
import { container } from "@/inversify.config";
import { APP_TYPES, AppFactory } from "./app.types";

export const useAppStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<AppFactory>(APP_TYPES.AppFactory);
    return factory(id);
  });

  return store;
};