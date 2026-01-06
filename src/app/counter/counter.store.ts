import { injectable, inject } from "inversify";
import { COUNTER_TYPES } from "./counter.types";
import { CounterService } from "./counter.service";
import {makeAutoObservable} from "mobx";

@injectable()
export class CounterStore {
  service: CounterService;
  count = 0;

  constructor(
    @inject(COUNTER_TYPES.CounterService) service: CounterService
  ) {
    this.service = service;

    makeAutoObservable(this, {
      service: false
    }, { autoBind: true });
  }

  increment() {
    this.count++;
    this.service.logValue(this.count);
  }

  get doubleCount() {
    return this.service.calculateDouble(this.count);
  }

}