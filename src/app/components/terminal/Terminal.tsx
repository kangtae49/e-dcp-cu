import "./Terminal.css"
import {useEffect, useRef} from "react";
import {Terminal as XTerm} from "@xterm/xterm"
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {JobEvent, JobStreamData} from "@/app/job/jobMonitor.types.ts";
import {observer} from "mobx-react-lite";

interface Props {
  jobId: string
}

const Terminal = observer(({jobId}: Props) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID);

  const events: JobEvent [] = jobMonitorStore.events[jobId] ?? []

  const writeLine = (term: XTerm, event: JobEvent) => {
    if(event.action === 'JOB_STREAM') {
      const data = event.data as JobStreamData
      term.write(data.message)
      // const tm = event.timestamp ? format(event.timestamp, FORMAT_HMS_MS) : ''
      // const lines = data.message.trim().split('\n').map(line=>line.trim())
      // lines.forEach((line) => {
      //   term.writeln(`${tm} ${line}`)
      // })
    }
  }
  // useEffect(() => {
  //   if (!containerRef.current) return;
  //   if (!termRef.current) return;
  //
  //   const observer = new ResizeObserver(() => {
  //     fitAddonRef.current?.fit();
  //   });
  //
  //   observer.observe(containerRef.current);
  //
  //   return () => observer.disconnect();
  // }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      // requestAnimationFrame(() => {
      //   if (containerRef.current?.clientWidth) {
      //     fitAddonRef.current?.fit();
      //   }
      // });
      fitAddonRef.current?.fit();
    });
    // if (termRef.current) {
    //   termRef.current?.dispose()
    // }
    let term: XTerm;
    if (containerRef?.current) {
      term = new XTerm({
        // fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        fontFamily: '"Gulimche", "굴림체", dotum, sans-serif',
        // fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
        // fontFamily: 'Pretendard',
        fontSize: 16,
        // lineHeight: 1.2,
        // fontWeight: 'normal',
        // fontWeightBold: 'bold',
        theme: {
          background: '#0c0c0c',
          foreground: '#cccccc'
        },
        cursorStyle: 'underline',
        cursorBlink: false,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      console.log("containerRef.current1", containerRef?.current)
      console.log("containerRef.current2", containerRef?.current)
      term.open(containerRef.current);

      termRef.current = term;
      fitAddonRef.current = fitAddon;
      // termRef.current.open(containerRef.current);
      // termRef.current?.clear()
      // fitAddon.fit();
      fitAddonRef.current?.fit();

      // lines.forEach((line) => writeLine(term, line))
      observer.observe(containerRef.current);
    }



    return () => {
      observer.disconnect();
      term.dispose();
      // termRef.current?.dispose();
      // termRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!termRef?.current) return;
    if (!fitAddonRef.current) return;
    termRef.current.clear()
    events
      .forEach((event) => {
      if (termRef.current) {
        writeLine(termRef.current, event)
      }
    })

    // fitAddonRef.current.fit();

    // termRef?.current.scrollToBottom()
  }, [jobMonitorStore.events[jobId]?.length]);



  return (
    <div
      className="just-terminal"
      ref={containerRef}
    >
    </div>
  )
})

export default Terminal


