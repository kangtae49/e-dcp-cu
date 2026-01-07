import {injectable} from "inversify";
import {JustBranch, JustId, JustNode, JustSplitDirection, JustStack } from "./justLayout.types";
import {clamp, get, set} from "lodash";
import {JustPayloadMoveWinSplit, JustPayloadMoveWinStack } from "./justLayout.store";
import { JustUtil } from "./justUtil.ts";
import update, {Spec } from "immutability-helper";

export type JustUpdateSpec = Spec<JustNode>;

@injectable()
export class JustLayoutService {
  insertWinIdToStack = (layout: JustNode | null, payload: JustPayloadMoveWinStack): JustNode | null => {
    if (layout == null) return layout
    const targetNode = this.getNodeByBranch(layout, payload.branch)
    const targetType = targetNode.type
    if (targetType !== 'stack') {
      return layout
    }

    const targetTabs = targetNode.tabs
    const newIndex = payload.index >= 0 ? clamp(payload.index, 0, targetTabs.length) : targetTabs.length;
    return this.updateNodeOfBranch(layout, payload.branch, {
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

  insertWinIdToSplit = (layout: JustNode | null, payload: JustPayloadMoveWinSplit): JustNode | null => {
    if (layout == null) return layout
    const targetNode = this.getNodeByBranch(layout, payload.branch)

    const otherPos = payload.pos === 'first' ? 'second' : 'first';
    return this.updateNodeOfBranch(layout, payload.branch, {
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


  removeWinId = (layout: JustNode | null, justId: JustId): JustNode | null => {
    if (layout == null) return null;
    const justStack = this.getNodeByWinId(layout, justId)
    if (justStack?.type !== 'stack') return layout;
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
    return this.updateNodeOfWinId(layout, justId, {
      $set: {
        ...justStack,
        tabs: newTabs,
        active: newActive,
      }
    })
  }

  removeAllTabs = (layout: JustNode | null, branch: JustBranch): JustNode | null => {
    if (layout == null) return null;
    const justStack = this.getNodeByBranch(layout, branch);
    if (justStack == null) return layout;
    if (justStack.type !== 'stack') return layout;
    return this.updateNodeOfBranch(layout, branch, {
      $set: {
        ...justStack,
        tabs: [],
        active: null,
      }
    })
  }


  activeWinId = (layout: JustNode | null, justId: JustId): JustNode | null => {
    if (layout == null) return null;
    const justStack = this.getNodeByWinId(layout, justId)
    if (justStack == null) return layout;
    return this.updateNodeOfWinId(layout, justId, {
      $set: {
        ...justStack,
        active: justId,
      }
    })
  }

  getActiveWinIds = (layout: JustNode | null): JustId[] => {
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

  removeEmpty = (layout: JustNode | null): JustNode | null  => {
    if (layout == null) return layout;
    const branch = this.findEmptyBranch(layout, null, [])
    if (branch === null) return layout
    if (branch.length === 0) return null

    // if (isEqual(branch, ['second'])) {  // first: side-menu
    //   return layout;
    // }
    const lastSplitType = branch[branch.length - 1]
    const parentBranch = branch.slice(0, -1)
    const otherSplitType = lastSplitType === 'first' ? 'second' : 'first'
    const parentBranchNode = this.getNodeByBranch(layout, parentBranch)
    const otherNode = this.getNodeByBranch(layout, [...parentBranch, otherSplitType])
    return this.updateNodeOfBranch(layout, parentBranch, {
      $set: {
        ...otherNode,
        dndAccept: parentBranchNode.dndAccept,
        name: parentBranchNode.name,
        hideTitle: parentBranchNode.hideTitle,
      },
    })
  }


  findEmptyBranch = (layout: JustNode | null, parentNode: JustNode | null, branch: JustBranch): JustBranch | null => {

    if( layout === null) return null
    if (layout.type === 'stack') {

      const isNamed = parentNode != null && parentNode.type != 'stack' && (!!parentNode.first.name || !!parentNode.second.name);
      if (layout.tabs.length === 0 && !isNamed) {
        return branch
      }
    } else {
      const branchFirst = this.findEmptyBranch(layout.first, layout, [...branch, 'first'])
      if (branchFirst != null ) {
        return branchFirst
      }

      const branchSecond = this.findEmptyBranch(layout.second, layout, [...branch, 'second'])
      if (branchSecond != null) {
        return branchSecond
      }
    }
    return null
  }


  moveWinIdToStack = (layout: JustNode | null, payload: JustPayloadMoveWinStack): JustNode | null => {
    const newLayout = this.removeWinId(layout, payload.justId)
    return this.insertWinIdToStack(newLayout, payload)
  }

  moveWinIdToSplit = (layout: JustNode | null, payload: JustPayloadMoveWinSplit): JustNode | null => {
    const newLayout = this.removeWinId(layout, payload.justId)
    return this.insertWinIdToSplit(newLayout, payload)
  }



  getBranch = (layout: JustNode | null, justId: JustId, branch: JustBranch): JustBranch | null => {
    if( layout === null) return null
    if (layout.type === 'stack') {
      if (JustUtil.includes(layout.tabs, justId)) {
        return branch
      } else {
        return null
      }
    } else {
      const branchFirst = this.getBranch(layout.first, justId, [...branch, 'first'])
      if (branchFirst != null) {
        return branchFirst
      }
      const branchSecond = this.getBranch(layout.second, justId, [...branch, 'second'])
      if (branchSecond != null) {
        return branchSecond
      }
      return null
    }
  }

  getBranchByWinId = (layout: JustNode | null, justId: JustId): JustBranch | null => {
    return this.getBranch(layout, justId, [])
  }
  getBranchByNodeName = (layout: JustNode | null, nodeName: string, curBranch: JustBranch): JustBranch | null => {
    if( layout === null) return null
    if (layout.name == nodeName) {
      return [...curBranch]
    }
    if (layout.type != 'stack') {
      const nodeFirst = this.getBranchByNodeName(layout.first, nodeName, [...curBranch, 'first'])
      if (nodeFirst != null) {
        return nodeFirst
      }
      const nodeSecond = this.getBranchByNodeName(layout.second, nodeName, [...curBranch, 'second'])
      if (nodeSecond != null) {
        return nodeSecond
      }
    }
    return null
  }

  getTabBranchByNodeName = (layout: JustNode | null, nodeName: string, curBranch: JustBranch): JustBranch | null => {
    if( layout === null) return null
    const branchHead = this.getBranchByNodeName(layout, nodeName, curBranch)
    if( branchHead == null) return null
    const node = this.getNodeByBranch(layout, branchHead)
    if (node.type === 'stack') {
      return branchHead
    } else {
      const restBranch = this.getTabBranch(node, [])
      if (restBranch != null) {
        return [...branchHead, ...restBranch]
      }
    }
    return null
  }

  getNodeByWinId = (layout: JustNode | null, justId: JustId): JustNode | null => {
    if( layout === null) return null
    if (layout.type === 'stack') {
      if (JustUtil.includes(layout.tabs, justId)) {
        return layout
      } else {
        return null
      }
    } else {
      const nodeFirst = this.getNodeByWinId(layout.first, justId)
      if (nodeFirst != null) {
        return nodeFirst
      }
      const nodeSecond = this.getNodeByWinId(layout.second, justId)
      if (nodeSecond != null) {
        return nodeSecond
      }
      return null
    }
  }

  getTabBranch = (layout: JustNode | null, curBranch: JustBranch): JustBranch | null => {
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
      const retBranch = this.getTabBranch(layout[targetBranch], [...curBranch, targetBranch])
      if (retBranch != null) {
        return retBranch
      }
    }
    return null
  }

  addTabWin = (layout: JustNode | null, branch: JustBranch, justId: JustId, index: number): JustNode | null => {
    if( layout === null) return null
    const node = this.getNodeByBranch(layout, branch)
    if (node.type !== 'stack') return layout
    const idx = index < 0 ? node.tabs.length : clamp(index, 0, node.tabs.length)
    return this.updateNodeOfBranch(layout, branch, {
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


  queryWinIdsByViewId = (layout: JustNode | null, viewId: string, justIds: JustId []): JustId [] => {
    if( layout === null) return justIds
    if (layout.type === 'stack') {
      return [
        ...justIds,
        ...layout.tabs.filter((tab: JustId) => tab.viewId === viewId)
      ]
    } else {
      const firstIds = this.queryWinIdsByViewId(layout.first, viewId, justIds);
      return this.queryWinIdsByViewId(layout.second, viewId, [...justIds, ...firstIds]);
    }
  }

  queryDupWinIdsByWinId = (layout: JustNode | null, justId: JustId, justIds: JustId []): JustId [] => {
    if( layout === null) return justIds
    if (layout.type === 'stack') {

      const justIdWithoutDup = JustUtil.withoutDup(justId)

      const ids = layout.tabs.filter((tab) => {
        const tabWithoutDup = JustUtil.withoutDup(tab)
        return JustUtil.isEquals(justIdWithoutDup, tabWithoutDup)
      })
      return [...justIds, ...ids]
    } else {
      const firstIds = this.queryDupWinIdsByWinId(layout.first, justId, justIds);
      return this.queryDupWinIdsByWinId(layout.second, justId, [...justIds, ...firstIds]);
    }
  }

  queryWinIdsByStack = (layout: JustNode | null, branch: JustBranch): JustId [] => {
    if( layout === null) return []
    const justStack = this.getNodeByBranch<JustStack>(layout, branch);
    if (justStack.type !== 'stack') {
      return []
    }
    return justStack.tabs
  }

  getNodeByBranch = <T extends JustNode>(obj: JustNode, path: JustBranch): T => {
    return path.reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj)
  }


  updateNodeOfBranch = (layout: JustNode | null, branch: JustBranch, value: any): JustNode | null => {
    const patch = this.buildSpecFromUpdateSpec(branch, value)
    return this.updateNode(layout, patch)
  }

  updateNodeOfWinId = (layout: JustNode | null, justId: JustId, value: any): JustNode | null => {
    const branch = this.getBranchByWinId(layout, justId)
    if (branch == null) return layout;
    // const patch = makePatch(branch, value)
    const patch = this.buildSpecFromUpdateSpec(branch, value)
    return this.updateNode(layout, patch)
  }

  hasWinId = (layout: JustNode | null, justId: JustId) => {
    return this.getNodeByWinId(layout, justId) != null
  }


//


  updateNode = (layout: JustNode | null, updateSpec: JustUpdateSpec)=> {
    if (layout == null) return null;
    return update(layout, updateSpec)
  }

  buildSpecFromUpdateSpec = (branch: JustBranch, updateSpec: JustUpdateSpec): JustUpdateSpec => {
    if (branch.length > 0) {
      return set({}, branch, updateSpec);
    } else {
      return updateSpec;
    }
  }

  getNodeAtBranch = (node: JustNode | null, branch: JustBranch): JustNode | null => {
    if (branch.length > 0) {
      return get(node, branch, null);
    } else {
      return node;
    }
  }

  getBranchRightTop = (node: JustNode | null): JustBranch => {
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

  updateSplitSize = (node: JustNode | null, branch: JustBranch, size: number) => {
    const updateSpec = this.buildSpecFromUpdateSpec(branch, {
      $merge: {
        size: size
      }
    })
    return this.updateNode(node, updateSpec)
  }
}