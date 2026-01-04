import "./PageView.css"
import Jdenticon from "react-jdenticon";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass, faChartLine, faTerminal, faTableList, faLock,
  faDownload, faPenToSquare, faCircleStop
} from "@fortawesome/free-solid-svg-icons"
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
import {FileItem} from "@/types";
import useJobMonitor from "@/app/job/useJobMonitor.ts";
import useGridData from "@/app/grid/useGridData.ts";
import usePage from "@/app/page/usePage.ts";
import {JSONValue, JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import {useDrag, useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import {JustDragItem} from "@/app/components/just-layout/ui/JustDraggableTitle.tsx";
import JustLineChart, {LegendItem} from "@/app/components/chart/JustLineChart.tsx";
import JustGrid from "@/app/components/grid/JustGrid.tsx";
// import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
// import {BOTTOM_PANEL_NODE_NAME, JOB_MONITOR_VIEW_NODE_NAME, LAYOUT_ID} from "@/app/layout/layout.tsx";

interface Props {
  justId: JustId
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
  const refJob = useRef<HTMLDivElement>(null)

  // const {
  //   showWin,
  //   addTabWinByNodeName
  // } = useJustLayout(LAYOUT_ID)
  const {
    state: pageState,
    setCompany,
    setJobInfo,
    setStartDate,
    setEndDate,
    setTab,
  } = usePage(JustUtil.toString(justId));

  const {
    state: jobState,
  } = useJobMonitor(JOB_MONITOR_ID);

  const {
    state: gridDataState,
    updateGridData,
  } = useGridData(GRID_DATA_ID)


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
  const condition = [justId.viewId, companyVal?.toString() ?? '', startYm, endYm]
  const filename = condition.join("_")
  const outFile = `${filename}.xlsx`
  const outPath = `${pagesDir}\\${outFile}`

  const jobStatus = jobState?.status[pageState?.jobInfo?.jobId ?? '']

  useEffect(() => {
    window.api.readDataExcel(outPath)
      .then((gridData) => {
        if (gridData) {
          updateGridData(gridData)
        }
      })
  }, [outPath])

  useEffect(() => {
    if (companyList.length > 0 && !pageState?.company) {
      setCompany(companyList[0]);
    }
  }, [companyList, pageState?.company]);

  // const getCompanyName = (cdVlId: string) => {
  //   return companyList.find((opt) => opt.value === cdVlId)?.label || ''
  // }

  const formatYYMM = (strDt: string) => {
    return format(strDt, 'yy-MM')
  }

  const getTitle = () => {
    if (!pageState?.company) return ''
    if (!pageState?.startDate) return ''
    if (!pageState?.endDate) return ''
    const companyName = pageState.company.label.slice(0, 2);
    const viewName = '자산';
    const startDate = formatYYMM(pageState.startDate);
    const endDate = formatYYMM(pageState.endDate);
    return `${companyName} ${viewName} ${startDate}~${endDate}`
  }

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

    // const isLock = await window.api.isLockScriptSubPath(outPath);
    if (gridDataState?.gridDataMap?.[outPath]?.isLocked) {
      alert(`Close Excel: ${outPath}`)
      window.api.startDataFile(outPath).then()
      return
    }

    if (jobStatus === 'RUNNING') return;
    console.log('searchPage01')

    const jobId = `job-${new Date().getTime()}`
    const scriptPath = "page01.py"
    const args = [jobId, ...condition];
    setJobInfo({jobId, path: scriptPath, args})
    window.api.startScript(jobId, scriptPath, args).then()
  }

  const dragDownload = (e: React.DragEvent) => {
    console.log('onDragDownload', outPath)
    e.preventDefault()
    window.api.startDrag({
      file: outPath
    })
  }

  const clickDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('clickDownload', outPath)
    window.api.openSaveDialog(outPath, outPath).then()
  }

  // const clickJobMonitor = (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   const jobId = pageState?.jobInfo?.jobId;
  //   console.log('clickJobMonitor', jobId)
  //   if (jobId) {
  //     addTabWinByNodeName({viewId: "job-monitor-view", title: jobId, params: {jobId}}, JOB_MONITOR_VIEW_NODE_NAME)
  //     showWin(BOTTOM_PANEL_NODE_NAME, true)
  //   }
  // }

  const clickOpenFile = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.startDataFile(outPath).then()
  }

  const clickStropScript = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pageState?.jobInfo?.jobId) {
      window.api.stopScript(pageState?.jobInfo?.jobId).then()
    }
  }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: FileItem, monitor) {
      console.log('drop:', item)
      if (gridDataState?.gridDataMap?.[outPath]?.isLocked) {
        alert(`Close Excel: ${outPath}`)
        window.api.startDataFile(outPath).then()
        return
      }

      const fileItem = monitor.getItem<FileItem>()
      const path = window.api.getPathForFile(fileItem.files[0])
      window.api.uploadFile(path, outPath).then()
    }
  }), [ref, gridDataState?.gridDataMap?.[outPath]?.isLocked])

  const [, dragGrid] = useDrag({
    type: justId.viewId,
    canDrag: () => !!gridDataState?.gridDataMap?.[outPath],
    item: () => {
      const item: JustDragItem = {
        justId: {
          viewId: "grid-view",
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
    end: (item, monitor) => {
      console.log('drag end', item, monitor);
    }
  })


  const [, dragChart] = useDrag({
    type: 'chart-view',
    canDrag: () => !!gridDataState?.gridDataMap?.[outPath],
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
    end: (item, monitor) => {
      console.log('drag end', item, monitor);
    }
  })

  const [, dragJob] = useDrag({
    type: 'job-monitor-view',
    canDrag: () => !!pageState?.jobInfo?.jobId,
    item: () => {
      const jobId = pageState?.jobInfo?.jobId ?? '';
      const item: JustDragItem = {
        justId: {
          viewId: "job-monitor-view",
          title: pageState?.jobInfo?.jobId ?? '',
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

  useLayoutEffect(() => {
    if (refJob.current) {
      dragJob(refJob);
    }
  }, [dragJob]);

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
          <div
            ref={refJob}
            className={classNames("tab-title",
                {
                  "active": pageState?.tab === "LOG",
                }
              )}
              onClick={()=> setTab('LOG')}>
            <Icon icon={faTerminal} />log
          </div>
          {gridDataState?.gridDataMap[outPath] &&
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
          {gridDataState?.gridDataMap[outPath] &&
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
          <Activity mode={pageState?.tab === "GRID" ? "visible" : "hidden"}>
            <div className="content">
              <JustGrid
                key={outPath}
                dataKey={outPath}
              />
            </div>
            {/*<OutputGrid*/}
            {/*    key={outPath}*/}
            {/*    title={outFile ?? ''}*/}
            {/*    outFile={outPath}*/}
            {/*/>*/}
          </Activity>
          <Activity mode={pageState?.tab === "GRAPH" ? "visible" : "hidden"}>
            <div className="content">
              <JustLineChart
                key={outPath}
                dataKey={outPath}
                xAxisCol={xAxisCol}
                legend={legend}
              />
            </div>
          </Activity>
          <Activity mode={pageState?.tab === "LOG" ? "visible" : "hidden"}>
            <div className="content">
              <Terminal
                key={pageState?.jobInfo?.jobId ?? ''}
                jobId={pageState?.jobInfo?.jobId ?? ''}
              />
            </div>
          </Activity>

        </div>
      </div>

    </div>
  )
}

export default Page01View;
