import {
  JustBranch, JustId,
  JustNode, JustPayloadMoveWinSplit, JustPayloadMoveWinStack,
  JustSplitDirection,
  JustStack,
} from "./justLayoutSlice.ts";
import update, {type Spec} from "immutability-helper"
import clamp from "lodash/clamp";
import {get, set} from "lodash";
import {stableStringify} from "@/app/components/just-layout/json-util.ts";


export function insertWinIdToStack(layout: JustNode | null, payload: JustPayloadMoveWinStack): JustNode | null {
  if (layout == null) return layout
  const targetNode = getNodeByBranch(layout, payload.branch)
  const targetType = targetNode.type
  if (targetType !== 'stack') {
    return layout
  }

  const targetTabs = targetNode.tabs
  const newIndex = payload.index >= 0 ? clamp(payload.index, 0, targetTabs.length) : targetTabs.length;
  return updateNodeOfBranch(layout, payload.branch, {
    $set: {
      ...targetNode,
      type: "stack",
      tabs: [
        ...targetTabs.slice(0, newIndex),
        payload.justId,
        ...targetTabs.slice(newIndex),
      ],
      active: payload.justId,
    }
  })

}
export function insertWinIdToSplit(layout: JustNode | null, payload: JustPayloadMoveWinSplit): JustNode | null {
  if (layout == null) return layout
  const targetNode = getNodeByBranch(layout, payload.branch)

  const otherPos = payload.pos === 'first' ? 'second' : 'first';
  return updateNodeOfBranch(layout, payload.branch, {
    $set: {
      type: 'split-percentage',
      direction: payload.direction,
      [otherPos]: {
        ...targetNode,
        name: undefined
      },
      [payload.pos]: {
        type: "stack",
        tabs: [payload.justId],
        active: payload.justId,
        name: undefined
      },
      size: payload.size ?? 50,
      dndAccept: targetNode.dndAccept,
      name: targetNode.name,
      hideTitle: targetNode.hideTitle,
    }
  })

}


export function removeWinId(layout: JustNode | null, justId: JustId): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByWinId(layout, justId) as unknown as JustStack | null
  if (justStack == null) return layout;
  const curIdx = justStack.active ? JustUtil.indexOf(justStack.tabs, justStack.active) : 0

  const newTabs = justStack.tabs.filter((tab: JustId) => !JustUtil.isEquals(tab, justId))
  let newActive: JustId | null;
  if (justStack.active !== null && JustUtil.includes(newTabs, justStack.active)) {
    newActive = justStack.active
  } else {
    newActive = (newTabs.length > 0 && justStack.active !== null)
      ? newTabs[clamp(curIdx-1, 0, newTabs.length-1)]
      : null
  }
  return updateNodeOfWinId(layout, justId, {
    $set: {
      ...justStack,
      tabs: newTabs,
      active: newActive,
    }
  })
}

export function removeAllTabs(layout: JustNode | null, branch: JustBranch): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByBranch(layout, branch);
  if (justStack == null) return layout;
  if (justStack.type !== 'stack') return layout;
  return updateNodeOfBranch(layout, branch, {
    $set: {
      ...justStack,
      tabs: [],
      active: null,
    }
  })
}


export function activeWinId(layout: JustNode | null, justId: JustId): JustNode | null {
  if (layout == null) return null;
  const justStack = getNodeByWinId(layout, justId) as unknown as JustStack | null
  if (justStack == null) return layout;
  return updateNodeOfWinId(layout, justId, {
    $set: {
      ...justStack,
      active: justId,
    }
  })
}

export function getActiveWinIds(layout: JustNode | null): JustId[] {
  const findFn = (layout: JustNode | null, activeWinIds: JustId []): JustId [] => {
    if( layout === null) return activeWinIds
    if (layout.type === 'stack') {
      if (layout.active !== null) {
        return [...activeWinIds, layout.active]
      } else {
        return activeWinIds
      }
    } else {
      const firstActiveWinIds = findFn(layout.first, activeWinIds)
      return findFn(layout.second, firstActiveWinIds)
    }
  }

  return findFn(layout, [])
}

export function removeEmpty(layout: JustNode | null): JustNode | null {
  if (layout == null) return layout;
  const branch = findEmptyBranch(layout, [])
  if (branch === null) return layout
  if (branch.length === 0) return null

  // if (isEqual(branch, ['second'])) {  // first: side-menu
  //   return layout;
  // }
  const lastSplitType = branch[branch.length - 1]
  const parentBranch = branch.slice(0, -1)
  const otherSplitType = lastSplitType === 'first' ? 'second' : 'first'
  const parentBranchNode = getNodeByBranch(layout, parentBranch)
  const otherNode = getNodeByBranch(layout, [...parentBranch, otherSplitType])
  return updateNodeOfBranch(layout, parentBranch, {
    $set: {
      ...otherNode,
      dndAccept: parentBranchNode.dndAccept,
      name: parentBranchNode.name,
      hideTitle: parentBranchNode.hideTitle,
    },
  })
}


export function findEmptyBranch(layout: JustNode | null, branch: JustBranch): JustBranch | null {

  if( layout === null) return null
  if (layout.type === 'stack') {
    if (layout.tabs.length === 0 && !layout.name) {
      return branch
    }
  } else {
    const branchFirst = findEmptyBranch(layout.first, [...branch, 'first'])
    if (branchFirst != null ) {
      return branchFirst
    }

    const branchSecond = findEmptyBranch(layout.second, [...branch, 'second'])
    if (branchSecond != null) {
      return branchSecond
    }
  }
  return null
}

// export function moveWinId(layout: JustNode | null, justId: JustId, branch: JustBranch, pos: JustPos, direction: JustDirection, index: number): JustNode | null {
//   const newLayout = removeWinId(layout, justId)
//   return insertWinId(newLayout, {
//     justId,
//     branch,
//     pos,
//     direction,
//     index,
//     size: 50
//   })
// }

export function moveWinIdToStack(layout: JustNode | null, payload: JustPayloadMoveWinStack): JustNode | null {
  const newLayout = removeWinId(layout, payload.justId)
  return insertWinIdToStack(newLayout, payload)
}

export function moveWinIdToSplit(layout: JustNode | null, payload: JustPayloadMoveWinSplit): JustNode | null {
  const newLayout = removeWinId(layout, payload.justId)
  return insertWinIdToSplit(newLayout, payload)
}


// export function updateSplitPercentage(layout: JustNode | null, branch: JustBranch, size: number) {
//   return updateNodeOfBranch(layout, branch, {
//     $merge: {
//       size: size,
//     }
//   })
// }


function getBranch(layout: JustNode | null, justId: JustId, branch: JustBranch): JustBranch | null {
  if( layout === null) return null
  if (layout.type === 'stack') {
    if (JustUtil.includes(layout.tabs, justId)) {
      return branch
    } else {
      return null
    }
  } else {
    const branchFirst = getBranch(layout.first, justId, [...branch, 'first'])
    if (branchFirst != null) {
      return branchFirst
    }
    const branchSecond = getBranch(layout.second, justId, [...branch, 'second'])
    if (branchSecond != null) {
      return branchSecond
    }
    return null
  }
}

export function getBranchByWinId(layout: JustNode | null, justId: JustId): JustBranch | null {
  return getBranch(layout, justId, [])
}
export function getBranchByNodeName(layout: JustNode | null, nodeName: string, curBranch: JustBranch): JustBranch | null {
  if( layout === null) return null
  // if (layout.type === 'split-pixels') {
    if (layout.name == nodeName) {
      return [...curBranch]
    }
    if (layout.type != 'stack') {
      const nodeFirst = getBranchByNodeName(layout.first, nodeName, [...curBranch, 'first'])
      if (nodeFirst != null) {
        return nodeFirst
      }
      const nodeSecond = getBranchByNodeName(layout.second, nodeName, [...curBranch, 'second'])
      if (nodeSecond != null) {
        return nodeSecond
      }
    }
    return null
  // } else {
  //   return null
  // }
}

export function getNodeByWinId(layout: JustNode | null, justId: JustId): JustNode | null {
  if( layout === null) return null
  if (layout.type === 'stack') {
    if (JustUtil.includes(layout.tabs, justId)) {
      return layout
    } else {
      return null
    }
  } else {
    const nodeFirst = getNodeByWinId(layout.first, justId)
    if (nodeFirst != null) {
      return nodeFirst
    }
    const nodeSecond = getNodeByWinId(layout.second, justId)
    if (nodeSecond != null) {
      return nodeSecond
    }
    return null
  }
}

export function getTabBranch(layout: JustNode | null, curBranch: JustBranch): JustBranch | null {
  if( layout === null) return null
  if (layout.type === 'stack') {
    return curBranch
  } else {
    let targetBranch: JustSplitDirection;
    if (layout.type === 'split-pixels') {
      targetBranch = layout.primary === 'first' ? 'second' : 'first'
    } else {
      targetBranch = layout.direction === 'row' ? 'second' : 'first'
    }
    const retBranch = getTabBranch(layout[targetBranch], [...curBranch, targetBranch])
    if (retBranch != null) {
      return retBranch
    }
  }
  return null
}

export function addTabWin(layout: JustNode | null, branch: JustBranch, justId: JustId, index: number): JustNode | null {
  if( layout === null) return null
  const node = getNodeByBranch(layout, branch)
  if (node.type !== 'stack') return layout
  const idx = index < 0 ? node.tabs.length : clamp(index, 0, node.tabs.length)
  return updateNodeOfBranch(layout, branch, {
    $merge: {
      tabs: [
        ...node.tabs.slice(0, idx),
        justId,
        ...node.tabs.slice(idx)
      ],
      active: justId,
    }
  })
}


export function queryWinIdsByViewId(layout: JustNode | null, viewId: string, justIds: JustId []): JustId [] {
  if( layout === null) return justIds
  if (layout.type === 'stack') {
    return [
      ...justIds,
      ...layout.tabs.filter((tab: JustId) => tab.viewId === viewId)
    ]
  } else {
    const firstIds = queryWinIdsByViewId(layout.first, viewId, justIds);
    return queryWinIdsByViewId(layout.second, viewId, [...justIds, ...firstIds]);
  }
}

export function queryDupWinIdsByWinId(layout: JustNode | null, justId: JustId, justIds: JustId []): JustId [] {
  if( layout === null) return justIds
  if (layout.type === 'stack') {

    const justIdWithoutDup = JustUtil.withoutDup(justId)

    const ids = layout.tabs.filter((tab) => {
      const tabWithoutDup = JustUtil.withoutDup(tab)
      return JustUtil.isEquals(justIdWithoutDup, tabWithoutDup)
    })
    return [...justIds, ...ids]
  } else {
    const firstIds = queryDupWinIdsByWinId(layout.first, justId, justIds);
    return queryDupWinIdsByWinId(layout.second, justId, [...justIds, ...firstIds]);
  }
}

export function queryWinIdsByStack(layout: JustNode | null, branch: JustBranch): JustId [] {
  if( layout === null) return []
  const justStack = getNodeByBranch<JustStack>(layout, branch);
  if (justStack.type !== 'stack') {
    return []
  }
  return justStack.tabs
}

function getNodeByBranch<T extends JustNode>(obj: JustNode, path: JustBranch): T {
  return path.reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj)
}

// function makePatch(path: JustBranch, value:any): any {
//   return path.reduceRight((acc, key) => ({ [key]: acc }), value)
// }

function updateNodeOfBranch(layout: JustNode | null, branch: JustBranch, value: any): JustNode | null {
  const patch = buildSpecFromUpdateSpec(branch, value)
  return updateNode(layout, patch)
}

function updateNodeOfWinId(layout: JustNode | null, justId: JustId, value: any): JustNode | null {
  const branch = getBranchByWinId(layout, justId)
  if (branch == null) return layout;
  // const patch = makePatch(branch, value)
  const patch = buildSpecFromUpdateSpec(branch, value)
  return updateNode(layout, patch)
}

export function hasWinId(layout: JustNode | null, justId: JustId)  {
  return getNodeByWinId(layout, justId) != null
}


//

export type JustUpdateSpec = Spec<JustNode>;

export function updateNode(layout: JustNode | null, updateSpec: JustUpdateSpec) {
  if (layout == null) return null;
  return update(layout, updateSpec)
}

export function buildSpecFromUpdateSpec(branch: JustBranch, updateSpec: JustUpdateSpec): JustUpdateSpec {
  if (branch.length > 0) {
    return set({}, branch, updateSpec);
  } else {
    return updateSpec;
  }
}

export function getNodeAtBranch(node: JustNode | null, branch: JustBranch): JustNode | null {
  if (branch.length > 0) {
    return get(node, branch, null);
  } else {
    return node;
  }
}

export function getBranchRightTop(node: JustNode | null): JustBranch {
  if (node == null) {
    return [];
  }
  let currentNode = node;
  const currentBranch: JustBranch = []
  while (currentNode.type !== 'stack') {
    if (currentNode.direction === 'row') {
      currentBranch.push('second')
      currentNode = currentNode.second
    } else if (currentNode.direction === 'column') {
      currentBranch.push('first')
      currentNode = currentNode.first
    }
  }
  return currentBranch
}

export function updateSplitSize(node: JustNode | null, branch: JustBranch, size: number) {
  const updateSpec = buildSpecFromUpdateSpec(branch, {
    $merge: {
      size: size
    }
  })
  return updateNode(node, updateSpec)
}

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
    if (justId1 == null || justId2 == null) return false
    return JustUtil.toString(justId1) === JustUtil.toString(justId2)
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
