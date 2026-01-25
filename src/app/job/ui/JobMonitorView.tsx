import "./JobMonitorView.css"
import React from "react";
import Terminal from "@/app/components/terminal/Terminal.tsx";
import {JustId, JustUtil} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}
function JobMonitorView({justId}: Props) {

  return (
    <div className="job-monitor-view">
      <Terminal jobId={JustUtil.getParamString(justId, "jobId")!} />
    </div>
  )
}

export default JobMonitorView
