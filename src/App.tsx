import './App.css'
import "@kangtae49/just-layout/style.css"
import React, {useEffect} from "react";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {
  initialLayoutValue,
  LAYOUT_ID,
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
  const layoutId = LAYOUT_ID;
  const layoutFullScreenId = `${LAYOUT_ID}_FULLSCREEN`

  const justLayoutStore = useJustLayoutStore(layoutId)
  const justLayoutFullScreenStore = useJustLayoutStore(layoutFullScreenId)

  useEffect(() => {
    justLayoutStore.setLayout(initialLayoutValue)
  }, [])

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


  useEffect(() => {
    // const removeFullScreen = window.api.onChangeFullScreen((_event, _flag) => {
    // })
    // const removeMaximize = window.api.onChangeMaximize((_event, _flag) => {
    // })

    const handleFullScreenChange = () => {
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        justLayoutFullScreenStore.setLayout(null)
        justLayoutFullScreenStore.setHideTitle(false)
      }
      // else if (e.key === 'F11') {
      // }
      if (e.altKey) {
        if (e.key === 'ArrowRight') {
          if (justLayoutFullScreenStore.layout !== null) {
            justLayoutFullScreenStore.activeNextWin()
          } else {
            justLayoutStore.activeNextWin()
          }
        } else if (e.key === 'ArrowLeft') {
          if (justLayoutFullScreenStore.layout !== null) {
            justLayoutFullScreenStore.activePrevWin()
          } else {
            justLayoutStore.activePrevWin()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      // removeFullScreen()
      // removeMaximize()
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }
  }, [])


  useEffect(() => {
    console.log('useEffect justLayoutFullScreenStore.layout', justLayoutFullScreenStore.layout)
    const isFull = justLayoutFullScreenStore.layout !== null
    console.log('isFull', isFull)
    const changeScreen = async (isFull: boolean) => {
      const isFullScreen = await window.api.isFullScreen()
      if (isFullScreen !== isFull) {
        await window.api.setFullScreen(isFull)
      }

      const isMaximized = await window.api.isMaximized();
      if (isMaximized !== isFull) {
        if (isFull) {
          window.api.maximize()
        } else {
          window.api.unmaximize()
        }
      }
    }
    changeScreen(isFull)
  }, [justLayoutFullScreenStore.layout])

  return (
    <>
      <AppListener />
      <KeyDownListener />
      <JobListener />
      <WatchListener />
      <div className="just-app">
        <div className="just-con">
          <DndProvider backend={ HTML5Backend }>
            {justLayoutFullScreenStore.layout === null &&
              <JustLayoutView
                layoutId={layoutId}
                getWinInfo={getWinInfo}
              />
            }
            {justLayoutFullScreenStore.layout !== null &&
              <JustLayoutView
                  layoutId={layoutFullScreenId}
                  getWinInfo={getWinInfo}
              />
            }
          </DndProvider>
        </div>
      </div>
    </>
  )
})

export default App

