import JustWinTitleView from "./JustWinTitleView.tsx";
import JustWinBodyView from "./JustWinBodyView.tsx";
import type {JustBranch, JustStack} from "../justLayoutSlice.ts";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import {LAYOUT_ID} from "@/app/layout/layout.tsx";

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

function JustWinView ({layoutId, hideTitle, dndAccept, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) {
  // const winInfo = justStack?.active ? getWinInfo(justStack?.active) : null;
  const {setActiveWin} = useJustLayout(LAYOUT_ID)
  const showTitle = hideTitle !== true
  const onFocus = () => {
    if (justStack.active) {
      setActiveWin(justStack.active)
    }
  }
  return (
    <div className="just-win" onFocusCapture={onFocus} tabIndex={1}>
      {showTitle &&
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
}

export default JustWinView
