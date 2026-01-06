import "reflect-metadata";
import { Container } from "inversify";
import { counterModule } from "./app/counter/counter.module.ts";

const container = new Container();


const appModules = [
  counterModule,
  gridDataModule,
]
container.load(
  ...appModules
);


import { toJS } from 'mobx';
import {gridDataModule} from "@/app/grid/gridData.module.ts";
if (process.env.NODE_ENV === 'development') {
  (window as any).container = container;
  (window as any).toJS = toJS;
}


export { container };