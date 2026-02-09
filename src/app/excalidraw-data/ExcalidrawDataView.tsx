import "./ExcalidrawDataView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {Excalidraw, MainMenu} from "@excalidraw/excalidraw";
import {useExcalidrawDataStore} from "./useExcalidrawDataStore.ts";
import {EXCALIDRAW_DATA_ID} from "./excalidrawData.constants.ts";
import {useEffect, useRef} from "react";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import {ExcalidrawImperativeAPI} from "@excalidraw/excalidraw/types";
import {JustId, JustUtil, useJustLayoutStore} from "@kangtae49/just-layout";
import {LAYOUT_ID} from "@/app/layout/layout.tsx";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawDataView = observer(({justId, layoutId}: Props) => {
  const layoutFullScreenId = `${LAYOUT_ID}_FULLSCREEN`
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  const justLayoutStore = useJustLayoutStore(layoutId);
  const justLayoutFullScreenStore = useJustLayoutStore(layoutFullScreenId)
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  const dataKey = JustUtil.getParamString(justId, 'file') ?? '';


  const fullScreenWin = async () => {
    if (justLayoutFullScreenStore.layout === null) {
      const branch = justLayoutStore.getBranchByJustId({justId})
      if (branch) {
        const justNode = justLayoutStore.getNodeAtBranch({branch})
        justLayoutFullScreenStore.setLayout(justNode)
        justLayoutFullScreenStore.setHideTitle(false)
      }
    } else {
      justLayoutFullScreenStore.setLayout(null)
      justLayoutFullScreenStore.setHideTitle(false)
    }
  }

  useEffect(() => {
    if (!excalidrawRef.current) return;
    if (!excalidrawDataStore.excalidrawDataMap[dataKey]) return;
    excalidrawRef.current.updateScene(excalidrawDataStore.excalidrawDataMap[dataKey].data)
  }, [excalidrawDataStore.excalidrawDataMap[dataKey]?.data])

  return (
    <div className="excalidraw-view">
      <Excalidraw
        excalidrawAPI={(api) => {excalidrawRef.current = api}}
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        initialData={excalidrawDataStore.excalidrawDataMap[dataKey]?.data}
      >
        <MainMenu>
          <MainMenu.Item onSelect={fullScreenWin}>
            <Icon icon={faExpand} /> {justLayoutFullScreenStore.layout !== null ? 'F11' : 'Full'}
          </MainMenu.Item>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveToActiveFile />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />

        </MainMenu>

      </Excalidraw>
    </div>
  )
})

export default ExcalidrawDataView

