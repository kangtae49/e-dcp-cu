import { useState } from "react";
import { AppFactory } from "./app.types";
import { APP_TYPES } from "./app.constants.ts";
import {useInjection} from "inversify-react";

export const useAppStore = (id: string) => {
  const factory = useInjection<AppFactory>(APP_TYPES.AppFactory);
  const [store] = useState(() => {
    return factory(id);
  });

  return store;
};
