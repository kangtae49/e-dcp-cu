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
import {CONFIG_KEYS} from "@/app/config/configsSlice.ts";
import ConfigView from "@/app/config/ui/ConfigView.tsx";
import {JSONObject, JSONValue, JustId, JustNode} from "@/app/components/just-layout/justLayoutSlice.ts";
import {stableStringify} from "@/app/components/just-layout/json-util.ts";




export const LAYOUT_ID = "JUST-LAYOUT"
export const SIDE_MENU_NODE_NAME = "side-menu"

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config"



// export interface WinObjId extends JSONObject {
//   viewId: string
//   dupId?: string
//   params?: JSONObject
// }

// export type WinObjId = JSONObject & {
//   viewId: string
//   dupId?: string
//   params?: JSONObject
// }

export const INIT_SIDE_MENU_SIZE = 200;

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

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
} as Record<ViewId, GetWinInfoFn>;


CONFIG_KEYS.forEach((justId: JustId) => {

  viewMap[justId.viewId as ViewId] = (justId: JustId) => ({
    title: JustUtil.getParamString(justId, 'title'),
    icon: <Jdenticon size="30" value={"setting-config"} />,
    view: <ConfigView justId={justId} />
  });
})

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

export class JustUtil {
  viewId: string;
  dupId: string;
  params: JSONObject;

  constructor(data: Partial<JustId>) {
    this.viewId = data.viewId!;
    this.dupId = data.dupId ?? `${new Date().getTime()}`;
    this.params = data?.params ?? {};
  }

  toString(): string {
    const winObjId = { ...this };
    const winId = stableStringify(winObjId)
    if (winId == undefined) throw new Error("buildWinId: stringify error")
    return winId
  }

  getParamString(key: string): string {
    return this.params?.[key]?.toString() ?? ""
  }
  getParam(key: string): JSONValue {
    return this.params?.[key]
  }

  static toString(justId: JustId): string {
    const winId = stableStringify(justId)
    if (winId == undefined) throw new Error("buildWinId: stringify error")
    return winId
  }




  // static toWinObjId(winId: string): JustId {
  //   return JSON.parse(winId) as JustId
  // }

  // static toWinObj(winId: string): JustUtil {
  //   const winObjId = JSON.parse(winId) as JustId
  //   return new JustUtil(winObjId)
  // }

  static getParamString(justId: JustId, key: string): string {
    return new JustUtil(justId).getParamString(key)?.toString() ?? ""
  }
  // static getParam(justId: JustId, key: string): JSONValue {
  //   return new JustUtil(justId).getParam(key)
  // }

  static isEquals(justId1: JustId | null, justId2: JustId | null): boolean {
    if (justId1 == null || justId2 == null) return false
    return JustUtil.toString(justId1) === JustUtil.toString(justId2)
  }

  static includes(tab: JustId[], justId: JustId): boolean {
    return tab.map(JustUtil.toString).includes(JustUtil.toString(justId))
  }

  static withoutDup(justId: JustId): JustId {
    const { params, viewId } = justId
    return { params, viewId }
  }

  static replaceDup(justId: JustId): JustId {
    const { params, viewId } = justId
    return { params, viewId, dupId: `${new Date().getTime()}`}
  }

}
