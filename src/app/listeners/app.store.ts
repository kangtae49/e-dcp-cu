import {inject, injectable} from "inversify";
import {APP_TYPES} from "@/app/listeners/app.types.ts";
import {makeAutoObservable} from "mobx";
import {AppService} from "@/app/listeners/app.service.ts";

@injectable()
export class AppStore {
  service: AppService;

  isFullScreen: boolean = false

  constructor(
    @inject(APP_TYPES.AppService) service: AppService
  ) {
    this.service = service;
    makeAutoObservable(this, {service: false}, { autoBind: true })
  }

  changeFullScreen = (flag: boolean) => { this.isFullScreen = flag }
}