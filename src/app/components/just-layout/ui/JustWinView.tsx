import JustWinTitleView from "./JustWinTitleView.tsx";
import JustWinBodyView from "./JustWinBodyView.tsx";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {JustBranch, JustStack} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";

interface Prop {
  layoutId: string
  isFullScreenView: boolean
  hideTitle?: boolean
  dndAccept: string[]
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

const JustWinView = observer(({layoutId, isFullScreenView, hideTitle, dndAccept, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) => {
  const justLayoutStore = useJustLayoutStore(layoutId)
  const fullScreenHideTitle = justLayoutStore.fullScreenHideTitle;

  const showTitle = hideTitle !== true
  const onFocus = () => {
    if (justStack.active) {
      justLayoutStore.activeWin({justId: justStack.active})
    }
  }
  return (
    <div className="just-win" onFocusCapture={onFocus} tabIndex={1}>
      {(showTitle && !fullScreenHideTitle)  &&
        <JustWinTitleView
          layoutId={layoutId}
          isFullScreenView={isFullScreenView}
          dndAccept={dndAccept}
          justBranch={justBranch}
          justStack={justStack}
          getWinInfo={getWinInfo}
          closeWin={closeWin}
          onClickTitle={onClickTitle}
          onDoubleClickTitle={onDoubleClickTitle}
        />
      }
      <JustWinBodyView
        layoutId={layoutId}
        dndAccept={dndAccept}
        justBranch={justBranch}
        justStack={justStack}
        getWinInfo={getWinInfo}
      />
    </div>
  )
})

export default JustWinView
