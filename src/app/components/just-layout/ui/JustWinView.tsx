import JustWinTitleView from "./JustWinTitleView.tsx";
import JustWinBodyView from "./JustWinBodyView.tsx";
import type {JustBranch, JustStack} from "../justLayoutSlice.ts";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";

interface Prop {
  layoutId: string
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

function JustWinView ({layoutId, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) {
  const winInfo = justStack?.active ? getWinInfo(justStack?.active) : null;
  const showTitle = winInfo?.showTitle ?? true
  return (
    <div className="just-win">
      {showTitle &&
        <JustWinTitleView
          layoutId={layoutId}
          justBranch={justBranch}
          justStack={justStack}
          getWinInfo={getWinInfo}
          closeWin={closeWin}
          onClickTitle={onClickTitle}
          onDoubleClickTitle={onDoubleClickTitle}
        />
      }
      <JustWinBodyView layoutId={layoutId} justBranch={justBranch} justStack={justStack} getWinInfo={getWinInfo} />
    </div>
  )
}

export default JustWinView
