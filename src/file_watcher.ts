import { BrowserWindow } from 'electron';
import chokidar, { FSWatcher } from 'chokidar';
import {WatchEvent, WatchFileData, WatchStatus} from "./types.ts";
import path from "node:path";
import * as fs from "node:fs";
import {getScriptSubPath} from "./api_core.ts";

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private window: BrowserWindow;
  private readonly watchPath: string;

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
        (currentPath) => {

          if (!fs.existsSync(currentPath)) {
            return true;
          }
          try {
            if (fs.lstatSync(currentPath).isDirectory()) {
              return false
            }
          } catch (e) {
            console.log('chokidar.watch ignored', e.toString())
          }

          const fileName = path.basename(currentPath);
          // const dirName = path.dirname(currentPath);
          // const tmpFileName = `~$${fileName}`;
          // const tmpPath = path.join(dirName, tmpFileName);
          return !(path.extname(fileName) === '.xlsx' && !fileName.startsWith("~$"));
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

  /*
  private copyToPage(tmpPath: string) {
    if (!fs.existsSync(tmpPath)) {
      return;
    }
    const pageDir = getScriptSubPath('pages')
    const tmpName = path.basename(tmpPath)
    const pageName = tmpName.split('_').slice(1).join('_')
    const pagePath = path.join(pageDir, pageName)
    // const tmpPageName = `~$${pageName}`
    // const tmpPagePath = path.join(pageDir, tmpPageName)
    if (fs.existsSync(pagePath)) {
      fs.unlinkSync(pagePath)
    }
    fs.mkdirSync(pageDir, {recursive: true})
    fs.renameSync(tmpPath, pagePath)

    // fs.copyFileSync(tmpPath, tmpPagePath)
    // fs.renameSync(tmpPagePath, pagePath)
    // fs.unlinkSync(tmpPath)
  }
   */
}