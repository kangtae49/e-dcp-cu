import {stableStringify} from "@/utils/json-util.ts";

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config"
export interface WinObjId {
  viewId: ViewId
  params?: Record<string, any>
}

export const INIT_SIDE_MENU_SIZE = 200;

export interface SideMenuItem {
  menuId: string,
  menuName: string
}
export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: fromWinObjId({viewId: 'page01'}), menuName: "자산통계정보"},
  {menuId: fromWinObjId({viewId: 'demo'}), menuName: "Demo"},
  {menuId: fromWinObjId({viewId: 'demo-grid'}), menuName: "Demo Grid"},
  {menuId: fromWinObjId({viewId: 'demo-line-chart'}), menuName: "Demo Line Chart"},
]


export function fromWinObjId(winObjId: WinObjId): string {
  const winId = stableStringify(winObjId)
  if (winId == undefined) throw new Error("buildWinId: stringify error")
  return winId
}

export function fromWinId(winId: string): WinObjId {
  return JSON.parse(winId) as WinObjId
}