import './App.css'

import JustLayoutView from "@/app/components/just-layout/ui/JustLayoutView.tsx";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import React, {useEffect} from "react";

import {WinInfo} from "@/app/components/just-layout";
import useGridData from "@/app/grid/useGridData.ts";
import {
  initialLayoutValue,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME,
  ViewId,
  viewMap
} from "@/app/layout/layout.tsx";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {CONFIG_KEYS, GRID_DATA_ID} from "@/app/grid/gridData.constants.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import AppListener from "@/app/listeners/AppListener.tsx";
// import DevTools from 'mobx-react-devtools';

// import remotedev from 'mobx-remotedev';
// import {container} from "@/inversify.config.ts";
// import {JustLayoutStore} from "@/app/components/just-layout/justLayout.store.ts";
// if (process.env.NODE_ENV === 'development') {
//   const hub = {
//     'layout': container.get<JustLayoutStore>(JUST_LAYOUT_TYPES.JustLayoutStore),
//
//   };
//   remotedev(hub, {
//     name: 'Electron_App_All_Stores',
//     remote: true,
//     hostname: 'localhost',
//     port: 8000
//   });
// }

function getWinInfo(justId: JustId): WinInfo {
  const viewId = justId.viewId as ViewId;
  return viewMap[viewId]
}

function App() {


  const justLayoutStore = useJustLayoutStore(LAYOUT_ID);

  const {updateGridData} = useGridData(GRID_DATA_ID)

  useEffect(() => {
    window.api.onSuspend((event) => {
      console.log('onSuspend', event)
    })
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
  }
  const onClickTitle = (e: React.MouseEvent, justId: JustId) => {
  }
  const onDoubleClickTitle = (e: React.MouseEvent, justId: JustId) => {
    justLayoutStore.toggleWin({nodeName: SIDE_MENU_NODE_NAME})
  }

  return (
    <>
      {/*<DevTools />*/}
      <AppListener />
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

