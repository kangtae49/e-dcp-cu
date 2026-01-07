import {RowComponentProps} from "react-window";
import {JOB_MONITOR_VIEW_NODE_NAME, LAYOUT_ID} from "@/app/layout/layout.tsx";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faCircleStop,
  faTerminal
} from "@fortawesome/free-solid-svg-icons"
import React from "react";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import {keys} from "mobx";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";

interface Props {
  count: number
}

const JobListRow = observer(({
  index,
  style,
  count,
}: RowComponentProps<Props>) => {

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID)

  const justLayoutStore = useJustLayoutStore(LAYOUT_ID)
  const keyList = keys(jobMonitorStore.status)
  const idx = count - index - 1
  const jobId = keyList[idx] as string;
  const status = jobMonitorStore.status?.[jobId];

  const clickJobMonitor = (e: React.MouseEvent) => {
    e.preventDefault()
    if (jobId) {
      const jobMonitorJustId = {viewId: "job-monitor-view", title: jobId, params: {jobId}}
      justLayoutStore.addTabByNodeName({justId: jobMonitorJustId, nodeName: JOB_MONITOR_VIEW_NODE_NAME})
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
})

export default JobListRow
