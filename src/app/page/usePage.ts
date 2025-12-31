import {useDynamicSlice} from "@/store/hooks.ts";
import {createPageSlice, JobInfo, PageActions, PageState, TabType} from "@/app/page/pageSlice.ts";
import {Option} from "@/app/components/select/SelectBox.tsx";
import {JobEvent} from "@/types.ts";

function usePage(pageId: string) {
  const {
    state,
    actions: pageActions,
    dispatch
  } = useDynamicSlice<PageState, PageActions>(pageId, createPageSlice)

  const setCompany = (company: Option) => {
    dispatch(pageActions.setCompany(company));
  }


  const setJobInfo = (jobInfo: JobInfo) => {
    dispatch(pageActions.setJobInfo(jobInfo))
  }

  const setStartDate = (startDate: string | null) => {
    dispatch(pageActions.setStartDate(startDate))
  }
  const setEndDate = (endDate: string | null) => {
    dispatch(pageActions.setEndDate(endDate))
  }

  const setTab = (tab: TabType) => {
    dispatch(pageActions.setTab(tab))
  }
  return {
    state,
    setCompany,
    setJobInfo,
    setStartDate,
    setEndDate,
    setTab,
  }
}

export default usePage
