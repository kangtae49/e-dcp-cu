import "./ExcalidrawDataView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw, MainMenu, restore} from "@excalidraw/excalidraw";
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {useExcalidrawDataStore} from "./useExcalidrawDataStore.ts";
import {EXCALIDRAW_DATA_ID} from "./excalidrawData.constants.ts";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {useEffect, useMemo, useState} from "react";
import {toJS} from "mobx";
import {restoreAppState} from "@excalidraw/excalidraw";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawDataView = observer(({justId, layoutId}: Props) => {
  console.log('file', justId.params?.file)
  const justLayoutStore = useJustLayoutStore(layoutId);
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  const dataKey = JustUtil.getParamString(justId, 'file');


  const [isFullScreen, setIsFullScreen] = useState(false)


  const changeFullScreen = async () => {
    setIsFullScreen(await window.api.isFullScreen())
  }
  changeFullScreen()


  const filterAppState = (appState: AppState): AppState => {
    if (!appState) {
      return restoreAppState({}, null) as AppState
    }
    return restoreAppState({
      toast: appState.toast,
      fileHandle: appState.fileHandle,
      viewBackgroundColor: appState.viewBackgroundColor,
      theme: appState.theme,
      scrollX: appState.scrollX,
      scrollY: appState.scrollY,
      zoom: appState.zoom,
      gridSize: appState.gridSize,
      currentItemStrokeColor: appState.currentItemStrokeColor,
      currentItemFillStyle: appState.currentItemFillStyle,
      currentItemFontSize: appState.currentItemFontSize,
    }, null) as AppState
  }

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

  // const handleChange = async (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
  //   if (!appState) return;
  //   if (appState.openMenu) {
  //     await changeFullScreen()
  //   }
  //   // console.log('appState', appState)
  //   const strState = JSON.stringify(toJS({elements, appState: filterAppState(appState), files}))
  //   const strStoreState = JSON.stringify(toJS({elements: excalidrawStore.elements, appState: filterAppState(excalidrawStore.appState), files: excalidrawStore.files}))
  //
  //   if (strState === strStoreState) return;
  //   console.log("handleChange", elements, appState, files)
  //   excalidrawStore.setState({elements, appState: filterAppState(appState), files})
  // }
  return (
    <div className="excalidraw-view">
      <Excalidraw
        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        initialData={excalidrawDataStore.excalidrawDataMap[dataKey].data}
        // onChange={handleChange}
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

