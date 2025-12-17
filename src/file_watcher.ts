import { BrowserWindow } from 'electron';
import chokidar, { FSWatcher } from 'chokidar';
import {WatchEvent, WatchFileData, WatchStatus} from "./types.ts";
import path from "node:path";
import * as fs from "node:fs";

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private window: BrowserWindow;
  private watchPath: string;

  constructor(window: BrowserWindow, watchPath: string) {
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
      ignored: [
        /(^|[\/\\])\..|node_modules/,
        (currentPath) => {
          const fileName = path.basename(currentPath);
          if (!currentPath || !fs.existsSync(currentPath) || fs.statSync(currentPath).isDirectory()) {
            return false;
          }
          if (!['.xlsx'].includes(path.extname(fileName))) {
            return true;
          }
          if (fileName.startsWith('~')) {
            return true;
          }

          return false;
        }
      ],
      persistent: true,
      ignoreInitial: true,
      depth: 99
    });

    this.watcher
      .on('add', (path, stats) => this.sendWatchEvent('CREATED', path, stats?.mtimeMs))
      .on('change', (path, stats) => this.sendWatchEvent('MODIFIED', path, stats?.mtimeMs))
      .on('unlink', (path) => this.sendWatchEvent('DELETED', path))
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes.');
        // this.sendWatchEvent('READY', this.watchPath);
      })
      .on('error', error => console.error(`Watcher error: ${error}`));
  }

  public stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('FileWatcher stopped.');
    }
  }

  private sendWatchEvent(status: WatchStatus, filePath: string, mtime?: number) {
    const key = path.relative(this.watchPath, filePath);
    const eventData: WatchFileData = {
      status,
      path: filePath,
      key,
      mtime: mtime || Date.now()
    };

    const watchEvent: WatchEvent = {
      action: "WATCH_FILE",
      data: eventData
    }
    this.window.webContents.send("watch-event", watchEvent);
    console.log(`[FileEvent] ${status}: ${filePath}`);
  }
}