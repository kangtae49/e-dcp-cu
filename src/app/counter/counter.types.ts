import {CounterStore} from "@/app/counter/counter.store.ts";

export type CounterFactory = (id: string) => CounterStore;

