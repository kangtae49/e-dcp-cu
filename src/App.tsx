import './App.css'
import "@kangtae49/just-layout/style.css"
import React, {useEffect} from "react";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {
  initialLayoutValue,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME,
  ViewId,
  viewMap
} from "@/app/layout/layout.tsx";
import AppListener from "@/app/listeners/AppListener.tsx";
import {observer} from "mobx-react-lite";
import KeyDownListener from "@/app/listeners/KeyDownListener.tsx";
import pathUtils from "@/utils/pathUtils.ts";
import {GRID_DATA_KEYS} from "@/app/grid-data/gridData.constants.ts";
import {EXCALIDRAW_DATA_KEYS} from "@/app/excalidraw-data/excalidrawData.constants.ts";
import {JustId, JustLayoutView, JustUtil, useJustLayoutStore, WinInfo} from "@kangtae49/just-layout";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

function getWinInfo(justId: JustId): WinInfo {
  const viewId = justId.viewId as ViewId;
  return viewMap[viewId]
}

const App = observer(() => {


  const justLayoutStore = useJustLayoutStore(LAYOUT_ID);

  useEffect(() => {
    const startWatcher = async () => {
      await window.api.startWatching()

      await window.api.addWatchPath(GRID_DATA_KEYS.map((justId) => JustUtil.getParamString(justId, 'file')!))
      await window.api.addWatchPath(GRID_DATA_KEYS.map((justId) => pathUtils.getLockFile(JustUtil.getParamString(justId, 'file')!)))

      await window.api.addWatchPath(EXCALIDRAW_DATA_KEYS.map((justId) => JustUtil.getParamString(justId, 'file')!))
    }
    startWatcher()

    window.api.onSuspend((event) => {
      console.log('onSuspend', event)
    })


    // CONFIG_KEYS.forEach((justId: JustId) => {
    //   const file: string = JustUtil.getParamString(justId, 'file');
    //   window.api.readDataExcel(file)
    //     .then(gridData => {
    //       if (gridData) {
    //         updateGridData(gridData)
    //       }
    //     })
    // })
    // EXCALIDRAW_DATA_KEYS.forEach((justId: JustId) => {
    //   const file: string = JustUtil.getParamString(justId, 'file');
    //   window.api.readDataExcalidraw(file)
    //     .then(excalidrawData => {
    //       if (excalidrawData) {
    //         updateExcalidrawData(excalidrawData)
    //       }
    //     })
    // })
    return () => {
      window.api.stopWatching()
    }

  }, [])

  const closeWin = (justId: JustId) => {
    console.log('closeWin!!!', justId)
  }
  const onClickTitle = (_e: React.MouseEvent, _justId: JustId) => {
  }
  const onDoubleClickTitle = (_e: React.MouseEvent, _justId: JustId) => {
    justLayoutStore.toggleWin({nodeName: SIDE_MENU_NODE_NAME})
  }

  return (
    <>
      <AppListener />
      <KeyDownListener />
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-con">
          <DndProvider backend={ HTML5Backend }>
          <JustLayoutView
            layoutId={LAYOUT_ID}
            getWinInfo={getWinInfo}
            initialValue={initialLayoutValue}
          />
          </DndProvider>
        </div>
      </div>
    </>
  )
})

export default App

