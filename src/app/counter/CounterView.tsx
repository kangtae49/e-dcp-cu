import React from "react";
import { observer } from "mobx-react-lite";
import {useCounterStore} from "@/app/counter/useCounterStore.tsx";
import {useAppStore} from "@/app/listeners/useAppStore.ts";
import {APP_STORE_ID} from "@/app/listeners/app.constants.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {LAYOUT_ID} from "@/app/layout/layout.tsx";

interface Props {
  justId: JustId
}
export const CounterView = observer(({justId: _}: Props) => {

  const counterStore = useCounterStore("abc")
  const appStore = useAppStore(APP_STORE_ID)
  // const layoutStore = useJustLayoutStore(LAYOUT_ID)

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Counter: {counterStore.count}</h2>
      <button onClick={() => counterStore.increment()}>+</button>
      <div>isFullScreen: {appStore.isFullScreen ? 'true' : 'false'}</div>
      {/*<button onClick={() => layoutStore.setFullScreenId(justId)}>setFullScreen(true)</button>*/}
      {/*<button onClick={() => layoutStore.setFullScreenId(null)}>setFullScreen(false)</button>*/}
      {/*<button onClick={() => window.api.setFullScreen(true)}>setFullScreen(true)</button>*/}
      {/*<button onClick={() => window.api.setFullScreen(false)}>setFullScreen(false)</button>*/}
    </div>
  );
});

