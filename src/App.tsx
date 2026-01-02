import './App.css'

import JustLayoutView from "@/app/components/just-layout/ui/JustLayoutView.tsx";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {
  GRID_DATA_ID,
  CONFIG_KEYS,
} from "@/app/grid/gridDataSlice.ts";
import React, {useEffect} from "react";
// import {
//   initialLayoutValue,
//   JustUtil,
//   LAYOUT_ID,
//   SIDE_MENU_NODE_NAME,
//   ViewId,
//   viewMap
// } from "@/app/layout/layout-util.tsx";
import {WinInfo} from "@/app/components/just-layout";
import {removeReducer} from "@/store";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import useGridData from "@/app/grid/useGridData.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {
  initialLayoutValue,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME,
  ViewId,
  viewMap
} from "@/app/layout/layout.tsx";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";


function getWinInfo(justId: JustId): WinInfo {
  const viewId = justId.viewId as ViewId;
  return viewMap[viewId]
}

function App() {

  const {toggleWin} = useJustLayout(LAYOUT_ID);

  const {updateGridData} = useGridData(GRID_DATA_ID)

  useEffect(() => {
    CONFIG_KEYS.forEach((justId: JustId) => {
      const file: string = JustUtil.getParamString(justId, 'file');
      window.api.readDataExcel(file)
        .then(gridData => {
          if (gridData) {
            updateGridData(gridData)
          }
        })
    })

  }, [])

  const closeWin = (justId: JustId) => {
    console.log('closeWin!!!', justId)
    removeReducer(JustUtil.toString(justId))
  }
  const onClickTitle = (e: React.MouseEvent, justId: JustId) => {
    console.log(e, justId)
  }
  const onDoubleClickTitle = (e: React.MouseEvent, justId: JustId) => {
    console.log(e, justId)
    toggleWin(SIDE_MENU_NODE_NAME)
  }

  return (
    <>
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-container">
          <JustLayoutView
            layoutId={LAYOUT_ID}
            getWinInfo={getWinInfo}
            initialValue={initialLayoutValue}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
          />
        </div>
      </div>
    </>
  )
}

export default App

