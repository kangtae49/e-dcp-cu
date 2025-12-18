import {WinObj} from "@/app/just-layout";

export const LAYOUT_ID = "JUST-LAYOUT"

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


