export type TabType = "GRAPH" | "GRID" | "LOG"

export interface JobInfo {
  jobId: string,
  path: string,
  args: string[],
}


import {PageStore} from "@/app/page/page.store.ts";

export type PageFactory = (id: string) => PageStore;

