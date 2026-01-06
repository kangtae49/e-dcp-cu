import {CounterStore} from "@/app/counter/counter.store.ts";

export type StoreFactory = (id: string) => CounterStore;

export const COUNTER_TYPES = {
  CounterService: Symbol.for("CounterService"),
  CounterStore: Symbol.for("CounterStore"),
  CounterFactory: Symbol.for("CounterFactory"),
};