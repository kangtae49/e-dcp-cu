import "./TerminalView.css"
import {useEffect, useRef, useState} from "react";
import {Terminal as XTerm} from "@xterm/xterm"
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';

interface Props {
  lines: string[]
}

function TerminalView({lines}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [curLines, setCurLines] = useState<string[]>([])
  // console.log("curLines:", curLines.length, "lines:", lines.length)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      fitAddonRef.current?.fit();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const term = new XTerm({
        // fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
        // fontFamily: 'Pretendard',
        fontSize: 14,
        lineHeight: 1.2,
        fontWeight: 'normal',
        // fontWeightBold: 'bold',
        theme: { background: '#0c0c0c' },
        cursorStyle: 'underline',
        cursorBlink: false,
      });
      try{
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();
        term.open(containerRef.current);
        termRef.current = term;
        fitAddonRef.current = fitAddon;
        curLines.forEach((line) => term.write(line))
      } catch (e) {
        console.log(e);
      }
    }
    return () => {
      console.log("dispose terminal");
      termRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (lines.length == 0) {
      termRef?.current?.clear()
      console.log("clear terminal")
      setCurLines([])
    } else {
      lines.slice(curLines.length).forEach((line) => {
        termRef?.current?.write(line)
      })
      setCurLines(lines)
    }
    fitAddonRef.current?.fit();
    termRef?.current?.scrollToBottom()
  }, [lines.length]);

  return (
    <div
      className="just-terminal"
      ref={containerRef}
    >
    </div>
  )
}

export default TerminalView


