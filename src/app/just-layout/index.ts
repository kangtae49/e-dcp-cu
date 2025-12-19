import {JSX} from "react";
import {ViewId} from "@/utils/layout-util.tsx";
import {stableStringify} from "@/utils/json-util.ts";

export interface WinInfo {
  title: string
  icon: JSX.Element
  view: JSX.Element
  canDrag?: boolean
  canDrop?: boolean
  canDup?: boolean
  showClose?: boolean
  showTitle?: boolean
}
export type GetWinInfoFn = (winId: string) => WinInfo;
export type CloseWinFn = (winId: string) => void;

export type WinObjParamVal = string | number | boolean | null;

export interface WinObjId {
  viewId: ViewId
  dupId?: string
  params?: Record<string, WinObjParamVal>
}

export class WinObj implements WinObjId {
  viewId: ViewId;
  dupId: string;
  params: Record<string, WinObjParamVal>;

  constructor(data: Partial<WinObjId>) {
    this.viewId = data.viewId!;
    this.dupId = data.dupId ?? `${new Date().getTime()}`;
    this.params = data?.params ?? {};
  }

  toWinId(): string {
    const winObjId = { ...this };
    const winId = stableStringify(winObjId)
    if (winId == undefined) throw new Error("buildWinId: stringify error")
    return winId
  }
  toWinObjId(): WinObjId {
    return { ...this }
  }
  getParamString(key: string): string {
    return this.params?.[key]?.toString() ?? ""
  }
  getParam(key: string): WinObjParamVal | undefined {
    return this.params?.[key]
  }

  static toWinId(winObjId: WinObjId): string {
    const winId = stableStringify(winObjId)
    if (winId == undefined) throw new Error("buildWinId: stringify error")
    return winId
  }

  static toWinObjId(winId: string): WinObjId {
    return JSON.parse(winId) as WinObjId
  }

  static toWinObj(winId: string): WinObj {
    const winObjId = JSON.parse(winId) as WinObjId
    return new WinObj(winObjId)
  }

  static getParamString(winObjId: WinObjId, key: string): string {
    return new WinObj(winObjId).getParamString(key)?.toString() ?? ""
  }
  static getParam(winObjId: WinObjId, key: string): WinObjParamVal | undefined {
    return new WinObj(winObjId).getParam(key)
  }


}

// export function fromWinObjId(winObjId: WinObjId): string {
//   const winId = stableStringify(winObjId)
//   if (winId == undefined) throw new Error("buildWinId: stringify error")
//   return winId
// }

// export function fromWinId(winId: string): WinObjId {
//   return JSON.parse(winId) as WinObjId
// }