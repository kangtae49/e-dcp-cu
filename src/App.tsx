import './App.css'

import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {useDynamicSlice} from "@/store/hooks";
import {
  CONFIG_ID,
  CONFIG_KEYS,
  type ConfigsActions,
  type ConfigsSlice,
  createConfigsSlice
} from "@/app/config/configsSlice";
import {useEffect} from "react";
import {initialLayoutValue, ViewId, viewMap} from "@/utils/layout-util.tsx";
import {WinInfo, WinObj, WinObjId} from "@/app/just-layout";
import {removeReducer} from "@/store";


function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}

function App() {
  const {
    actions: configsActions, dispatch
  } = useDynamicSlice<ConfigsSlice, ConfigsActions>(CONFIG_ID, createConfigsSlice)


  useEffect(() => {
    CONFIG_KEYS.forEach((winObjId: WinObjId) => {
      const file: string = WinObj.getParamString(winObjId, 'file');
      window.api.readDataExcel(file)
        .then(res => {
          dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
        })
    })

  }, [configsActions, dispatch])

  const closeWin = (winId: string) => {
    console.log('closeWin!!!', winId)
    removeReducer(winId)
  }

  return (
    <>
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-container">
          <JustToolBar />
          <JustLayoutView getWinInfo={getWinInfo} closeWin={closeWin} initialValue={initialLayoutValue} />
        </div>
      </div>
    </>
  )
}

export default App

