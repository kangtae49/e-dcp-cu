import {RowComponentProps} from "react-window";
import React from "react";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import {JobStreamData} from "@/app/job/jobMonitor.types.ts";

interface Props {
  events: JobStreamData []
}

const JobOutputRow = observer(({
  index,
  style,
  events,
}: RowComponentProps<Props>) => {


  return (
    <div className="job-output-row" style={style} >
      {events[index].message}
    </div>
  )
})

export default JobOutputRow
