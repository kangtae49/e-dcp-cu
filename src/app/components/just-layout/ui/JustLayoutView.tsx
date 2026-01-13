import "./JustLayoutView.css"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import useOnload from "@/hooks/useOnload.ts";
import JustNodeView from "./JustNodeView.tsx";
import classNames from "classnames";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {JustNode} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";

interface Props {
  layoutId: string
  getWinInfo: GetWinInfoFn
  initialValue: JustNode
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}



const JustLayoutView = observer(({layoutId, getWinInfo, initialValue, closeWin, onClickTitle, onDoubleClickTitle}: Props) => {
  const {onLoad} = useOnload();
  const layoutFullScreenId = `${layoutId}_FULLSCREEN`
  const justLayoutStore = useJustLayoutStore(layoutId)
  const justLayoutFullScreenStore = useJustLayoutStore(layoutFullScreenId)

  onLoad(() => {
    justLayoutStore.setLayout(initialValue)
    justLayoutStore.setFullScreenLayoutByBranch(null)
    justLayoutFullScreenStore.setLayout(null)
  })

  useEffect(() => {
    const removeFullScreen = window.api.onChangeFullScreen((_event, flag) => {
    })
    const removeMaximize = window.api.onChangeMaximize((_event, flag) => {
    })

    const handleFullScreenChange = () => {
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('esc')
        justLayoutStore.setFullScreenLayoutByBranch(null)
      } else if (e.key === 'F11') {
        console.log('F11')
        if (justLayoutStore.fullScreenLayout !== null) {
          justLayoutStore.setFullScreenLayoutByBranch(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      removeFullScreen()
      removeMaximize()
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }
  }, [])


  useEffect(() => {
    console.log('useEffect justLayoutFullScreenStore.layout', justLayoutFullScreenStore.layout)
    const isFull = justLayoutFullScreenStore.layout !== null
    console.log('isFull', isFull)
    if (!isFull) {
      justLayoutStore.setFullScreenLayoutByBranch(null)
      justLayoutStore.setFullScreenHideTitle(false)
    }
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

  useEffect(() => {
    console.log('useEffect justLayoutStore.fullScreenLayout', justLayoutStore.fullScreenLayout)
    justLayoutFullScreenStore.setLayout(justLayoutStore.fullScreenLayout)
  }, [justLayoutStore.fullScreenLayout])

  useEffect(() => {
    justLayoutFullScreenStore.setFullScreenHideTitle(justLayoutStore.fullScreenHideTitle)
  }, [justLayoutStore.fullScreenHideTitle])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(
        "just-layout",
        // "thema-dark"
      )}>
        {justLayoutStore.fullScreenLayout === null &&
          <JustNodeView
            key={layoutId}
            layoutId={layoutId}
            isFullScreenView={false}
            hideTitle={justLayoutStore.layout?.hideTitle}
            dndAccept={justLayoutStore.layout?.dndAccept ?? []}
            node={justLayoutStore.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
          />
        }
        {justLayoutStore.fullScreenLayout !== null &&
          <JustNodeView
            key={layoutFullScreenId}
            layoutId={layoutFullScreenId}
            isFullScreenView={true}
            hideTitle={justLayoutStore.layout?.hideTitle}
            dndAccept={justLayoutStore.layout?.dndAccept ?? []}
            node={justLayoutFullScreenStore.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
          />
        }
      </div>
    </DndProvider>
  )
})

export default JustLayoutView
