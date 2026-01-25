import "./JobListView.css"
import IconMinimize from "@/assets/minimize.svg?react"
import {BOTTOM_PANEL_NODE_NAME} from "@/app/layout/layout.tsx";
import {List} from "react-window";
import JobListRow from "@/app/job/ui/JobListRow.tsx";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import {keys} from "mobx";
import {JustId, useJustLayoutStore} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}

const JobListView = observer(({justId: _justId, layoutId}: Props)=> {
  const justLayoutStore = useJustLayoutStore(layoutId)

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID)

  const toggleView = () => {
    justLayoutStore.toggleWin({nodeName: BOTTOM_PANEL_NODE_NAME})
  }
  const count = keys(jobMonitorStore.status).length
  return (
    <div className="job-list-view">
      <div className="job-list-title">
        <div className="job-list-name">Job List</div>
        <div className="icon-minimize" onClick={toggleView}>
          <IconMinimize />
        </div>
      </div>
      <div className="job-list-content">
        {jobMonitorStore.status &&
          <List
            className="job-list-table"
            rowComponent={JobListRow}
            rowCount={count}
            // rowCount={200}
            rowHeight={20}
            rowProps={{
              count,
              layoutId
            }}
            style={{}}
          />
        }
      </div>
    </div>
  )
})

export default JobListView;