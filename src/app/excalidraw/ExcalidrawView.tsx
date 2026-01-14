import "./ExcalidrawView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw, restore} from "@excalidraw/excalidraw";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {useExcalidrawStore} from "@/app/excalidraw/useExcalidrawStore.ts";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {useEffect, useMemo} from "react";
import {toJS} from "mobx";
import {restoreAppState} from "@excalidraw/excalidraw";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawView = observer(({justId: justId}: Props) => {

  const excalidrawStore = useExcalidrawStore(JustUtil.toString(justId))

  useEffect(() => {
    console.log("useEffect")
    return () => {
      console.log("useEffect return")
    }
  }, []);

  const handleChange = (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {

    const strState = JSON.stringify(toJS({elements, files}))
    const strStoreState = JSON.stringify(toJS({elements: excalidrawStore.elements, files: excalidrawStore.files}))

    if (strState === strStoreState) return;
    console.log("handleChange", elements, appState, files)
    excalidrawStore.setState({elements, appState: {} as AppState, files})
  }
  return (
    <div className="excalidraw-view">
      <Excalidraw
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        initialData={{
          elements: excalidrawStore.elements,
          files: excalidrawStore.files,
          appState: excalidrawStore.appState
        }}
        onChange={handleChange}
      />
    </div>
  )
})

export default ExcalidrawView

