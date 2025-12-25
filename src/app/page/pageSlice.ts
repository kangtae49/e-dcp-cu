import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Option} from "@/app/components/select/SelectBox.tsx";
import {format} from "date-fns";
import {JobEvent, JobStatus} from "@/types.ts";


export const PAGE01_ID = "PAGE01"
export interface JobInfo {
  jobId: string,
  path: string,
  args: string[],
  status: JobStatus
}

export type TabType = "GRAPH" | "GRID" | "LOG"

export interface PageState {
  company: Option | null
  startDate: string | null
  endDate: string | null
  jobInfo: JobInfo | null
  tab: TabType
  events: JobEvent[]
}

const initialState: PageState = {
  company: null,
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  jobInfo: null,
  tab: "GRAPH",
  events: []
}

export const createPageSlice = (id: string) =>
  createSlice({
    name: id,
    initialState,
    reducers: {
      setCompany: (state, { payload }: PayloadAction<Option>) => { state.company = payload },
      setStartDate: (state, { payload }: PayloadAction<string | null>) => { state.startDate = payload },
      setEndDate: (state, { payload }: PayloadAction<string | null>) => { state.endDate = payload },
      setJobInfo: (state, { payload }: PayloadAction<JobInfo | null>) => { state.jobInfo = payload },
      setTab: (state, { payload }: PayloadAction<TabType>) => { state.tab = payload },
      setEvents: (state, { payload }: PayloadAction<JobEvent[]>) => { state.events = payload },
    }
  })

export type PageSlice = ReturnType<typeof createPageSlice>;

export type PageActions = PageSlice["actions"];
