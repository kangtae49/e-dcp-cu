import {RowComponentProps} from "react-window";
import {JobMonitorState} from "@/app/job/jobMonitorSlice.ts";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import {JOB_MONITOR_VIEW_NODE_NAME, LAYOUT_ID} from "@/app/layout/layout.tsx";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faCircleStop,
  faTerminal
} from "@fortawesome/free-solid-svg-icons"
import React from "react";

interface Props {
  count: number
  jobMonitorState: JobMonitorState
}

function JobListRow({
  index,
  style,
  count,
  jobMonitorState,
  // event
}: RowComponentProps<Props>) {

  const {
    addTabWinByNodeName
  } = useJustLayout(LAYOUT_ID)
  const keys = Object.keys(jobMonitorState.status)
  const idx = count - index - 1
  const jobId = keys[idx]
  const status = jobMonitorState.status?.[jobId];

  const clickJobMonitor = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('clickJobMonitor', jobId)
    if (jobId) {
      addTabWinByNodeName({viewId: "job-monitor-view", title: jobId, params: {jobId}}, JOB_MONITOR_VIEW_NODE_NAME)
      // showWin(BOTTOM_PANEL_NODE_NAME, true)
    }
  }
  const clickStropScript = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.stopScript(jobId).then()
  }

  return (
    <div className="job-list-row" style={style} >
      {status === 'RUNNING' ?
        <div className="job-list-icon" onClick={clickStropScript}>
            <Icon icon={faCircleStop} />
        </div>
        :
        <div className="job-list-icon">
          <Icon icon={faTerminal} onClick={clickJobMonitor} />
        </div>
      }
      <div className="job-list-label" onClick={clickJobMonitor}>{jobId}</div>
    </div>
  )
}

export default JobListRow
