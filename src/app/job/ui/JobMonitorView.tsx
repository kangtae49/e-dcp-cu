import {JustId, JustNode} from "@/app/components/just-layout/justLayoutSlice.ts";
import JustLayoutView from "@/app/components/just-layout/ui/JustLayoutView.tsx";
import {GetWinInfoFn, WinInfo} from "@/app/components/just-layout";
import React from "react";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faTerminal
} from "@fortawesome/free-solid-svg-icons"
interface Props {
  justId: JustId
}
function JobMonitorView({justId}: Props) {

  const layout: JustNode = {
    type: "stack",
    tabs: [],
    active: null
  }
  const getWinInfo: GetWinInfoFn = (justId: JustId): WinInfo => {
    return {
      title: (justId) => {return "xx"},
      icon: <Icon icon={faTerminal} />,
      getView(justId: JustId): React.JSX.Element {
        return (
          <div>hello</div>
        );
      },
    }
  }


  return (
    <div className="job-monitor-view">
      {/*<JustLayoutView*/}
      {/*  layoutId="LAYOUT_JOB_MONITOR"*/}
      {/*  getWinInfo={getWinInfo}*/}
      {/*  initialValue={layout}*/}
      {/*/>*/}
    </div>
  )
}

export default JobMonitorView
