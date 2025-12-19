import "./PageView.css"
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass, faChartLine, faTerminal, faTableList} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox.tsx";
import MonthPicker from "@/app/components/date/MonthPicker.tsx";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import {CONFIG_ID, type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import {Activity, useEffect} from "react";
import { format } from "date-fns";
import {
  createJobMonitorSlice,
  JOB_MONITOR_ID,
  type JobMonitorActions,
  type JobMonitorState
} from "@/app/job/jobMonitorSlice";
import {createJobMonitorThunks} from "@/app/job/jobMonitorThunks";
import {createPageSlice, type PageActions, type PageState} from "@/app/page/pageSlice";
import classNames from "classnames";
import TerminalView from "@/app/components/terminal/TerminalView";
import PageLineChart from "@/app/components/chart/PageLineChart";
import OutputGrid from "@/app/components/grid/OutputGrid";
import {JobEvent, JobStatus, JobStreamData} from "@/types";
import {WinObj, WinObjId} from "@/app/just-layout";

interface Props {
  winObjId: WinObjId
}



function Page01View({winObjId}: Props) {
  const configKey = "data\\company.xlsx";
  // const jobId = `job-${new Date().getTime()}`
  // chart-line.svg
  // terminal.svg
  // table.svg, table-cells-large.svg, table-cells.svg, table-list.svg
  // const [companyList, setCompanyList] = useState<Option[]>([])
  const winId = WinObj.toWinId(winObjId)
  const dispatch = useAppDispatch();
  const {
    state: pageState,
    actions: pageActions,
  } = useDynamicSlice<PageState, PageActions>(winId, createPageSlice)

  const {
    state: jobMonitorState,
    actions: jobMonitorActions,
    thunks: jobMonitorThunks,
    // dispatch
  } = useDynamicSlice<JobMonitorState, JobMonitorActions>(JOB_MONITOR_ID, createJobMonitorSlice, createJobMonitorThunks)

  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)

  // const [outFile, setOutFile] = useState<string | null>(null);

  const toOptions = (data: Record<string, string | number | boolean | null>[]): Option[] => {
    return data.map(d => {
      return {value: d.cdVlId, label: d.cdVlNm ? d.cdVlNm.toString() : ''}
    })
  }

  const config = configsState?.configs?.[configKey];
  const companyList = toOptions(config?.data ?? []);

  const jobInfo = pageState?.jobInfo;
  const outFile = jobInfo?.status === 'DONE'
    ? `${jobInfo.args.join('_')}.xlsx`
    : null;

  useEffect(() => {
    if (companyList.length > 0 && !pageState?.company) {
      dispatch(pageActions.setCompany(companyList[0]));
    }
  }, [companyList, dispatch, pageActions, pageState?.company]);


  useEffect(() => {
    if (!pageState?.jobInfo) return;

    const status: JobStatus | null = dispatch(jobMonitorThunks.getJobStatus({jobId: pageState.jobInfo.jobId}))
    if (status !== null && pageState.jobInfo.status !== status) {
      console.log('jobStatus:', status)
      dispatch(pageActions.setJobInfo({...pageState.jobInfo, status}))
    }

    const events: JobEvent [] = dispatch(jobMonitorThunks.getJobEvents({jobId: pageState.jobInfo?.jobId}))
    const streamEvents = events.filter((event) => event.action === 'JOB_STREAM')
    const logs = streamEvents.map((event) => (event.data as JobStreamData).message ?? '')
    dispatch(pageActions.setLogs(logs))
  }, [dispatch, jobMonitorState, jobMonitorThunks, pageActions, pageState?.jobInfo]);





  const onChangeStartDate = (date: string | null) => {
    console.log('onChangeStartDate:', date)
    dispatch(pageActions.setStartDate(date))
  }

  const onChangeEndDate = (date: string | null) => {
    console.log('onChangeEndDate:', date)
    dispatch(pageActions.setEndDate(date))
  }

  const handleCompany = (option: Option) => {
    dispatch(pageActions.setCompany(option))
  }
  const searchPage01 = () => {

    if (!pageState?.startDate || !pageState?.endDate || !pageState?.company) return;
    const startYm = format(pageState.startDate, "yyyyMM");
    const endYm = format(pageState.endDate, "yyyyMM");
    const companyVal = pageState.company.value;

    if (pageState.jobInfo !== null && pageState.jobInfo.status === 'RUNNING') return;
    console.log('searchPage01')

    if (pageState.jobInfo) {
      dispatch(jobMonitorActions.clearEvents({jobId: pageState.jobInfo?.jobId}))
    }
    const jobId = `job-${new Date().getTime()}`
    const scriptPath = "page01.py"
    const args = [jobId, winObjId.viewId, companyVal?.toString() ?? '', startYm, endYm];
    dispatch(pageActions.setJobInfo({jobId, status: 'RUNNING', path: scriptPath, args}))
    window.api.startScript(jobId, scriptPath, args).then()
  }



  return (
    <div className="win-page">
      <div className="page-title">
        <div className="page-icon">
          <Jdenticon size="25" value={winObjId.viewId} />
        </div>
        <div className="page-label">자산통계정보</div>
      </div>
      <div className="page-search">
        <div className="search-filter">
          <div className="search-row">
            <div className="search-item">
              <div className="search-item-label">기업체명</div>
              <div className="search-item-value">
                <SelectBox
                  onChange={handleCompany}
                  value={pageState?.company?.value}
                  options={companyList}
                />
              </div>
            </div>
            <div className="search-item">
              <div className="search-item-label">조회기간</div>
              <div className="search-item-value">
                <MonthPicker value={pageState?.startDate} onChange={onChangeStartDate} />
              </div>
              <div>~</div>
              <div className="search-item-value">
                <MonthPicker value={pageState?.endDate} onChange={onChangeEndDate} />
              </div>
            </div>
            <div className="search-box">
              <div className="search-icon-btn" onClick={() => searchPage01()}>
                <div className="search-icon">
                  {pageState?.jobInfo !== null && pageState?.jobInfo.status === 'RUNNING' ?
                    <div className="spinner"></div>
                    :
                    <Icon icon={faMagnifyingGlass} />
                  }
                </div>
                <div className="search-btn-label">
                  검색
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="tabs">
          <div className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "GRAPH",
                }
              )}
              onClick={()=>dispatch(pageActions.setTab('GRAPH'))}>
            <Icon icon={faChartLine} />graph
          </div>
          <div className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "GRID",
                }
              )}
              onClick={()=>dispatch(pageActions.setTab('GRID'))}>
            <Icon icon={faTableList} />grid
          </div>
          <div className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "LOG",
                }
              )}
              onClick={()=>dispatch(pageActions.setTab('LOG'))}>
            <Icon icon={faTerminal} />log
          </div>
        </div>
        <div className="tab-body">
          <Activity mode={pageState?.tab === "LOG" ? "visible" : "hidden"}>
            {pageState?.logs && <TerminalView lines={pageState.logs} />}
          </Activity>
          <Activity mode={pageState?.tab === "GRID" ? "visible" : "hidden"}>
            {outFile &&
              <OutputGrid
                  title={outFile ?? ''}
                  outFile={`output\\${outFile}`}
              />
            }
          </Activity>
          <Activity mode={pageState?.tab === "GRAPH" ? "visible" : "hidden"}>
            {outFile &&
              <PageLineChart
                  title={outFile ?? ''}
                  outFile={`output\\${outFile}`}
                  legend={[
                    {
                      id: "cpstrtRlest",
                      name: "cpstrtRlest",
                      color: "#ca2828"
                    }, {
                      id: "cpstrtVlscrt",
                      name: "cpstrtVlscrt",
                      color: "#1140bd"
                    }
                  ]}
              />
            }
          </Activity>
        </div>
      </div>

    </div>
  )
}

export default Page01View;
