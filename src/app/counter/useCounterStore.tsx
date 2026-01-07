import { useState } from "react";
import { container } from "@/inversify.config";
import { COUNTER_TYPES, CounterFactory } from "./counter.types";
// import { CounterStore } from "./counter.store";

export const useCounterStore = (id: string) => {
  const [store] = useState(() => {
    const factory = container.get<CounterFactory>(COUNTER_TYPES.CounterFactory);
    return factory(id);
  });

  return store;
};