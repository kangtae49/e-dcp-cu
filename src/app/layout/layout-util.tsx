import {GetWinInfoFn, WinObj} from "@/app/components/just-layout/index.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "@/app/side-menu/ui/SideMenu.tsx";
import Jdenticon from "react-jdenticon";
import Page01View from "@/app/page/Page01View.tsx";
import DemoView from "@/app/demo/DemoView.tsx";
import DemoGridView from "@/app/demo/DemoGridView.tsx";
import DemoLineChartView from "@/app/demo/DemoLineChartView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import {CONFIG_KEYS} from "@/app/config/configsSlice.ts";
import ConfigView from "@/app/config/ui/ConfigView.tsx";
import type {JustNode} from "@/app/components/just-layout/justLayoutSlice.ts";

export const LAYOUT_ID = "JUST-LAYOUT"
export const SIDE_MENU_NODE_NAME = "side-menu"

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config"


export const INIT_SIDE_MENU_SIZE = 200;

export interface SideMenuItem {
  menuId: string,
  menuName: string
}
export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: new WinObj({viewId: 'page01'}).toWinId(), menuName: "자산통계정보"},
  {menuId: new WinObj({viewId: 'demo'}).toWinId(), menuName: "Demo"},
  {menuId: new WinObj({viewId: 'demo-grid'}).toWinId(), menuName: "Demo Grid"},
  {menuId: new WinObj({viewId: 'demo-line-chart'}).toWinId(), menuName: "Demo Line Chart"},
]

const viewMap = {
  "side-menu": (winId: string) => ({
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu key={winId} />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  }),
  "page01": (winId: string) => {
    const winObjId = WinObj.toWinObjId(winId)
    return ({
      title: "자산통계정보",
      canDup: true,
      icon: <Jdenticon size="30" value={winObjId.viewId} />,
      view: <Page01View key={winId} winObjId={winObjId} />
    })
  },
  "demo": (winId: string) => ({
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView key={winId} />
  }),
  "demo-grid": (winId: string) => ({
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView key={winId} />
  }),
  "demo-line-chart": (winId: string) => ({
    title: "Demo Line Chart",
    icon: <Jdenticon size="30" value="demo-line-chart" />,
    view: <DemoLineChartView key={winId} />
  }),
  "about": (winId: string) => ({
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView key={winId} />
  }),

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
} as Record<ViewId, GetWinInfoFn>;


CONFIG_KEYS.forEach((winObjId: WinObj) => {

  viewMap[winObjId.viewId as ViewId] = () => ({
    title: WinObj.getParamString(winObjId, 'title'),
    icon: <Jdenticon size="30" value={"setting-config"} />,
    view: <ConfigView winObjId={winObjId} />
  });
})

export {viewMap};

const sideMenuId = new WinObj({viewId: 'side-menu'}).toWinId();
const demoGridId = new WinObj({viewId: 'demo-grid'}).toWinId();
const aboutId = new WinObj({viewId: 'about'}).toWinId();

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

