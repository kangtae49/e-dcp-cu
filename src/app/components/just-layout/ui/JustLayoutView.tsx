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

  const justLayoutStore = useJustLayoutStore(layoutId)

  onLoad(() => {
    justLayoutStore.setLayout(initialValue)
  })


  useEffect(() => {
    const isFullScreen = justLayoutStore.isFullScreen
    console.log('isFullScreen', isFullScreen, 'isMaximize', justLayoutStore.isMaximize, 'justLayoutStore.fullScreenBranch', justLayoutStore.fullScreenBranch, 'document.fullscreenElement', document.fullscreenElement)
    if (isFullScreen) {
      //
    } else {
      justLayoutStore.setFullScreenBranch(null)
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [justLayoutStore.isFullScreen])

  useEffect(() => {
    const removeFullScreen = window.api.onChangeFullScreen((_event, flag) => {
      justLayoutStore.setFullScreen(flag)
    })
    const removeMaximize = window.api.onChangeMaximize((_event, flag) => {
      justLayoutStore.setMaximize(flag)
    })

    const handleFullScreenChange = () => {
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('esc')
        const isMaximized = justLayoutStore.isMaximize;
        const isFullScreen = justLayoutStore.isFullScreen;
        console.log('isFullScreen', isFullScreen, 'isMaximized', isMaximized)
        console.log('isFullScreen', await window.api.isFullScreen(), 'isMaximized', await window.api.isMaximized())
        if (isFullScreen) {
          justLayoutStore.setFullScreenBranch(null)
          window.api.setFullScreen(false)
        } else if (isMaximized) {
          window.api.unmaximize()
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
    console.log('isMaximize', justLayoutStore.isMaximize)
  }, [justLayoutStore.isMaximize])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(
        "just-layout",
        // "thema-dark"
      )}>
        {justLayoutStore && <JustNodeView
            layoutId={layoutId}
            hideTitle={justLayoutStore.layout?.hideTitle}
            dndAccept={justLayoutStore.layout?.dndAccept ?? []}
            node={justLayoutStore.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
        />}
      </div>
    </DndProvider>
  )
})

export default JustLayoutView
