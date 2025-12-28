import {GetWinInfoFn} from "@/app/components/just-layout/index.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import Jdenticon from "react-jdenticon";
import Page01View from "@/app/page/Page01View.tsx";
import DemoView from "@/app/demo/DemoView.tsx";
import DemoGridView from "@/app/demo/DemoGridView.tsx";
import DemoLineChartView from "@/app/demo/DemoLineChartView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import GridView from "@/app/grid/ui/GridView.tsx";
import {JustId, JustNode} from "@/app/components/just-layout/justLayoutSlice.ts";
import ChartView from "@/app/chart/ui/ChartView.tsx";


export const LAYOUT_ID = "JUST-LAYOUT"
export const SIDE_MENU_NODE_NAME = "side-menu"
export const INIT_SIDE_MENU_SIZE = 200

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "grid-view"
  | "chart-view"


export interface SideMenuItem {
  menuId: JustId,
  menuName: string
}
export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: {viewId: 'page01'}, menuName: "자산통계정보"},
  {menuId: {viewId: 'demo'}, menuName: "Demo"},
  {menuId: {viewId: 'demo-grid'}, menuName: "Demo Grid"},
  {menuId: {viewId: 'demo-line-chart'}, menuName: "Demo Line Chart"},
]

const viewMap = {
  "side-menu": () => ({
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
  // showClose: false,
  }),
  "page01": (justId: JustId) => {
    return ({
      title: "자산통계정보",
      canDup: true,
      icon: <Jdenticon size="30" value={justId.viewId} />,
      view: <Page01View justId={justId} />
    })
  },
  "demo": () => ({
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView />
  }),
  "demo-grid": () => ({
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView />
  }),
  "demo-line-chart": () => ({
    title: "Demo Line Chart",
    icon: <Jdenticon size="30" value="demo-line-chart" />,
    view: <DemoLineChartView />
  }),
  "about": () => ({
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView  />
  }),
  "chart-view": (justId: JustId) => ({
    title: justId.params?.['title'] ?? '',
    icon: <Jdenticon size="30" value="chart-view" />,
    view: <ChartView justId={justId}/>
  }),
  "grid-view": (justId: JustId) => ({
    title: justId.params?.['title'] ?? '',
    icon: <Jdenticon size="30" value="grid-view" />,
    view: <GridView justId={justId}/>
  })

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
} as Record<ViewId, GetWinInfoFn>;


// CONFIG_KEYS.forEach((justId: JustId) => {
//
//   viewMap[justId.viewId as ViewId] = (justId: JustId) => ({
//     title: JustUtil.getParamString(justId, 'title'),
//     icon: <Jdenticon size="30" value={"setting-config"} />,
//     view: <GridView justId={justId} />
//   });
// })

export {viewMap};

const sideMenuId = {viewId: 'side-menu'};
const demoGridId = {viewId: 'demo-grid'};
const aboutId = {viewId: 'about'};

export const initialLayoutValue: JustNode = {
  type: 'split-pixels',
  direction: 'row',
  name: SIDE_MENU_NODE_NAME,
  primary: 'first',
  primaryDefaultSize: 200,
  size: 200,
  show: true,
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
    show: true,
    first: {
      type: 'stack',
      tabs: [demoGridId],
      active: demoGridId
    },
    second: {
      type: 'stack',
      tabs: [aboutId],
      active: aboutId
    }
  },
}

