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
import {
  initialLayoutValue,
  JustUtil,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME,
  ViewId,
  viewMap
} from "@/app/layout/layout-util.tsx";
import {WinInfo} from "@/app/components/just-layout";
import {removeReducer} from "@/store";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import useConfigs from "@/app/config/useConfigs.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";


function getWinInfo(justId: JustId): WinInfo {
  const viewId = justId.viewId as ViewId;
  return viewMap[viewId](justId)
}

function App() {

  const {toggleWin} = useJustLayout(LAYOUT_ID);

  const {updateConfigs} = useConfigs(CONFIG_ID)

  useEffect(() => {
    CONFIG_KEYS.forEach((justId: JustId) => {
      const file: string = JustUtil.getParamString(justId, 'file');
      window.api.readDataExcel(file)
        .then(res => {
          updateConfigs({
            [res.key]: res
          })
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

