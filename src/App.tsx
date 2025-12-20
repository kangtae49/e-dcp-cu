import './App.css'

import JustLayoutView from "@/app/components/just-layout/ui/JustLayoutView.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {
  CONFIG_ID,
  CONFIG_KEYS,
} from "@/app/config/configsSlice";
import React, {useEffect} from "react";
import {initialLayoutValue, LAYOUT_ID, SIDE_MENU_NODE_NAME, ViewId, viewMap} from "@/app/layout/layout-util.tsx";
import {WinInfo, WinObj, WinObjId} from "@/app/components/just-layout";
import {removeReducer} from "@/store";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import useConfigs from "@/app/config/useConfigs.ts";


function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}

function App() {

  const {toggleWin} = useJustLayout(LAYOUT_ID);

  const {updateConfigs} = useConfigs(CONFIG_ID)

  useEffect(() => {
    CONFIG_KEYS.forEach((winObjId: WinObjId<ViewId>) => {
      const file: string = WinObj.getParamString(winObjId, 'file');
      window.api.readDataExcel(file)
        .then(res => {
          updateConfigs({
            [res.key]: res
          })
        })
    })

  }, [])

  const closeWin = (winId: string) => {
    console.log('closeWin!!!', winId)
    removeReducer(winId)
  }
  const onClickTitle = (e: React.MouseEvent, winId: string) => {
    console.log(e, winId)
  }
  const onDoubleClickTitle = (e: React.MouseEvent, winId: string) => {
    console.log(e, winId)
    toggleWin(SIDE_MENU_NODE_NAME)
  }

  return (
    <>
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-container">
          <JustToolBar />
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

