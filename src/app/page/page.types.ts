export type TabType = "GRAPH" | "GRID" | "LOG"

export interface JobInfo {
  jobId: string,
  path: string,
  args: string[],
}


import {PageStore} from "@/app/page/page.store.ts";

export type PageFactory = (id: string) => PageStore;

export const PAGE_TYPES = {
  PageService: Symbol.for("PageService"),
  PageStore: Symbol.for("PageStore"),
  PageFactory: Symbol.for("PageFactory"),
};