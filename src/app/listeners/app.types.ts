import {AppStore} from "@/app/listeners/app.store.ts"

export type AppFactory = (id: string) => AppStore;

export const APP_TYPES = {
  AppService: Symbol.for("AppService"),
  AppStore: Symbol.for("AppStore"),
  AppFactory: Symbol.for("AppFactory"),
}
