import {Terminal} from "@xterm/xterm";

interface TerminalInstance {
  term: Terminal
}

const options: any = {
  rows: 1,
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
}

class TerminalManager {
  private terminals: Map<string, TerminalInstance> = new Map();

  public createInstance(id: string): TerminalInstance {
    if (!this.terminals.has(id)) {
      const term = new Terminal(options)
      this.terminals.set(id, {
        term: term,
      });
    }
    return this.terminals.get(id)!
  }



  public writeToTerminal(id: string, data: string): void {
    const {term} = this.createInstance(id);
    // const {term} = this.getTerminal(id)!
    term.write(data);
  }

  public getTerminal(id: string): TerminalInstance | undefined {
    return this.terminals.get(id)
  }


  public deleteTerminal(id: string): void {
    const instance = this.terminals.get(id);
    if (instance) {
      instance.term.dispose();
      this.terminals.delete(id);
    }
  }
}

export const terminalManager = new TerminalManager();
