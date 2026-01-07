import "./JobMonitorView.css"
import React from "react";
import Terminal from "@/app/components/terminal/Terminal.tsx";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
interface Props {
  justId: JustId
}
function JobMonitorView({justId}: Props) {

  return (
    <div className="job-monitor-view">
      <Terminal jobId={JustUtil.getParamString(justId, "jobId")} />
    </div>
  )
}

export default JobMonitorView
