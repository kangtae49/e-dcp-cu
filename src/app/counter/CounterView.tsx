import React from "react";
import { observer } from "mobx-react-lite";
import {useCounterStore} from "@/app/counter/useCounterStore.tsx";
import {JustId} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}
export const CounterView = observer(({justId: _justId}: Props) => {

  const counterStore = useCounterStore("abc")

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Counter: {counterStore.count}</h2>
      <button onClick={() => counterStore.increment()}>+</button>
      {/*<div>isFullScreen: {layoutStore.isFullScreen ? 'true' : 'false'}</div>*/}
      {/*<button onClick={() => layoutStore.setFullScreenId(justId)}>setFullScreen(true)</button>*/}
      {/*<button onClick={() => layoutStore.setFullScreenId(null)}>setFullScreen(false)</button>*/}
      {/*<button onClick={() => window.api.setFullScreen(true)}>setFullScreen(true)</button>*/}
      {/*<button onClick={() => window.api.setFullScreen(false)}>setFullScreen(false)</button>*/}
    </div>
  );
});

