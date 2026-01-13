import "./ExcalidrawView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw} from "@excalidraw/excalidraw";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawView = observer(({justId: _justId}: Props) => {

  const handleChange = (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {

  }
  return (
    <div className="excalidraw-view">
      <Excalidraw
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        onChange={handleChange}
      />
    </div>
  )
})

export default ExcalidrawView

