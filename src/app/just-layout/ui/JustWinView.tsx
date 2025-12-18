import JustWinTitleView from "@/app/just-layout/ui/JustWinTitleView.tsx";
import JustWinBodyView from "@/app/just-layout/ui/JustWinBodyView.tsx";
import type {JustBranch, JustStack} from "@/app/just-layout/justLayoutSlice.ts";
import {GetWinInfoFn} from "@/app/just-layout";

interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
}

function JustWinView ({justBranch, justStack, getWinInfo}: Prop) {
  const winInfo = justStack?.active ? getWinInfo(justStack?.active) : null;
  const showTitle = winInfo?.showTitle ?? true
  return (
    <div className="just-win">
      {showTitle &&
        <JustWinTitleView
          justBranch={justBranch}
          justStack={justStack}
          getWinInfo={getWinInfo}
        />
      }
      <JustWinBodyView justBranch={justBranch} justStack={justStack} getWinInfo={getWinInfo} />
    </div>
  )
}

export default JustWinView
