import "reflect-metadata";
import { Container } from "inversify";
import { counterModule } from "./app/counter/counter.module.ts";
import { toJS } from 'mobx';
import {gridDataModule} from "@/app/grid/gridData.module.ts";
import {jobMonitorModule} from "@/app/job/jobMonitor.module.ts";

const container = new Container();


const appModules = [
  counterModule,
  gridDataModule,
  jobMonitorModule,
]
container.load(
  ...appModules
);



if (process.env.NODE_ENV === 'development') {
  (window as any).container = container;
  (window as any).toJS = toJS;
}


export { container };