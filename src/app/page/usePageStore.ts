import { useState } from "react";
import { PageFactory } from "./page.types";
import { PAGE_TYPES } from "./page.constants.ts";
import {useInjection} from "inversify-react";

export const usePageStore = (id: string) => {
  const factory = useInjection<PageFactory>(PAGE_TYPES.PageFactory);
  const [store] = useState(() => {
    return factory(id);
  });

  return store;
};