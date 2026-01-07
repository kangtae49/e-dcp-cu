import { injectable, inject } from "inversify";
import {JobInfo, PAGE_TYPES, TabType} from "./page.types";
import { PageService } from "./page.service";
import {makeAutoObservable} from "mobx";
import type {Option} from "@/app/components/select/SelectBox.tsx";
import {format} from "date-fns";
import type {PayloadAction} from "@reduxjs/toolkit";

@injectable()
export class PageStore {
  service: PageService;

  company: Option | null
  startDate: string | null = format(new Date(), "yyyy-MM-dd")
  endDate: string | null = format(new Date(), "yyyy-MM-dd")
  jobInfo: JobInfo | null = null
  tab: TabType = "GRAPH"

  constructor(
    @inject(PAGE_TYPES.PageService) service: PageService
  ) {
    this.service = service;

    makeAutoObservable(this, {
      service: false
    }, { autoBind: true });


  }
  setCompany = (payload: Option) => { this.company = payload }
  setStartDate = (payload: string | null) => { this.startDate = payload }
  setEndDate = (payload: string | null) => { this.endDate = payload }

  setJobInfo = (payload: JobInfo | null) => { this.jobInfo = payload }

  setTab = (payload: TabType) => { this.tab = payload }


}