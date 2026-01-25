import { useState } from "react";
import { CounterFactory } from "./counter.types";
import { COUNTER_TYPES } from "./counter.constants.ts";
import {useInjection} from "inversify-react";

export const useCounterStore = (id: string) => {
  const factory = useInjection<CounterFactory>(COUNTER_TYPES.CounterFactory);
  const [store] = useState(() => {
    return factory(id);
  });

  return store;
};