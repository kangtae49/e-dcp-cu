import {AppStore} from "@/app/listeners/app.store.ts"

export type AppFactory = (id: string) => AppStore;


