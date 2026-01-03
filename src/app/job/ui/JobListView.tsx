import "./JobListView.css"
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import IconMinimize from "@/assets/minimize.svg?react"
import {BOTTOM_PANEL_NODE_NAME, LAYOUT_ID} from "@/app/layout/layout.tsx";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import {List} from "react-window";
import JobListRow from "@/app/job/ui/JobListRow.tsx";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitorSlice.ts";
interface Props {
  justId: JustId
}
function JobListView({justId}: Props) {
  console.log(justId)
  const {
    toggleWin,
  } = useJustLayout(LAYOUT_ID)

  const {
    state: jobMonitorState,
  } = useJobMonitor(JOB_MONITOR_ID)

  const toggleView = () => {
    toggleWin(BOTTOM_PANEL_NODE_NAME)
  }
  const count = jobMonitorState?.status ? Object.keys(jobMonitorState.status).length : 0
  return (
    <div className="job-list-view">
      <div className="job-list-title">
        <div className="job-list-name">Job List</div>
        <div className="icon-minimize" onClick={toggleView}>
          <IconMinimize />
        </div>
      </div>
      <div className="job-list-content">
        {jobMonitorState?.status &&
          <List
            className="job-list-table"
            rowComponent={JobListRow}
            rowCount={count}
            // rowCount={200}
            rowHeight={20}
            rowProps={{
              jobMonitorState,
              count
            }}
            style={{}}

          />
        }
      </div>
    </div>
  )
}

export default JobListView
