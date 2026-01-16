import {WinInfo} from "@/app/components/just-layout/index.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleQuestion, faCircleInfo, faChartLine, faTableList, faTerminal, faPen} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import Jdenticon from "react-jdenticon";
import Page01View from "@/app/page/Page01View.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import GridDataView from "@/app/grid-data/ui/GridDataView.tsx";
import ChartView from "@/app/chart/ui/ChartView.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar.tsx";
import React from "react";
import JobMonitorView from "@/app/job/ui/JobMonitorView.tsx";
import JustStatusBar from "@/app/status-bar/JustStatusBar.tsx";
import JustUtilBar from "@/app/util-bar/JustUtilBar.tsx";
import JustBottomPanel from "@/app/bottom-panel/JustBottomPanel.tsx";
import JobListView from "@/app/job/ui/JobListView.tsx";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {CounterView} from "@/app/counter/CounterView.tsx";
import {JustId, JustNode, JustSplitPixels} from "@/app/components/just-layout/justLayout.types.ts";
import TopMenuBar from "@/app/top-menu/TopMenuBar.tsx";
import ExcalidrawView from "@/app/excalidraw/ExcalidrawView.tsx";
import ExcalidrawDataView from "@/app/excalidraw-data/ExcalidrawDataView.tsx";
import pathUtils from "@/utils/pathUtils.ts";


export const LAYOUT_ID = "LAYOUT_ID"



export const TOP_MENU_NODE_NAME = "TOP_MENU_NODE_NAME"

export const STATUS_BAR_NODE_NAME = "STATUS_BAR_NODE"

export const BOTTOM_PANEL_NODE_NAME = "BOTTOM_PANEL_NODE"

export const TOOL_BAR_NODE_NAME = "TOOL_BAR_NODE"
export const UTIL_BAR_NODE_NAME = "UTIL_BAR_NODE"


export const SIDE_MENU_NODE_NAME = "SIDE_MENU_NODE"

export const JOB_MONITOR_LIST_NODE_NAME = "JOB_MONITOR_LIST_NODE"
export const JOB_MONITOR_VIEW_NODE_NAME = "JOB_MONITOR_VIEW_NODE"

export const CONTENTS_VIEW = "CONTENTS_VIEW"

export const INIT_SIDE_MENU_SIZE = 200
export const INIT_BOTTOM_PANEL_SIZE = 200

export type ViewId = "top-menu" | "status-bar"
  | "bottom-panel" | "tool-bar" | "util-bar"
  | "side-menu"
  | "page01"
  | "about" | "help"
  | "grid-data-view"
  | "chart-view"
  | "job-list-view"
  | "job-monitor-view"
  | "excalidraw-data-view" | "excalidraw-view"
  | "counter-view"
  // | "demo" | "demo-grid" | "demo-line-chart"

export const DND_ACCEPT_CONTENT = [
  "page01",
  "grid-data-view", "chart-view", "job-monitor-view",
  "about", "help",
  "excalidraw-view", "excalidraw-data-view",
]

export interface SideMenuItem {
  menuId: JustId,
  menuName: string
}

export const topMenuId: JustId = {viewId: 'top-menu', title: 'Top Menu'};
export const statusBarId: JustId = {viewId: 'status-bar', title: 'Status Bar'};
export const toolBarId: JustId = {viewId: 'tool-bar', title: 'Tool Bar'};
export const utilBarId: JustId = {viewId: 'util-bar', title: 'Util Bar'};
export const sideMenuId: JustId = {viewId: 'side-menu', title: 'Menu'};
export const aboutId: JustId = {viewId: 'about', title: 'About'};
export const helpId: JustId = {viewId: 'help', title: 'Help', params: {file: pathUtils.getScriptSubPath('data\\help.excalidraw')}};

export const page01Id: JustId = {viewId: 'page01', title: '자산통계정보'};

export const jobListViewId: JustId = {viewId: 'job-list-view', title: 'Job List'};


export const excalidrawViewId: JustId = {viewId: 'excalidraw-view', title: 'Excalidraw View'};

export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: page01Id, menuName: page01Id.title},
  // {menuId: {viewId: 'demo'}, menuName: "Demo"},
  // {menuId: {viewId: 'demo-grid'}, menuName: "Demo Grid"},
  // {menuId: {viewId: 'demo-line-chart'}, menuName: "Demo Line Chart"},
]



export const viewMap: Record<ViewId, WinInfo> = {
  "top-menu": {
    title: "Top Menu",
    icon: <div/>,
    getView: (justId, layoutId) => {
      return (
        <TopMenuBar justId={justId} layoutId={layoutId}/>
      )
    }
  },
  "status-bar": {
    title: "Status Bar",
    icon: <div/>,
    getView: (justId, layoutId) => {
      return (
        <JustStatusBar justId={justId} layoutId={layoutId} />
      )
    }
  },
  "bottom-panel": {
    title: "Bottom Panel",
    icon: <div/>,
    getView: (justId, layoutId) => {
      return (
        <JustBottomPanel justId={justId} layoutId={layoutId} />
      )
    }
  },
  "util-bar": {
    title: "Util Bar",
    icon: <div/>,
    getView: (justId, layoutId) => {
      return (
        <JustUtilBar justId={justId} layoutId={layoutId} />
      )
    }
  },
  "tool-bar": {
    title: "Toolbar",
    icon: <div/>,
    getView: (justId, layoutId) => {
      return (
        <JustToolBar justId={justId} layoutId={layoutId} />
      )
    }
  },
  "side-menu": {
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    // showClose: false,
    getView: (justId, layoutId) => {
      return (
        <SideMenu justId={justId} layoutId={layoutId} />
      )
    }
  },
  "page01": {
    title: (justId) => justId.title,
    canDup: true,
    canFullScreen: true,
    icon: <Jdenticon size="30" value={page01Id.viewId} />,
    getView: (justId, layoutId) => {
      return (
        <Page01View justId={justId} layoutId={layoutId} />
      )
    }
  },
  "about": {
    title: "About",
    icon: <Icon icon={faCircleInfo} />,
    getView: (justId, layoutId) => {
      return (
        <AboutView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "help": {
    title: "Help",
    canFullScreen: true,
    icon: <Icon icon={faCircleQuestion} />,
    getView: (justId, layoutId) => {
      return (
        <ExcalidrawDataView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "chart-view": {
    title: (justId) => justId.title,
    icon: <Icon icon={faChartLine} />,
    getView: (justId, layoutId) => {
      return (
        <ChartView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "grid-data-view": {
    title: (justId) => justId.title,
    icon: <Icon icon={faTableList} />,
    getView: (justId, layoutId) => {
      return (
        <GridDataView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "job-list-view": {
    title: "Job Monitor",
    icon: <Icon icon={faTerminal} />,
    getView: (justId, layoutId) => {
      return (
        <JobListView justId={justId} layoutId={layoutId} />
      )
    }

  },
  "job-monitor-view": {
    title: (justId) => JustUtil.getParamString(justId, 'jobId'),
    icon: <Icon icon={faTerminal} />,
    getView: (justId, layoutId) => {
      return (
        <JobMonitorView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "excalidraw-view": {
    title: 'Excalidraw',
    icon: <Icon icon={faPen} />,
    canDup: true,
    canFullScreen: true,
    getView: (justId, layoutId) => {
      return (
        <ExcalidrawView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "excalidraw-data-view": {
    title: (justId) => justId.title,
    icon: <Icon icon={faPen} />,
    canFullScreen: true,
    getView: (justId, layoutId) => {
      return (
        <ExcalidrawDataView justId={justId} layoutId={layoutId} />
      )
    }
  },
  "counter-view": {
    title: (justId) => JustUtil.getParamString(justId, 'jobId'),
    icon: <Jdenticon size="30" value="counter-view" />,
    canDup: true,
    getView: (justId, layoutId) => {
      return (
        <CounterView justId={justId} layoutId={layoutId} />
      )
    }
  }
  // "demo": () => ({
  //   title: "Demo",
  //   icon: <Jdenticon size="30" value="demo" />,
  //   view: <DemoView />
  // }),
  // "demo-grid": () => ({
  //   title: "Demo Grid",
  //   icon: <Jdenticon size="30" value="demo-grid" />,
  //   view: <DemoGridView />
  // }),
  // "demo-line-chart": () => ({
  //   title: "Demo Line Chart",
  //   icon: <Jdenticon size="30" value="demo-line-chart" />,
  //   view: <DemoLineChartView />
  // }),

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
}
// as Record<ViewId, WinInfo>;
// } as Record<ViewId, GetWinInfoFn>;


// CONFIG_KEYS.forEach((justId: JustId) => {
//
//   viewMap[justId.viewId as ViewId] = (justId: JustId) => ({
//     title: JustUtil.getParamString(justId, 'title'),
//     icon: <Jdenticon size="30" value={"setting-config"} />,
//     view: <GridView justId={justId} />
//   });
// })




export const layoutSideMenu: JustNode = {
  type: 'split-pixels',
  name: SIDE_MENU_NODE_NAME,
  direction: 'row',
  primary: 'first',
  primaryDefaultSize: 200,
  size: 200,
  // minSize: 38,
  first: {
    type: 'stack',
    tabs: [sideMenuId],
    active: sideMenuId,
    hideTitle: true,
  },
  second: {
    type: 'split-percentage',
    name: CONTENTS_VIEW,
    direction: 'column',
    size: 50,
    dndAccept: DND_ACCEPT_CONTENT,
    first: {
      type: 'stack',
      tabs: [page01Id],
      active: page01Id
    },
    second: {
      type: 'stack',
      tabs: [aboutId, excalidrawViewId],
      active: excalidrawViewId
    }
  },
}




const layoutUtilBar: JustSplitPixels = {
  type: 'split-pixels',
  direction: 'row',
  name: UTIL_BAR_NODE_NAME,
  primary: 'second',
  primaryDefaultSize: 40,
  size: 0,
  noSplitter: true,
  first: layoutSideMenu,
  second: {
    type: 'stack',
    tabs: [utilBarId],
    active: utilBarId,
    hideTitle: true,
  }
}

const layoutJobMonitor: JustSplitPixels = {
  type: 'split-pixels',
  direction: 'row',
  name: JOB_MONITOR_LIST_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 200,
  size: 200,
  noSplitter: false,
  first: {
    type: 'stack',
    tabs: [jobListViewId],
    active: jobListViewId,
    hideTitle: true,
  },
  second: {
    type: 'stack',
    tabs: [],
    active: null,
    name: JOB_MONITOR_VIEW_NODE_NAME,
    dndAccept: ['job-monitor-view'],
  }
}

const layoutBottomPanel: JustSplitPixels  = {
  type: 'split-pixels',
  direction: 'column',
  name: BOTTOM_PANEL_NODE_NAME,
  primary: 'second',
  primaryDefaultSize: INIT_BOTTOM_PANEL_SIZE,
  size: INIT_BOTTOM_PANEL_SIZE,
  primaryHide: true,
  // noSplitter: false,
  first: layoutUtilBar,
  second: layoutJobMonitor,
}
const layoutToolBar: JustSplitPixels  = {
  type: 'split-pixels',
  direction: 'row',
  name: TOOL_BAR_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 40,
  size: 40,
  noSplitter: true,
  first: {
    type: 'stack',
    tabs: [toolBarId],
    active: toolBarId,
    hideTitle: true,
  },
  second: layoutBottomPanel
}

const layoutStatusBar: JustSplitPixels  = {
  type: 'split-pixels',
  direction: 'column',
  name: STATUS_BAR_NODE_NAME,
  primary: 'second',
  primaryDefaultSize: 40,
  size: 34,
  noSplitter: true,
  first: layoutToolBar,
  second: {
    type: 'stack',
    tabs: [statusBarId],
    active: statusBarId,
    hideTitle: true
  },
}

const layoutTopMenu: JustSplitPixels = {
  type: 'split-pixels',
  direction: 'column',
  name: TOP_MENU_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 40,
  size: 40,
  noSplitter: true,
  first: {
    type: 'stack',
    tabs: [topMenuId],
    active: topMenuId,
    hideTitle: true
  },
  second: layoutStatusBar
}


export const initialLayoutValue: JustNode = layoutTopMenu


