import "./JobOutput.css"
import {List, ListImperativeAPI} from "react-window";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import JobOutputRow from "@/app/job/ui/JobOutputRow.tsx";
import {JobStreamData} from "@/app/job/jobMonitor.types.ts";
import {useEffect, useRef} from "react";
// import {terminalManager} from "@/app/components/terminal/TerminalManager.ts";

interface Props {
  jobId: string
}

const JobOutput = observer(({jobId}: Props)=> {
  const listRef = useRef<ListImperativeAPI | null>(null);

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID)
  const jobStreamData = jobMonitorStore.events?.[jobId]
    ?.filter((event)=>event.action === 'JOB_STREAM')
    ?.map((event) => event.data as JobStreamData)
  ;
  const count = jobStreamData?.length || 0;
  // const terminalInstance= terminalManager.getTerminal(jobId);
  // const count2 = terminalInstance?.term.buffer.normal.length || 0;
  // const line = terminalInstance?.term.buffer.normal.getLine(count2-2)
  // console.log('count:', count, line?.translateToString())

  useEffect(() => {
    if (count > 0) {
      listRef?.current?.scrollToRow({align: "auto", behavior: "auto", index: count-1})
    }
  }, [count])

  return (
    <div className="job-output">
      <List
        listRef={listRef}
        className="job-output-table"
        rowComponent={JobOutputRow}
        rowCount={count}
        rowHeight={20}
        rowProps={{
          events: jobStreamData
        }}
        style={{}}
      />
    </div>
  )
})

export default JobOutput;