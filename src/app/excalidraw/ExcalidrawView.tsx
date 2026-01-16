import "./ExcalidrawView.css"
import "@excalidraw/excalidraw/index.css";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {Excalidraw, MainMenu} from "@excalidraw/excalidraw";
import {AppState, BinaryFiles, ExcalidrawImperativeAPI} from "@excalidraw/excalidraw/types";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import {useExcalidrawStore} from "@/app/excalidraw/useExcalidrawStore.ts";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {toJS} from "mobx";
import {restoreAppState} from "@excalidraw/excalidraw";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import {FileItem} from "@/types.ts";
import {useExcalidrawDataStore} from "@/app/excalidraw-data/useExcalidrawDataStore.ts";
import {EXCALIDRAW_DATA_ID} from "@/app/excalidraw-data/excalidrawData.constants.ts";

interface Props {
  justId: JustId
  layoutId: string
}
const ExcalidrawView = observer(({justId, layoutId}: Props) => {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  const justLayoutStore = useJustLayoutStore(layoutId);
  const excalidrawStore = useExcalidrawStore(JustUtil.toString(justId))
  const [isFullScreen, setIsFullScreen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [dataKey, setDataKey] = useState<string | null>(null)
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

  const handleChange = async (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    if (!appState) return;
    if (appState.openMenu) {
      await changeFullScreen()
    }
    // console.log('appState', appState)
    const strState = JSON.stringify(toJS({elements, appState: filterAppState(appState), files}))
    const strStoreState = JSON.stringify(toJS({elements: excalidrawStore.elements, appState: filterAppState(excalidrawStore.appState), files: excalidrawStore.files}))
    if (strState === strStoreState) return;
    // if (appState.fileHandle) {
    //   const filePath = window.api.getPathForFile(await appState.fileHandle.getFile())
    //   console.log(filePath)
    // }
    // console.log("handleChange", elements, appState, files)
    excalidrawStore.setState({elements, appState: filterAppState(appState), files})
  }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(_item: FileItem, monitor) {
      const fileItem = monitor.getItem<FileItem>()
      const filePath = window.api.getPathForFile(fileItem.files[0])
      console.log(filePath)
      window.api.addWatchPath([filePath])
      setDataKey(filePath)
    }
  }), [])

  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);

  useEffect(() => {
    if (!excalidrawRef.current) return;
    if (dataKey === null) return;
    if (!excalidrawDataStore.excalidrawDataMap[dataKey]) return;
    excalidrawRef.current.updateScene(excalidrawDataStore.excalidrawDataMap[dataKey].data)
  }, [excalidrawDataStore.excalidrawDataMap?.[dataKey ?? '']])

  return (
    <div className="excalidraw-view" ref={ref}>
      <Excalidraw
        excalidrawAPI={(api) => {excalidrawRef.current = api}}

        UIOptions={{
        //   dockedSidebarBreakpoint: 0
        }}
        initialData={{
          elements: excalidrawStore.elements,
          files: excalidrawStore.files,
          appState: excalidrawStore.appState
        }}
        onChange={handleChange}
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

export default ExcalidrawView

