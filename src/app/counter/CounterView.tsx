import React from "react";
import { observer } from "mobx-react-lite";
import {useCounterStore} from "@/app/counter/useCounterStore.tsx";

export const CounterView = observer(() =>{

  const store = useCounterStore("abc")


  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Counter: {store.count}</h2>
      <button onClick={() => store.increment()}>+ 증가</button>
    </div>
  );
});

