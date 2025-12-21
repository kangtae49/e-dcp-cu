import "./TerminalView.css"
import {useEffect, useRef} from "react";
import {Terminal as XTerm} from "@xterm/xterm"
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';
import {JobStreamData} from "@/types.ts";

interface Props {
  lines: JobStreamData[]
}

function TerminalView({lines}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const renderedCountRef = useRef<number>(0);

  const writeLine = (term: XTerm, line: JobStreamData) => {
    term.write(line.message)
  }
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
      fitAddon.fit();
      term.open(containerRef.current);
      termRef.current = term;
      fitAddonRef.current = fitAddon;
      termRef.current?.clear()

      lines.forEach((line) => writeLine(term, line))
    }
    return () => {
      console.log("dispose terminal");
      termRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (lines.length == 1) {
      termRef?.current?.clear()
    }

    lines
      .slice(renderedCountRef.current)
      .forEach((line) => {
      if (termRef.current) {
        writeLine(termRef.current, line)
      }
    })

    renderedCountRef.current = lines.length;
    // setCurLines(lines)
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


