import "./ExcalidrawView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw} from "@excalidraw/excalidraw";

interface Props {
  justId: JustId
}
const ExcalidrawView = observer(({justId}: Props) => {
  return (
    <div className="excalidraw-view">
      <Excalidraw
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
      />
    </div>
  )
})

export default ExcalidrawView

