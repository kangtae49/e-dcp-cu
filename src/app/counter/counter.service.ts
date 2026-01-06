import { injectable } from "inversify";

@injectable()
export class CounterService {
  calculateDouble(value: number) {
    return value * 2;
  }

  logValue(value: number) {
    console.log(`${value}`);
  }
}