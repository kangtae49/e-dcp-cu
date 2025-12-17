import JustWinTitleView from "@/app/just-layout/ui/JustWinTitleView.tsx";
import JustWinBodyView from "@/app/just-layout/ui/JustWinBodyView.tsx";
import type {GetWinInfoFn, JustBranch, JustStack} from "@/app/just-layout/justLayoutSlice.ts";
// import {useEffect, useState} from "react";

interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  // viewMap: Record<string, WinInfo>
}

function JustWinView ({justBranch, justStack, getWinInfo}: Prop) {
  const winInfo = getWinInfo(justStack?.active ?? '');
  const showTitle = winInfo.showTitle ?? true
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
