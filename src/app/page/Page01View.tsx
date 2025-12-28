import "./PageView.css"
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass, faChartLine, faTerminal, faTableList, faLock} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox.tsx";
import MonthPicker from "@/app/components/date/MonthPicker.tsx";
import {GRID_DATA_ID} from "@/app/grid/gridDataSlice.ts";
import React, {Activity, useEffect, useLayoutEffect, useRef} from "react";
import { format } from "date-fns";
import {
  JOB_MONITOR_ID,
} from "@/app/job/jobMonitorSlice";
import classNames from "classnames";
import Terminal from "@/app/components/terminal/Terminal.tsx";
import OutputGrid from "@/app/components/grid/OutputGrid";
import {JobEvent, JobStatus} from "@/types";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import useGridData from "@/app/grid/useGridData.ts";
import usePage from "@/app/page/usePage.ts";
import {JSONValue, JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import {useDrag, useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import {JUST_DRAG_SOURCE} from "@/app/components/just-layout";
import {JustDragItem} from "@/app/components/just-layout/ui/JustDraggableTitle.tsx";
import BaseLineChart, {LegendItem} from "@/app/components/chart/BaseLineChart.tsx";

interface Props {
  justId: JustId
}

interface FileItem {
  files: File[];
}

function Page01View({justId}: Props) {
  const dataKey = "data\\company.xlsx";
  const pagesDir = "pages";
  const xAxisCol =  "stdrYm";
  const legend: LegendItem [] = [
    {
      id: "cpstrtRlest",
      name: "cpstrtRlest",
      color: "#ca2828"
    },
    {
      id: "cpstrtVlscrt",
      name: "cpstrtVlscrt",
      color: "#1140bd"
    }
  ]
  const ref = useRef<HTMLDivElement>(null)
  const refGrid = useRef<HTMLDivElement>(null)
  const refChart = useRef<HTMLDivElement>(null)

  const {
    state: pageState,
    setCompany,
    setEvents,
    setJobInfo,
    setStartDate,
    setEndDate,
    setTab,
  } = usePage(JustUtil.toString(justId));

  const {
    state: jobMonitorState,
    getJobStatus,
    getJobEvents,
    clearEvents,
  } = useJobMonitor(JOB_MONITOR_ID);

  const {
    state: gridDataState,
    updateGridData,
  } = useGridData(GRID_DATA_ID)

  // const [outFile, setOutFile] = React.useState<string>('');

  const toOptions = (data: Record<string, string | number | boolean | null>[]): Option[] => {
    return data.map(d => {
      return {value: d.cdVlId, label: d.cdVlNm ? d.cdVlNm.toString() : ''}
    })
  }

  const config = gridDataState?.gridDataMap?.[dataKey];
  const companyList = toOptions(config?.data ?? []);



  const startYm = pageState?.startDate ? format(pageState.startDate, "yyyyMM") : format(new Date(), "yyyyMM");
  const endYm = pageState?.endDate ? format(pageState.endDate, "yyyyMM") : format(new Date(), "yyyyMM");
  const companyVal = pageState?.company ? pageState.company.value : companyList[0]?.value;
  const args = [justId.viewId, companyVal?.toString() ?? '', startYm, endYm].join("_")
  const outFile = `${args}.xlsx`
  const outPath = `${pagesDir}\\${outFile}`


  useEffect(() => {
    window.api.readDataExcel(outPath)
      .then((gridData) => {
        if (gridData) {
          updateGridData(gridData)
        }
      })
  }, [outPath])

  // const jobInfo = pageState?.jobInfo;
  // const outFile = jobInfo?.status === 'DONE'
  //   ? `${jobInfo.args.slice(1).join('_')}.xlsx`
  //   : '';

  useEffect(() => {
    if (companyList.length > 0 && !pageState?.company) {
      setCompany(companyList[0]);
    }
  }, [companyList, pageState?.company]);


  useEffect(() => {
    if (!pageState?.jobInfo) return;

    const status: JobStatus | null = getJobStatus(pageState.jobInfo.jobId)
    if (status !== null && pageState.jobInfo.status !== status) {
      console.log('jobStatus:', status)
      setJobInfo({...pageState.jobInfo, status})
    }

    const events: JobEvent [] = getJobEvents(pageState.jobInfo?.jobId)
    // const streamEvents = events.filter((event) => event.action === 'JOB_STREAM')
    // const logs = streamEvents.map((event) => (event.data as JobStreamData))
    setEvents(events)
  }, [jobMonitorState, pageState?.jobInfo]);


  const onChangeStartDate = (date: string | null) => {
    console.log('onChangeStartDate:', date)
    setStartDate(date)
  }

  const onChangeEndDate = (date: string | null) => {
    console.log('onChangeEndDate:', date)
    setEndDate(date)
  }

  const handleCompany = (option: Option) => {
    setCompany(option)
  }
  const searchPage01 = async () => {

    if (!pageState?.startDate || !pageState?.endDate || !pageState?.company) return;

    const isLock = await window.api.isLockScriptSubPath(outPath);
    if (isLock) {
      alert(`Close Excel: ${outPath}`)
      window.api.startDataFile(outPath).then()
      return
    }

    const startYm = format(pageState.startDate, "yyyyMM");
    const endYm = format(pageState.endDate, "yyyyMM");
    const companyVal = pageState.company.value;

    if (pageState.jobInfo !== null && pageState.jobInfo.status === 'RUNNING') return;
    console.log('searchPage01')

    if (pageState.jobInfo) {
      clearEvents(pageState.jobInfo?.jobId)
    }
    const jobId = `job-${new Date().getTime()}`
    const scriptPath = "page01.py"
    const args = [jobId, justId.viewId, companyVal?.toString() ?? '', startYm, endYm];
    setJobInfo({jobId, status: 'RUNNING', path: scriptPath, args})
    window.api.startScript(jobId, scriptPath, args).then()
  }

  // useEffect(() => {
  //   if (!pageState?.startDate || !pageState?.endDate || !pageState?.company) return ;
  //   const startYm = format(pageState.startDate, "yyyyMM");
  //   const endYm = format(pageState.endDate, "yyyyMM");
  //   const companyVal = pageState.company.value;
  //   const args = [justId.viewId, companyVal?.toString() ?? '', startYm, endYm].join("_")
  //   setOutFile(`${args}.xlsx`)
  // }, [pageState])



  // const onDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log(e.dataTransfer?.files)
  //   const path = window.api.getPathForFile(e.dataTransfer?.files[0])
  //   console.log('onDrop:', path)
  // }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: FileItem, monitor) {
      console.log('drop:', item)
      const fileItem = monitor.getItem<FileItem>()
      const path = window.api.getPathForFile(fileItem.files[0])
      console.log(path)
    }
  }), [ref])

  const [, dragGrid] = useDrag({
    type: JUST_DRAG_SOURCE,
    item: () => {
      const item: JustDragItem = {
        // direction: 'row',
        // index: -1,
        // justBranch: [],
        justId: {
          viewId: "grid-view",
          params: {
            title: outFile,
            file: outPath,
          }
        },
        // pos: "first"
        // file: `output\\${outFile}`,
      }
      // const filePath = `output\\${outFile}`;
      // setTimeout(() => {
      //   window.api.startDrag(`output\\${outFile}`)
      // }, 50)
      return item;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log('drag end', item, monitor);
    }
  })


  const [, dragChart] = useDrag({
    type: JUST_DRAG_SOURCE,
    item: () => {
      const item: JustDragItem = {
        // direction: 'row',
        // index: -1,
        // justBranch: [],
        justId: {
          viewId: "chart-view",
          params: {
            title: outFile,
            file: outPath,
            xAxisCol: xAxisCol,
            legend: legend as unknown as JSONValue,
          }
        },
        // pos: "first"
        // file: `output\\${outFile}`,
      }
      // const filePath = `output\\${outFile}`;
      // setTimeout(() => {
      //   window.api.startDrag(`output\\${outFile}`)
      // }, 50)
      return item;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log('drag end', item, monitor);
    }
  })

  // const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   window.api.startDrag(`output\\${outFile}`)
  // }, [outFile])

  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);

  useLayoutEffect(() => {
    if (refGrid.current) {
      dragGrid(refGrid);
    }
  }, [dragGrid]);

  useLayoutEffect(() => {
    if (refChart.current) {
      dragChart(refChart);
    }
  }, [dragChart]);

  // useEffect(() => {
  //   if(!pageState) return;
  //   if (!pageState.startDate) {
  //     setStartDate(format(new Date(), "yyyyMM"))
  //   }
  //   if (!pageState.endDate) {
  //     setEndDate(format(new Date(), "yyyyMM"))
  //   }
  //   if (!pageState.company) {
  //     setCompany(companyList[0])
  //   }
  // }, [pageState])



  return (
    <div className="win-page"
         ref={ref}
      // onDrop={onDropFiles}
    >
      <div className="page-title">
        <div className="page-icon">
          <Jdenticon size="25" value={justId.viewId} />
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
              <div className={classNames(
                "search-icon-btn",
                )}
                onClick={() => searchPage01()}
              >
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
                {
                  gridDataState?.gridDataMap?.[outPath]?.isLocked &&
                  <div className="badge-wrap">
                    <div className="badge" style={{top: "-13px", left: "-5px"}}>
                      <Icon icon={faLock} />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="tabs">
          <div
            ref={refChart}
            className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "GRAPH",
                }
              )}
              onClick={()=> setTab('GRAPH')}>
            <Icon icon={faChartLine} />graph
          </div>
          <div
            ref={refGrid}
            // onDragStart={onDragStart}
            className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "GRID",
                }
              )}
              onClick={()=> setTab('GRID')}>
            <Icon icon={faTableList} />grid
          </div>
          <div className={classNames(
            "tab-title",
                {
                  "active": pageState?.tab === "LOG",
                }
              )}
              onClick={()=> setTab('LOG')}>
            <Icon icon={faTerminal} />log
          </div>
        </div>
        <div className="tab-body">
          <Activity mode={pageState?.tab === "LOG" ? "visible" : "hidden"}>
            <Terminal
                key={outPath}
                events={pageState?.events ?? []}
            />
          </Activity>
          <Activity mode={pageState?.tab === "GRID" ? "visible" : "hidden"}>
            <OutputGrid
                key={`${pagesDir}\\${outFile}`}
                title={outFile ?? ''}
                outFile={outPath}
            />
          </Activity>
          <Activity mode={pageState?.tab === "GRAPH" ? "visible" : "hidden"}>
            <BaseLineChart
              key={`${pagesDir}\\${outFile}`}
              dataKey={`${pagesDir}\\${outFile}`}
              xAxisCol={xAxisCol}
              legend={legend}
            />
          </Activity>
        </div>
      </div>

    </div>
  )
}

export default Page01View;
