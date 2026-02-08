import "./JobTerm.css"
import {List, ListImperativeAPI} from "react-window";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import JobTermRow from "@/app/job/ui/JobTermRow.tsx";
// import {JobStreamData} from "@/app/job/jobMonitor.types.ts";
import {useEffect, useRef, useState} from "react";
import {terminalManager} from "@/app/components/terminal/TerminalManager.ts";
// import {terminalManager} from "@/app/components/terminal/TerminalManager.ts";

interface Props {
  jobId: string
}

const JobTerm = observer(({jobId}: Props)=> {
  const listRef = useRef<ListImperativeAPI | null>(null);
  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID)
  const jobStreamData = jobMonitorStore.events?.[jobId]
  const eventCount = jobStreamData?.length || 0;
  const [termCount, setTermCount] = useState(0);
  const terminalInstance= terminalManager.getTerminal(jobId);

  useEffect(() => {
    const count = terminalInstance?.term.buffer.normal.length || 0;
    setTermCount(count)
  }, [eventCount])

  useEffect(() => {
    if (termCount > 0) {
      listRef?.current?.scrollToRow({align: "auto", behavior: "auto", index: termCount-1})
    }
  }, [termCount])

  console.log('count', termCount, terminalInstance?.term.buffer.active.length)
  return (
    <div className="job-term">
      <List
        listRef={listRef}
        className="job-term-table"
        rowComponent={JobTermRow}
        rowCount={termCount}
        rowHeight={20}
        rowProps={{
          jobId: jobId
        }}
        style={{}}
      />
    </div>
  )
})

export default JobTerm;