import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { CounterStore } from "./counter.store";
import {container} from "@/core/container.ts";
import {COUNTER_TYPES} from "@/app/counter/counter.types.ts";
import {StoreFactory} from "@/app/counter/counter.module.ts";

export const CounterView = observer(() =>{
  // const [store] = useState(() => container.get<CounterStore>(COUNTER_TYPES.CounterStore));
  const [store] = useState(() => {
    const factory = container.get<StoreFactory>(COUNTER_TYPES.CounterFactory);
    return factory("abc");
  });


  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Counter: {store.count}</h2>
      <button onClick={() => store.increment()}>+ 증가</button>
      {/*<button onClick={() => store.decrement()}>- 감소</button>*/}
    </div>
  );
});

