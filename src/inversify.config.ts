import "reflect-metadata";
import {Container,
  // ContainerModule
} from "inversify";
import { counterModule } from "./app/counter/counter.module.ts";
// import { toJS } from 'mobx';
import {gridDataModule} from "@/app/grid-data/gridData.module.ts";
import {jobMonitorModule} from "@/app/job/jobMonitor.module.ts";
import {pageModule} from "@/app/page/page.module.ts";
import {justLayoutModule} from "@/app/components/just-layout/justLayout.module.ts";
import {appModule} from "@/app/listeners/app.module.ts";
import {excalidrawModule} from "@/app/excalidraw/excalidraw.module.ts";
import {excalidrawDataModule} from "@/app/excalidraw-data/excalidrawData.module.ts";
import {toJS} from "mobx";
import {AppStore} from "@/app/listeners/app.store.ts";

const container = new Container();


const appModules = [
  appModule,
  justLayoutModule,
  counterModule,
  gridDataModule,
  jobMonitorModule,
  pageModule,
  excalidrawModule,
  excalidrawDataModule,
]
container.load(
  ...appModules
);

const storeCache = new Map<string, any>();


// if (process.env.NODE_ENV === 'development') {
//   (window as any).container = container;
//   (window as any).toJS = toJS;
// }


// const getF = (facId: string, storeId: string) => {
//   return container.get(Symbol.for(facId))(storeId)
// }

(window as any).storeCache = storeCache;
(window as any).toJS = toJS;
// toJS(storeCache.get('LAYOUT_ID').layout)


export { container, storeCache};