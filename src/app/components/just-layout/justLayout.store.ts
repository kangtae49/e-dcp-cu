import {inject, injectable} from "inversify";
import {JUST_LAYOUT_TYPES, JustBranch, JustDirection, JustId, JustNode, JustPos} from "./justLayout.types.ts";
import {JustLayoutService} from "./justLayout.service";
import {makeAutoObservable} from "mobx";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";


export interface JustPayloadInsert {
  branch: JustBranch
  justId: JustId
  direction: JustDirection
  pos: JustPos
  index: number
  size?: number
}
export interface JustPayloadAddTab {
  justId: JustId
}
export interface JustPayloadAddTabByNodeName {
  justId: JustId
  nodeName: string
}
export interface JustPayloadCloneTab {
  justId: JustId
  cloneJustId: JustId
}

export interface JustPayloadRemove {
  justId: JustId
}
export interface JustPayloadAllTabs {
  branch: JustBranch
}

export interface JustPayloadActive {
  justId: JustId
}

export interface JustPayloadResize {
  branch: JustBranch
  size: number
}



interface PayloadToggleWin {
  nodeName: string
}

interface PayloadShowWin {
  nodeName: string
  show: boolean
}

interface PayloadGetSize {
  nodeName: string
}

interface PayloadIsPrimayHide {
  nodeName: string
}
interface PayloadOpenWin {
  justId: JustId
}

interface PayloadOpenWinByNodeName {
  justId: JustId
  nodeName: string
}

interface PayloadGetWinIds {
  viewId: string
}

interface PayloadGetDupWinIds{
  justId: JustId
}

interface PayloadGetWinIdsByBranch {
  branch: JustBranch
}

interface PayloadGetNodeAtBranch {
  branch: JustBranch
}

interface PayloadOpenWinMenu {
  justId: JustId
  nodeName: string
}




export type JustPayloadMoveWin = JustPayloadMoveWinStack | JustPayloadMoveWinSplit

export interface JustPayloadMoveWinStack {
  pos: "stack"
  justId: JustId
  branch: JustBranch
  index: number
}
export interface JustPayloadMoveWinSplit {
  pos: "first" | "second"
  justId: JustId
  branch: JustBranch
  direction: JustDirection
  size?: number
}


@injectable()
export class JustLayoutStore {
  service: JustLayoutService;

  layout: JustNode | null = null
  lastActiveId: JustId | null = null
  lastActiveTm: number = new Date().getTime()
  fullScreenBranch: JustBranch | null = null

  isFullScreen: boolean = false
  isMaximize: boolean = false

  constructor(
    @inject(JUST_LAYOUT_TYPES.JustLayoutService) service: JustLayoutService
  ) {
    this.service = service;

    makeAutoObservable(this, {
      service: false
    }, { autoBind: true });
  }


  setLayout = (payload: JustNode | null) => {
    this.layout = payload
  }

  setFullScreenBranch = (payload: JustBranch | null) => {
    this.fullScreenBranch = payload
  }
  setFullScreen = (flag: boolean) => { this.isFullScreen = flag }
  setMaximize = (flag: boolean) => { this.isMaximize = flag }

  addTab = (payload: JustPayloadAddTab) => {
    const branch = this.service.getTabBranch(this.layout, [])
    if (branch == null) return;
    if (this.service.hasWinId(this.layout, payload.justId)) {
      this.layout = this.service.activeWinId(this.layout, payload.justId)
    } else {
      this.layout = this.service.addTabWin(this.layout, branch, payload.justId, -1)
    }
    this.lastActiveId = payload.justId
    this.lastActiveTm = new Date().getTime()
  }

  addTabByNodeName = (payload: JustPayloadAddTabByNodeName) => {
    const branch = this.service.getTabBranchByNodeName(this.layout, payload.nodeName, [])
    if (branch == null) return;
    if (this.service.hasWinId(this.layout, payload.justId)) {
      this.layout = this.service.activeWinId(this.layout, payload.justId)
    } else {
      this.layout = this.service.addTabWin(this.layout, branch, payload.justId, -1)
    }
    this.lastActiveId = payload.justId
    this.lastActiveTm = new Date().getTime()
  }

  queryWinIdsByViewId = (viewId: string) => {
    return this.service.queryWinIdsByViewId(this.layout ?? null, viewId, [])
  }

  cloneTab = (payload: JustPayloadCloneTab) => {
    const branch = this.service.getBranchByWinId(this.layout, payload.justId)
    if (branch == null) return;
    const stackNode = this.service.getNodeAtBranch(this.layout, branch)
    let newIndex: number = 0;
    if (stackNode?.type === 'stack' && stackNode.active != null) {
      newIndex = JustUtil.indexOf(stackNode.tabs, payload.justId) + 1
    }
    this.layout = this.service.addTabWin(this.layout, branch, payload.cloneJustId, newIndex)
    this.lastActiveId = payload.cloneJustId
    this.lastActiveTm = new Date().getTime()
  }

  removeWin = (payload: JustPayloadRemove) => {
    this.layout = this.service.removeEmpty(this.service.removeWinId(
      this.layout,
      payload.justId
    ))
  }

  removeAllTabs = (payload: JustPayloadAllTabs) => {
    this.layout = this.service.removeEmpty(this.service.removeAllTabs(
      this.layout,
      payload.branch
    ))
  }
  activeWin = (payload: JustPayloadActive) => {
    this.layout = this.service.activeWinId(
      this.layout,
      payload.justId
    )
    this.lastActiveId = payload.justId as JustId | null | any
    this.lastActiveTm = new Date().getTime()
  }

  updateResize = (payload: JustPayloadResize) => {
    this.layout = this.service.updateSplitSize(
      this.layout,
      payload.branch,
      payload.size
    )
  }

  moveWin = (payload: JustPayloadMoveWin) => {
    if (payload.pos === 'stack') {
      this.layout = this.service.removeEmpty(this.service.moveWinIdToStack(
        this.layout,
        payload
      ))
    } else {
      this.layout = this.service.removeEmpty(this.service.moveWinIdToSplit(
        this.layout,
        payload
      ))
    }
    this.lastActiveId = payload.justId as JustId | null | any
    this.lastActiveTm = new Date().getTime()
  }



  toggleSideMenu = () => {
    if (this.layout === null) return;
    if (this.layout.type !== 'split-pixels') {
      return;
    }
    const newSize = this.layout.size <= 0 ? this.layout.primaryDefaultSize : 0;
    this.updateResize({
      branch: [],
      size: newSize
    })
  }

  toggleWin = ({nodeName}: PayloadToggleWin) => {
    const layout = this.layout;
    const branch = this.service.getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return;
    const node = this.service.getNodeAtBranch(layout, branch)
    if (node == null) return;
    if (node.type !== 'split-pixels') return;
    const newPrimaryHide = node.primaryHide !== true;
    const newSize = (!newPrimaryHide || node.size < 10) ? node.primaryDefaultSize : 0;
    const updateSpec = this.service.buildSpecFromUpdateSpec(branch, {
      $merge: {
        size: newSize,
        primaryHide: newPrimaryHide
      }
    })
    const newLayout = this.service.updateNode(layout, updateSpec)
    if (newLayout == null) return;
    this.setLayout(newLayout)
  }

  showWin = ({nodeName, show}: PayloadShowWin) => {
    const layout = this.layout;
    const branch = this.service.getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return;
    const node = this.service.getNodeAtBranch(layout, branch)
    if (node == null) return;
    if (node.type !== 'split-pixels') return;
    if (show === (node.size === 0)) {
      const newSize = show ? node.primaryDefaultSize : 0;
      const updateSpec = this.service.buildSpecFromUpdateSpec(branch, {
        $merge: {
          size: newSize
        }
      })
      const newLayout = this.service.updateNode(layout, updateSpec)
      if (newLayout == null) return;
      this.setLayout(newLayout)
    }
  }

  getNodeByNodeName = ({nodeName}: PayloadGetSize) => {
    const layout = this.layout;
    const branch = this.service.getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return null;
    return this.service.getNodeAtBranch(layout, branch)
  }

  getSizeByNodeName = ({nodeName}: PayloadGetSize) => {
    const layout = this.layout;
    const branch = this.service.getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return null;
    const node = this.service.getNodeAtBranch(layout, branch)
    if (node == null) return null;
    if (node.type === 'split-pixels' || node.type === 'split-percentage') {
      return node.size;
    } else {
      return null;
    }
  }

  isPrimaryHide = ({nodeName}: PayloadIsPrimayHide) => {
    const layout = this.layout;
    const branch = this.service.getBranchByNodeName(layout, nodeName, [])
    if (branch == null) return null;
    const node = this.service.getNodeAtBranch(layout, branch)
    if (node == null) return null;
    if (node.type === 'split-pixels') {
      return node.primaryHide;
    } else {
      return null;
    }
  }

  openWin = ({justId}: PayloadOpenWin) => {
    if (this.service.hasWinId(this.layout ?? null, justId)) {
      this.activeWin({
        justId
      })
    } else {
      this.addTab({
        justId: justId,
      })
    }
  }

  openWinByNodeName = ({justId, nodeName}: PayloadOpenWinByNodeName) => {
    if (this.service.hasWinId(this.layout ?? null, justId)) {
      this.activeWin({
        justId
      })
    } else {
      this.addTabByNodeName({
        justId: justId,
        nodeName
      })
    }
  }

  getWinIds = ({viewId}: PayloadGetWinIds) => {
    return this.service.queryWinIdsByViewId(this.layout ?? null, viewId, [])
  }

  getDupWinIds = ({justId}: PayloadGetDupWinIds) => {
    return this.service.queryDupWinIdsByWinId(this.layout ?? null, justId, [])
  }

  getWinIdsByBranch = ({branch}: PayloadGetWinIdsByBranch) => {
    return this.service.queryWinIdsByStack(this.layout ?? null, branch)
  }

  getNodeAtBranch = ({branch}: PayloadGetNodeAtBranch) => {
    return this.service.getNodeAtBranch(this.layout ?? null, branch)
  }

  openWinMenu = ({justId, nodeName}: PayloadOpenWinMenu) => {
    const viewId = justId.viewId;
    const winIds: JustId[] = this.getWinIds({viewId});
    if (winIds.length === 0) {
      console.log('openWinMenu1', winIds, justId)
      this.openWinByNodeName({justId, nodeName})
    } else {
      const newJustId = winIds
        .toSorted((a, b) => (a.dupId ?? '') <= (b.dupId ?? '') ? -1: 1)
        .at(-1)
      if (newJustId) {
        console.log('openWinMenu2', winIds, newJustId)
        this.openWinByNodeName({justId: newJustId, nodeName})
      }
    }
  }

}