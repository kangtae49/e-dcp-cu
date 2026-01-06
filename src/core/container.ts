import "reflect-metadata";
import { Container } from "inversify";
import { counterModule } from "../app/counter/counter.module.ts";

const container = new Container();

container.load(counterModule);

export { container };