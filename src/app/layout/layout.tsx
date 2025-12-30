import {WinInfo} from "@/app/components/just-layout/index.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleQuestion, faCircleInfo, faChartLine, faTableList} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import Jdenticon from "react-jdenticon";
import Page01View from "@/app/page/Page01View.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import GridView from "@/app/grid/ui/GridView.tsx";
import {JustId, JustNode} from "@/app/components/just-layout/justLayoutSlice.ts";
import ChartView from "@/app/chart/ui/ChartView.tsx";
import JustToolBar from "@/app/tool-bar/JustToolBar.tsx";
import React from "react";


export const LAYOUT_ID = "JUST-LAYOUT"

export const TOOLBAR_NODE_NAME = "toolbar"
export const SIDE_MENU_NODE_NAME = "side-menu"
export const INIT_SIDE_MENU_SIZE = 200

export type ViewId = "toolbar" | "side-menu"
  | "page01"
  | "about"
  | "grid-view"
  | "chart-view"
  // | "demo" | "demo-grid" | "demo-line-chart"


export interface SideMenuItem {
  menuId: JustId,
  menuName: string
}
export const toolbarId: JustId = {viewId: 'toolbar', title: 'Toolbar'};
export const sideMenuId: JustId = {viewId: 'side-menu', title: 'Menu'};
// export const demoGridId: JustId = {viewId: 'demo-grid'};
export const aboutId: JustId = {viewId: 'about', title: 'About'};

export const page01Id: JustId = {viewId: 'page01', title: '자산통계정보'};

export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: page01Id, menuName: page01Id.title},
  // {menuId: {viewId: 'demo'}, menuName: "Demo"},
  // {menuId: {viewId: 'demo-grid'}, menuName: "Demo Grid"},
  // {menuId: {viewId: 'demo-line-chart'}, menuName: "Demo Line Chart"},
]



const viewMap: Record<ViewId, WinInfo> = {
  "toolbar": {
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
    icon: <Jdenticon size="30" value={page01Id} />,
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

export {viewMap};




export const sideMenuLayout: JustNode = {
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

const layoutToolbar: JustNode  = {
  type: 'split-pixels',
  direction: 'row',
  name: TOOLBAR_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 40,
  size: 40,
  noSplitter: true,
  first: {
    type: 'stack',
    tabs: [toolbarId],
    active: toolbarId
  },
  second: sideMenuLayout
}

export const initialLayoutValue: JustNode = layoutToolbar


