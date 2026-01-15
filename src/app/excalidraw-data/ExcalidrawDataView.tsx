import "./ExcalidrawDataView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw, MainMenu} from "@excalidraw/excalidraw";
import {useExcalidrawDataStore} from "./useExcalidrawDataStore.ts";
import {EXCALIDRAW_DATA_ID} from "./excalidrawData.constants.ts";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {ExcalidrawImperativeAPI} from "@excalidraw/excalidraw/types";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawDataView = observer(({justId, layoutId}: Props) => {
  console.log('file', justId.params?.file)
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  const justLayoutStore = useJustLayoutStore(layoutId);
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  const dataKey = JustUtil.getParamString(justId, 'file');


  const [isFullScreen, setIsFullScreen] = useState(false)


  const changeFullScreen = async () => {
    setIsFullScreen(await window.api.isFullScreen())
  }
  changeFullScreen()




  const fullScreenWin = async () => {
    const isFullScreen = await window.api.isFullScreen()
    if(isFullScreen) {
      justLayoutStore.setLayout(null)
    } else {
      const branch = justLayoutStore.getBranchByJustId({justId})
      if (branch) {
        justLayoutStore.setFullScreenLayoutByBranch(branch)
        justLayoutStore.setFullScreenHideTitle(true)
      }
    }
  }

  useEffect(() => {
    if (!excalidrawRef.current) return;
    excalidrawRef.current.updateScene(excalidrawDataStore.excalidrawDataMap[dataKey].data)
  }, [excalidrawDataStore.excalidrawDataMap[dataKey].data])

  return (
    <div className="excalidraw-view">
      <Excalidraw
        excalidrawAPI={(api) => {excalidrawRef.current = api}}
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        initialData={excalidrawDataStore.excalidrawDataMap[dataKey].data}
      >
        <MainMenu>
          <MainMenu.Item onSelect={fullScreenWin}>
            <Icon icon={faExpand} /> {isFullScreen ? 'F11' : 'Full'}
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

