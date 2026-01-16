import { BrowserWindow } from 'electron';
import chokidar, { FSWatcher } from 'chokidar';
import {WatchEvent, WatchFileData, WatchStatus} from "./types.ts";

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private window: BrowserWindow;
  private readonly watchPath: string[];

  constructor(window: BrowserWindow, watchPath: string[]) {
    this.window = window;
    this.watchPath = watchPath;
  }

  public startWatching() {
    if (this.watcher) {
      console.log('FileWatcher is already running.');
      return;
    }

    console.log(`Watching directory: ${this.watchPath}`);

    this.watcher = chokidar.watch(this.watchPath, {
      // ignored: [
      //   (currentPath) => {
      //
      //     try {
      //       if (fs.lstatSync(currentPath).isDirectory()) {
      //         return false
      //       }
      //     } catch (_err) {
      //       // nothing : deleted file
      //     }
      //
      //     const fileName = path.basename(currentPath);
      //     return !(['.xlsx', '.excalidraw'].includes(path.extname(fileName)));
      //   }
      // ],
      // awaitWriteFinish: {
      //   stabilityThreshold: 200,
      //   pollInterval: 50
      // },
      persistent: true,
      ignoreInitial: false,
      depth: 99,
    });

    this.watcher
      .on('add', (path, stats) => this.sendWatchEvent('CREATED', path, stats?.mtimeMs))
      .on('change', (path, stats) => this.sendWatchEvent('MODIFIED', path, stats?.mtimeMs))
      .on('unlink', (path) => this.sendWatchEvent('DELETED', path))
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes.');
      })
      .on('error', error => console.error(`Watcher error: ${error}`));
  }

  public stopWatching() {
    if (this.watcher) {
      this.watcher.close().then();
      this.watcher = null;
      console.log('FileWatcher stopped.');
    }
  }
  public add(watchPath: string []) {
    this.watcher?.add(watchPath);
  }
  public unwatch(watchPath: string []) {
    this.watcher?.unwatch(watchPath);
  }


  private sendWatchEvent(status: WatchStatus, filePath: string, mtime?: number) {
    setTimeout(() => {
      console.log(`[FileEvent] ${status}: ${filePath}`);
      const eventData: WatchFileData = {
        status,
        path: filePath,
        mtime: mtime || Date.now()
      };

      const watchEvent: WatchEvent = {
        action: "WATCH_FILE",
        data: eventData
      }
      this.window.webContents.send("on-watch-event", watchEvent);
    }, 200)

  }




}