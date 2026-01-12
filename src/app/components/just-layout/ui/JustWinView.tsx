import JustWinTitleView from "./JustWinTitleView.tsx";
import JustWinBodyView from "./JustWinBodyView.tsx";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {LAYOUT_ID} from "@/app/layout/layout.tsx";
import {JustBranch, JustStack} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";

interface Prop {
  layoutId: string
  hideTitle?: boolean
  dndAccept: string[]
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

const JustWinView = observer(({layoutId, hideTitle, dndAccept, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) => {
  // const winInfo = justStack?.active ? getWinInfo(justStack?.active) : null;
  const justLayoutStore = useJustLayoutStore(LAYOUT_ID)
  const isFullScreen = justLayoutStore.isFullScreen;
  // const isFullScreen = isEqual(justLayoutStore.fullScreenBranch, justBranch);

  const showTitle = hideTitle !== true
  const onFocus = () => {
    if (justStack.active) {
      justLayoutStore.activeWin({justId: justStack.active})
    }
  }
  return (
    <div className="just-win" onFocusCapture={onFocus} tabIndex={1}>
      {(showTitle && !isFullScreen) &&
        <JustWinTitleView
          layoutId={layoutId}
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
