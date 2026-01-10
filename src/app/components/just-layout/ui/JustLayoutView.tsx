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
import {APP_STORE_ID} from "@/app/listeners/app.constants.ts";
import {useAppStore} from "@/app/listeners/useAppStore.ts";

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
  const appStore = useAppStore(APP_STORE_ID)

  onLoad(() => {
    justLayoutStore.setLayout(initialValue)
  })

  useEffect(() => {
    if (justLayoutStore.fullScreenBranch === null) {
      window.api.setFullScreen(false).then(() => {
        // document.exitFullscreen()
      })
    }

  }, [justLayoutStore.fullScreenBranch])

  useEffect(() => {
    // const handleKeyDown = (e: KeyboardEvent) => {
    //   e.preventDefault()
    //   if (e.key === 'Escape') {
    //     console.log('key:', e.key)
    //     justLayoutStore.setFullScreenId(null)
    //     if (document.fullscreenElement) {
    //       document.exitFullscreen()
    //     }
    //     // justLayoutStore.setFullScreenId(null)
    //   }
    //
    //   if (e.key === 'F11') {
    //     const newFullScreen = !appStore.isFullScreen
    //     appStore.changeFullScreen(newFullScreen)
    //     if (!newFullScreen) {
    //       justLayoutStore.setFullScreenId(null)
    //       if (document.fullscreenElement) {
    //         document.exitFullscreen()
    //       }
    //     }
    //   }
    //
    // };
    //
    // window.addEventListener('keydown', handleKeyDown);
    // return () => window.removeEventListener('keydown', handleKeyDown);


    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        justLayoutStore.setFullScreenBranch(null)
        document.exitFullscreen()
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [appStore.isFullScreen])

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
