import './App.css'

import JustLayoutView from "@/app/components/just-layout/ui/JustLayoutView.tsx";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import React, {useEffect} from "react";

import {WinInfo} from "@/app/components/just-layout";
// import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {
  initialLayoutValue,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME,
  ViewId,
  viewMap
} from "@/app/layout/layout.tsx";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {getGridDataKeys, GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import AppListener from "@/app/listeners/AppListener.tsx";
import {observer} from "mobx-react-lite";
import {EXCALIDRAW_DATA_ID, getExcalidrawDataKeys} from "@/app/excalidraw-data/excalidrawData.constants.ts";
import {useExcalidrawDataStore} from "@/app/excalidraw-data/useExcalidrawDataStore.ts";
import KeyDownListener from "@/app/listeners/KeyDownListener.tsx";
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

const App = observer(() => {


  const justLayoutStore = useJustLayoutStore(LAYOUT_ID);

  // const {updateGridData} = useGridDataStore(GRID_DATA_ID)
  // const {updateExcalidrawData} = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)



  useEffect(() => {
    const startWatcher = async () => {
      await window.api.startWatching()
      await window.api.addWatchPath((await getGridDataKeys()).map((justId) => JustUtil.getParamString(justId, 'file')))
      await window.api.addWatchPath((await getExcalidrawDataKeys()).map((justId) => JustUtil.getParamString(justId, 'file')))
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
      {/*<DevTools />*/}
      <AppListener />
      <KeyDownListener />
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-con">
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
})

export default App

