import {RowComponentProps} from "react-window";
import {JOB_MONITOR_VIEW_NODE_NAME} from "@/app/layout/layout.tsx";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faCircleStop,
  faTerminal
} from "@fortawesome/free-solid-svg-icons"
import React from "react";
import {observer} from "mobx-react-lite";
import {terminalManager} from "@/app/components/terminal/TerminalManager.ts";

interface Props {
  jobId: string
}

const JobTermRow = observer(({
  index,
  style,
  jobId,
}: RowComponentProps<Props>) => {
  const terminalInstance= terminalManager.getTerminal(jobId);
  // const count = terminalInstance?.term.buffer.normal.length || 0;
  const line = terminalInstance?.term.buffer.normal.getLine(index)
  // const idx = count - index - 1


  return (
    <div className="job-term-row" style={style} >
      {line?.translateToString()}
    </div>
  )
})

export default JobTermRow
