
import {stableStringify} from "@/app/components/just-layout/json-util.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import { isEqual } from "lodash";




export class JustUtil {

  static toString(justId: JustId): string {
    const winId = stableStringify(justId)
    if (winId == undefined) throw new Error("buildWinId: stringify error")
    return winId
  }

  static getParamString(justId: JustId, key: string): string {
    return justId.params?.[key]?.toString() ?? ""
  }
  static getParam<T>(justId: JustId, key: string): T | undefined {
    return justId.params?.[key] as T | undefined
  }

  static isEquals(justId1: JustId | null | undefined, justId2: JustId | null | undefined): boolean {
    return isEqual(justId1, justId2)
    // if (justId1 == null || justId2 == null) return false
    // return JustUtil.toString(justId1) === JustUtil.toString(justId2)
  }

  static indexOf(tab: JustId[], justId: JustId): number {
    return tab.map(JustUtil.toString).indexOf(JustUtil.toString(justId))
  }

  static includes(tab: JustId[], justId: JustId): boolean {
    return tab.map(JustUtil.toString).includes(JustUtil.toString(justId))
  }

  static withoutDup(justId: JustId): JustId {
    const { params, viewId, title } = justId
    return { params, viewId, title }
  }

  static replaceDup(justId: JustId): JustId {
    const { params, viewId, title } = justId
    return { params, viewId, title, dupId: `${new Date().getTime()}`}
  }

}
