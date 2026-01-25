import "./PageView.css"
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass, faChartLine, faTerminal, faTableList, faLock,
  faDownload, faPenToSquare, faCircleStop
} from "@fortawesome/free-solid-svg-icons"
import SelectBox, {type Option} from "@/app/components/select/SelectBox.tsx";
import MonthPicker from "@/app/components/date/MonthPicker.tsx";
import React, {Activity, useEffect, useLayoutEffect, useRef} from "react";
import { format } from "date-fns";
import classNames from "classnames";
import Terminal from "@/app/components/terminal/Terminal.tsx";
import {FileItem} from "@/types";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {usePageStore} from "@/app/page/usePageStore.ts";
import {useDrag, useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import JustLineChart, {LegendItem} from "@/app/components/chart/JustLineChart.tsx";
import JustGrid from "@/app/components/grid/JustGrid.tsx";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {JOB_MONITOR_ID} from "@/app/job/jobMonitor.constants.ts";
import {observer} from "mobx-react-lite";
import pathUtils from "@/utils/pathUtils.ts";
import {JSONValue, JustDragItem, JustId, JustUtil} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}



const Page01View = observer(({justId}: Props)=> {
  const dataKey = pathUtils.getScriptSubPath("data\\company.xlsx")
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
  const refJob = useRef<HTMLDivElement>(null)

  const pageStore = usePageStore(JustUtil.toString(justId));

  const jobMonitorStore = useJobMonitor(JOB_MONITOR_ID);

  const gridDataStore = useGridDataStore(GRID_DATA_ID)


  const toOptions = (data: Record<string, string | number | boolean | null>[]): Option[] => {
    return data.map(d => {
      return {value: d.cdVlId, label: d.cdVlNm ? d.cdVlNm.toString() : ''}
    })
  }

  const config = gridDataStore.gridDataMap?.[dataKey];
  const companyList = toOptions(config?.data ?? []);



  const startYm = pageStore.startDate ? format(pageStore.startDate, "yyyyMM") : format(new Date(), "yyyyMM");
  const endYm = pageStore.endDate ? format(pageStore.endDate, "yyyyMM") : format(new Date(), "yyyyMM");
  const companyVal = pageStore.company ? pageStore.company.value : companyList[0]?.value;
  const condition = [justId.viewId, companyVal?.toString() ?? '', startYm, endYm]
  const filename = condition.join("_")
  const outFile = `${filename}.xlsx`
  const outPath = pathUtils.getScriptSubPath(`${pagesDir}\\${outFile}`)
  window.api.addWatchPath([outPath, pathUtils.getLockFile(outPath)]).then()
  const jobStatus = jobMonitorStore.status[pageStore.jobInfo?.jobId ?? '']

  useEffect(() => {
    if (companyList.length > 0 && !pageStore.company) {
      pageStore.setCompany(companyList[0]);
    }
  }, [companyList, pageStore.company]);

  const formatYYMM = (strDt: string) => {
    return format(strDt, 'yy-MM')
  }

  const getTitle = () => {
    if (!pageStore.company) return ''
    if (!pageStore.startDate) return ''
    if (!pageStore.endDate) return ''
    const companyName = pageStore.company.label.slice(0, 2);
    const viewName = '자산';
    const startDate = formatYYMM(pageStore.startDate);
    const endDate = formatYYMM(pageStore.endDate);
    return `${companyName} ${viewName} ${startDate}~${endDate}`
  }

  const onChangeStartDate = (date: string | null) => {
    pageStore.setStartDate(date)
  }

  const onChangeEndDate = (date: string | null) => {
    pageStore.setEndDate(date)
  }

  const handleCompany = (option: Option) => {
    console.log(option)
    pageStore.setCompany(option)
  }
  const searchPage01 = async () => {

    if (!pageStore.startDate || !pageStore.endDate || !pageStore.company) return;

    // const isLock = await window.api.isLockScriptSubPath(outPath);
    if (gridDataStore.gridDataMap?.[outPath]?.isLocked) {
      alert(`Close Excel: ${outPath}`)
      window.api.startFile(outPath).then()
      return
    }

    if (jobStatus === 'RUNNING') return;

    const jobId = `job-${new Date().getTime()}`
    const scriptPath = pathUtils.getScriptSubPath("page01.py")
    const args = [jobId, ...condition];
    pageStore.setJobInfo({jobId, path: scriptPath, args})
    window.api.startScript(jobId, scriptPath, args).then()
  }

  const dragDownload = (e: React.DragEvent) => {
    e.preventDefault()
    window.api.startDrag({
      file: outPath
    })
  }

  const clickDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.openSaveDialog(outPath, outPath).then()
  }

  const clickOpenFile = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.startFile(outPath).then()
  }

  const clickStropScript = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pageStore.jobInfo?.jobId) {
      window.api.stopScript(pageStore.jobInfo?.jobId).then()
    }
  }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(_item: FileItem, monitor) {
      if (gridDataStore.gridDataMap?.[outPath]?.isLocked) {
        alert(`Close Excel: ${outPath}`)
        window.api.startFile(outPath).then()
        return
      }

      const fileItem = monitor.getItem<FileItem>()
      const filePath = window.api.getPathForFile(fileItem.files[0])
      if (!filePath.endsWith('.xlsx')) {
        return
      }
      console.log(filePath, outPath)
      window.api.uploadFile(filePath, outPath).then()
    }
  }), [outPath, gridDataStore.gridDataMap?.[outPath]?.isLocked])

  const [, dragGrid] = useDrag({
    type: justId.viewId,
    canDrag: () => !!gridDataStore.gridDataMap?.[outPath],
    item: () => {
      const item: JustDragItem = {
        justId: {
          viewId: "grid-data-view",
          title: getTitle(),
          params: {
            file: outPath,
          }
        },
      }
      return item;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, _monitor) => {
    }
  })


  const [, dragChart] = useDrag({
    type: 'chart-view',
    canDrag: () => !!gridDataStore.gridDataMap?.[outPath],
    item: () => {
      const item: JustDragItem = {
        justId: {
          viewId: "chart-view",
          title: getTitle(),
          params: {
            file: outPath,
            xAxisCol: xAxisCol,
            legend: legend as unknown as JSONValue,
          }
        },
      }
      return item;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, _monitor) => {
    }
  })

  const [, dragJob] = useDrag({
    type: 'job-monitor-view',
    canDrag: () => !!pageStore.jobInfo?.jobId,
    item: () => {
      const jobId = pageStore.jobInfo?.jobId ?? '';
      const item: JustDragItem = {
        justId: {
          viewId: "job-monitor-view",
          title: pageStore.jobInfo?.jobId ?? '',
          params: {
            jobId
          }
        },
      }
      return item;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, _monitor) => {
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

  useLayoutEffect(() => {
    if (refJob.current) {
      dragJob(refJob);
    }
  }, [dragJob]);


  // useEffect(() => {
  //   pathUtils.getScriptSubPath("data\\company.xlsx").then(setDataKey)
  // }, [])
  return (
    <div className="win-page"
         ref={ref}
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
                  value={pageStore.company?.value}
                  options={companyList}
                />
              </div>
            </div>
            <div className="search-item">
              <div className="search-item-label">조회기간</div>
              <div className="search-item-value">
                <MonthPicker value={pageStore.startDate} onChange={onChangeStartDate} />
              </div>
              <div>~</div>
              <div className="search-item-value">
                <MonthPicker value={pageStore.endDate} onChange={onChangeEndDate} />
              </div>
            </div>
            <div className="search-box">
              <div className={classNames(
                "search-icon-btn",
                )}
                onClick={() => searchPage01()}
              >
                <div className="search-icon">
                  {jobStatus === 'RUNNING' ?
                    <div className="spinner"></div>
                    :
                    <Icon icon={faMagnifyingGlass} />
                  }
                </div>
                <div className="search-btn-label">
                  검색
                </div>
                {
                  gridDataStore.gridDataMap?.[outPath]?.isLocked &&
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
                  "active": pageStore.tab === "GRAPH",
                }
              )}
              onClick={()=> pageStore.setTab('GRAPH')}>
            <Icon icon={faChartLine} />graph
          </div>
          <div
            ref={refGrid}
            // onDragStart={onDragStart}
            className={classNames(
            "tab-title",
                {
                  "active": pageStore.tab === "GRID",
                }
              )}
              onClick={()=> pageStore.setTab('GRID')}>
            <Icon icon={faTableList} />grid
          </div>
          <div
            ref={refJob}
            className={classNames("tab-title",
                {
                  "active": pageStore.tab === "LOG",
                }
              )}
              onClick={()=> pageStore.setTab('LOG')}>
            <Icon icon={faTerminal} />log
          </div>
          {gridDataStore.gridDataMap[outPath] &&
          <div>
            <div
              draggable={true}
              onDragStart={dragDownload}
              onClick={clickDownload}
            >
              <Icon icon={faDownload} />
            </div>
          </div>
          }
          {gridDataStore.gridDataMap[outPath] &&
          <div>
            <div
              onClick={clickOpenFile}
            >
              <Icon icon={faPenToSquare} />
            </div>
          </div>
          }
          {/*{pageState?.jobInfo?.jobId &&*/}
          {/*<div>*/}
          {/*  <div*/}
          {/*    onClick={clickJobMonitor}*/}
          {/*  >*/}
          {/*    <Icon icon={faTerminal} />*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*}*/}
          { jobStatus === 'RUNNING' &&
          <div>
            <div
              onClick={clickStropScript}
            >
              <Icon icon={faCircleStop} />
            </div>
          </div>
          }

        </div>
        <div className="tab-body">
          <Activity mode={pageStore.tab === "GRID" ? "visible" : "hidden"}>
            <div className="content">
              <JustGrid
                key={outPath}
                dataKey={outPath}
              />
            </div>
          </Activity>
          <Activity mode={pageStore.tab === "GRAPH" ? "visible" : "hidden"}>
            <div className="content">
              <JustLineChart
                key={outPath}
                dataKey={outPath}
                xAxisCol={xAxisCol}
                legend={legend}
              />
            </div>
          </Activity>
          <Activity mode={pageStore.tab === "LOG" ? "visible" : "hidden"}>
            <div className="content">
              <Terminal
                key={pageStore.jobInfo?.jobId ?? ''}
                jobId={pageStore.jobInfo?.jobId ?? ''}
              />
            </div>
          </Activity>

        </div>
      </div>

    </div>
  )
})

export default Page01View;
