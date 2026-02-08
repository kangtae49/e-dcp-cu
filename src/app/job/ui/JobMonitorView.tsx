import "./JobMonitorView.css"
import React from "react";
// import Terminal from "@/app/components/terminal/Terminal.tsx";
import {JustId, JustUtil} from "@kangtae49/just-layout";
import JobTerm from "@/app/job/ui/JobTerm.tsx";

interface Props {
  justId: JustId
  layoutId: string
}
function JobMonitorView({justId}: Props) {
  const jobId = JustUtil.getParamString(justId, "jobId")
  return ( jobId &&
    <div className="job-monitor-view">
      <JobTerm jobId={jobId} />
    </div>
  )
}

export default JobMonitorView
