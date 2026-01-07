import { useState } from "react";
import { container } from "@/inversify.config";
import { PAGE_TYPES, PageFactory } from "./page.types";

export const usePageStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<PageFactory>(PAGE_TYPES.PageFactory);
    return factory(id);
  });

  return store;
};