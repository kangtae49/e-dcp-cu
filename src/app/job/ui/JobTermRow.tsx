import {RowComponentProps} from "react-window";
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
  const line = terminalInstance?.term.buffer.normal.getLine(index)


  return (
    <div className="job-term-row" style={style} >
      {line?.translateToString()}
    </div>
  )
})

export default JobTermRow
