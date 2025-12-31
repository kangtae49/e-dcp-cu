import {WinInfo} from "@/app/components/just-layout/index.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleQuestion, faCircleInfo, faChartLine, faTableList, faTerminal} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import Jdenticon from "react-jdenticon";
import Page01View from "@/app/page/Page01View.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import GridView from "@/app/grid/ui/GridView.tsx";
import {JustId, JustNode, JustSplitPixels} from "@/app/components/just-layout/justLayoutSlice.ts";
import ChartView from "@/app/chart/ui/ChartView.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar.tsx";
import React from "react";
import JobMonitorView from "@/app/job/ui/JobMonitorView.tsx";
import JustStatusBar from "@/app/status-bar/JustStatusBar.tsx";
import JustUtilBar from "@/app/util-bar/JustUtilBar.tsx";
import JustBottomPanel from "@/app/bottom-panel/JustBottomPanel.tsx";


export const LAYOUT_ID = "JUST-LAYOUT"
export const LAYOUT_DND_TYPE = "JUST_DRAG_SOURCE"
export const LAYOUT_DND_ACCEPT = ["JUST_DRAG_SOURCE"]

export const STATUS_BAR_NODE_NAME = "STATUS_BAR_NODE"

export const BOTTOM_PANEL_NODE_NAME = "BOTTOM_PANEL_NODE"

export const TOOL_BAR_NODE_NAME = "TOOL_BAR_NODE"
export const UTIL_BAR_NODE_NAME = "UTIL_BAR_NODE"


export const SIDE_MENU_NODE_NAME = "SIDE_MENU_NODE"

export const JOB_MONITOR_NODE_NAME = "JOB_MONITOR_NODE"

export const INIT_SIDE_MENU_SIZE = 200

export type ViewId = "status-bar" | "bottom-panel" | "tool-bar" | "util-bar"
  | "side-menu"
  | "page01"
  | "about"
  | "grid-view"
  | "chart-view"
  | "job-monitor-view"
  // | "demo" | "demo-grid" | "demo-line-chart"


export interface SideMenuItem {
  menuId: JustId,
  menuName: string
}
export const statusBarId: JustId = {viewId: 'status-bar', title: 'Status Bar'};
export const bottomPanelId: JustId = {viewId: 'bottom-panel', title: 'Bottom Panel'};
export const toolBarId: JustId = {viewId: 'tool-bar', title: 'Tool Bar'};
export const utilBarId: JustId = {viewId: 'util-bar', title: 'Util Bar'};
export const sideMenuId: JustId = {viewId: 'side-menu', title: 'Menu'};
// export const demoGridId: JustId = {viewId: 'demo-grid'};
export const aboutId: JustId = {viewId: 'about', title: 'About'};

export const page01Id: JustId = {viewId: 'page01', title: '자산통계정보'};

export const jobMonitorId: JustId = {viewId: 'job-monitor-view', title: 'Job Monitor'};

export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: page01Id, menuName: page01Id.title},
  // {menuId: {viewId: 'demo'}, menuName: "Demo"},
  // {menuId: {viewId: 'demo-grid'}, menuName: "Demo Grid"},
  // {menuId: {viewId: 'demo-line-chart'}, menuName: "Demo Line Chart"},
]



export const viewMap: Record<ViewId, WinInfo> = {
  "status-bar": {
    title: "Status Bar",
    icon: <div/>,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    getView: () => {
      return (
        <JustStatusBar/>
      )
    }
  },
  "bottom-panel": {
    title: "Bottom Panel",
    icon: <div/>,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    getView: () => {
      return (
        <JustBottomPanel />
      )
    }
  },
  "util-bar": {
    title: "Util Bar",
    icon: <div/>,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    getView: () => {
      return (
        <JustUtilBar/>
      )
    }
  },
  "tool-bar": {
    title: "Toolbar",
    icon: <div/>,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    getView: () => {
      return (
        <JustToolBar/>
      )
    }
  },
  "side-menu": {
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
    getView: () => {
      return (
        <SideMenu />
      )
    }
  },
  "page01": {
    title: (justId) => justId.title,
    canDup: true,
    icon: <Jdenticon size="30" value={page01Id.viewId} />,
    getView: (justId) => {
      return (
        <Page01View justId={justId!} />
      )
    }
  },
  "about": {
    title: "About",
    icon: <Icon icon={faCircleInfo} />,
    getView: () => {
      return (
        <AboutView />
      )
    }
  },
  "chart-view": {
    title: (justId) => justId.title,
    icon: <Icon icon={faChartLine} />,
    getView: (justId) => {
      return (
        <ChartView justId={justId}/>
      )
    }
  },
  "grid-view": {
    title: (justId) => justId.title,
    icon: <Icon icon={faTableList} />,
    getView: (justId) => {
      return (
        <GridView justId={justId}/>
      )
    }
  },
  "job-monitor-view": {
    title: "Job Monitor",
    icon: <Icon icon={faTerminal} />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    getView: (justId) => {
      return (
        <JobMonitorView justId={justId}/>
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
  direction: 'row',
  name: SIDE_MENU_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 200,
  size: 200,
  // minSize: 38,
  first: {
    type: 'stack',
    tabs: [sideMenuId],
    active: sideMenuId
  },
  second: {
    type: 'split-percentage',
    direction: 'column',
    size: 50,
    first: {
      type: 'stack',
      tabs: [page01Id],
      active: page01Id
    },
    second: {
      type: 'stack',
      tabs: [aboutId],
      active: aboutId
    }
  },
}


// export const jobMonitorLayout: JustNode = {
//   type: 'split-pixels',
//   direction: 'column',
//   name: JOB_MONITOR_NODE_NAME,
//   primary: 'second',
//   primaryDefaultSize: 100,
//   size: 0,
//   first: sideMenuLayout,
//   second: {
//     type: 'stack',
//     tabs: [jobMonitorId],
//     active: jobMonitorId
//
//   }
// }

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
    active: utilBarId
  }
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
    active: toolBarId
  },
  second: layoutUtilBar
}

const layoutBottomPanel: JustSplitPixels  = {
  type: 'split-pixels',
  direction: 'column',
  name: BOTTOM_PANEL_NODE_NAME,
  primary: 'second',
  primaryDefaultSize: 40,
  size: 0,
  noSplitter: true,
  first: layoutToolBar,
  second: {
    type: 'stack',
    tabs: [statusBarId],
    active: statusBarId
  },
}

const layoutStatusBar: JustSplitPixels  = {
  type: 'split-pixels',
  direction: 'column',
  name: STATUS_BAR_NODE_NAME,
  primary: 'second',
  primaryDefaultSize: 40,
  size: 0,
  noSplitter: true,
  first: layoutBottomPanel,
  second: {
    type: 'stack',
    tabs: [statusBarId],
    active: statusBarId
  },
}


export const initialLayoutValue: JustNode = layoutStatusBar


