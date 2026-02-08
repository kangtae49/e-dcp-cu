import {RowComponentProps} from "react-window";
import {JOB_MONITOR_VIEW_NODE_NAME} from "@/app/layout/layout.tsx";
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
import {useJustLayoutStore} from "@kangtae49/just-layout";
import {JobStreamData} from "@/app/job/jobMonitor.types.ts";

interface Props {
  events: JobStreamData []
}

const JobOutputRow = observer(({
  index,
  style,
  events,
}: RowComponentProps<Props>) => {

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID)

  // const idx = count - index - 1


  return (
    <div className="job-output-row" style={style} >
      {events[index].message}
    </div>
  )
})

export default JobOutputRow
