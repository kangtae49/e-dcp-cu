import "./PageView.css"
import {type WinObjId} from "@/App";
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass, faChartLine, faTerminal, faTableList} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox";
import MonthPicker from "@/app/components/date/MonthPicker";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks";
import {CONFIG_ID, type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice";
import {Activity, useEffect, useState} from "react";
import { format } from "date-fns";
import {
  createJobMonitorSlice,
  JOB_MONITOR_ID,
  type JobMonitorActions,
  type JobMonitorState
} from "@/app/job/jobMonitorSlice";
import {createJobMonitorThunks} from "@/app/job/jobMonitorThunks";
import type {JobDataStream, JobStatus, PyJobEvent} from "@/types/models";
// import TerminalView from "@/app/terminal/TerminalView";
import {createPageSlice, PAGE01_ID, type PageActions, type PageState} from "@/app/page/pageSlice";
import classNames from "classnames";
import TerminalView from "@/app/components/terminal/TerminalView";
import PageLineChart from "@/app/components/chart/PageLineChart";
import OutputGrid from "@/app/components/grid/OutputGrid";

interface Props {
  winObjId: WinObjId
}



function Page01View({winObjId}: Props) {
  const configKey = "data\\업체명.xlsx";
  // const jobId = `job-${new Date().getTime()}`
  // chart-line.svg
  // terminal.svg
  // table.svg, table-cells-large.svg, table-cells.svg, table-list.svg
  const [companyList, setCompanyList] = useState<Option[]>([])

  const dispatch = useAppDispatch();
  const {
    state: pageState,
    actions: pageActions,
  } = useDynamicSlice<PageState, PageActions>(PAGE01_ID, createPageSlice)

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

  const [outFile, setOutFile] = useState<string | null>(null);


  useEffect(() => {
    if (!configsState?.configs) return;
    const config = configsState?.configs?.[configKey];
    console.log('config:', config)
    const options = toOptions(config?.data ?? []);
    setCompanyList(options)
    if (options.length > 0 && !pageState?.company) {
      dispatch(pageActions.setCompany(options[0]))
    }
  }, [configsState?.configs]);

  useEffect(() => {
    if (!pageState?.jobInfo) return;

    const status: JobStatus | null = dispatch(jobMonitorThunks.getJobStatus({jobId: pageState.jobInfo.jobId}))
    if (status !== null && pageState.jobInfo.status !== status) {
      console.log('jobStatus:', status)
      dispatch(pageActions.setJobInfo({...pageState.jobInfo, status}))
    }

    const events: PyJobEvent [] = dispatch(jobMonitorThunks.getJobEvents({jobId: pageState.jobInfo?.jobId}))
    const streamEvents = events.filter((event) => event.action === 'PY_JOB_STREAM')
    const logs = streamEvents.map((event) => (event.data as JobDataStream).message ?? '')
    dispatch(pageActions.setLogs(logs))
  }, [jobMonitorState, pageState?.jobInfo]);

  useEffect(() => {
    if (!pageState?.jobInfo) return;
    if (pageState.jobInfo.status === 'DONE') {
      const outFile = `${pageState.jobInfo.args.join('_')}.xlsx`
      setOutFile(outFile);
      // window.pywebview.api.read_data_excel(outFile).then(JSON.parse).then(data => {
      //   console.log('data:', data)
      // })
    }
  }, [pageState?.jobInfo])


  const toOptions = (data: Record<string, string | number | null>[]): Option[] => {
    return data.map(d => {
      return {value: d.cdVlId, label: d.cdVlNm ? d.cdVlNm.toString() : ''}
    })
  }

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
    const script_path = "page01.py"
    const args = [jobId, winObjId.viewId, companyVal?.toString() ?? '', startYm, endYm];
    dispatch(pageActions.setJobInfo({jobId, status: 'RUNNING', path: script_path, args}))
    window.pywebview.api.start_script(jobId, script_path, args).then()
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
                  title={outFile}
                  outFile={`output\\${outFile}`}
              />
            }
          </Activity>
          <Activity mode={pageState?.tab === "GRAPH" ? "visible" : "hidden"}>
            {outFile &&
              <PageLineChart
                  title={outFile}
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
