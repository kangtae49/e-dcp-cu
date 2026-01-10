import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {type DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import type { XYCoord } from 'react-dnd';
import classNames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleXmark, faClone, faExpand} from "@fortawesome/free-solid-svg-icons"
import {CloseWinFn, OnClickTitleFn, OnDoubleClickTitleFn, WinInfo} from "../index.ts";
import {ControlledMenu, MenuItem, useMenuState} from "@szhsin/react-menu";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {JustBranch, JustDirection, JustId, JustPos, JustStack} from "../justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";

export interface JustDragItem {
  justId: JustId
  direction?: JustDirection
  pos?: JustPos
  index?: number
}

interface Prop {
  layoutId: string
  dndAccept: string[]
  justBranch: JustBranch
  justId: JustId
  winInfo: WinInfo
  justStack: JustStack
  rect: DOMRect | null
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

const JustDraggableTitle = observer((props: Prop) => {
  const {
    layoutId,
    dndAccept,
    winInfo, justBranch, justId, justStack,
    closeWin,
    onClickTitle,
    onDoubleClickTitle,
    rect: parentRect
  } = props;
  const ref = useRef<HTMLDivElement>(null)
  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  // const {
  //   state: justLayoutState,
  //   actions: justLayoutActions,
  //   // thunks: justLayoutThunks,
  //   dispatch,
  // } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice, createJustLayoutThunks)

  const justLayoutStore = useJustLayoutStore(layoutId);

  const clickClose = (justId: JustId) => {
    justLayoutStore.removeWin({
      justId
    })
    if (closeWin) {
      closeWin(justId);
    }
  }

  const cloneWin = (justId: JustId) => {
    const cloneJustId = JustUtil.replaceDup(justId)
    justLayoutStore.cloneTab({
      justId,
      cloneJustId
    })
  }
  const fullScreenWin = async (justId: JustId) => {
    console.log("fullScreenWin", justId, justLayoutStore.isFullScreen)
    justLayoutStore.activeWin({justId})

    // if(!isEqual(justLayoutStore.fullScreenBranch, justBranch)) {
    if(justLayoutStore.fullScreenBranch == null) {
      justLayoutStore.setFullScreenBranch(justBranch)
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }
  const fullScreenBranch = async (branch: JustBranch) => {
    // if(!isEqual(justLayoutStore.fullScreenBranch, branch)) {
    if(justLayoutStore.fullScreenBranch == null) {
      justLayoutStore.setFullScreenBranch(branch)
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }

  const isParentBranch = () => {
    if(justLayoutStore.fullScreenBranch !== null) return false
    if (justBranch.length === 0) return false;
    const node = justLayoutStore.getNodeAtBranch({branch: justBranch})
    if (node === null) return false;
    return !node.name
  }

  const clickTitle = (e: React.MouseEvent<HTMLDivElement>, justId: JustId) => {
    justLayoutStore.activeWin({
      justId
    })
    if (onClickTitle) {
      onClickTitle(e, justId)
    }

  }

  const dblClickTitle = (e: React.MouseEvent<HTMLDivElement>, justId: JustId) => {
    if (onDoubleClickTitle) {
      onDoubleClickTitle(e, justId)
    }
  }

  const [{ isDragging }, drag] = useDrag({
    type: justId.viewId,
    item: {
      justBranch,
      justId,
      index: -1,
    } as JustDragItem,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop<JustDragItem, void, { handlerId: any | null }> ({
    accept: dndAccept,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: JustDragItem, monitor) {
      if (!ref.current) {
        return
      }
      if (justId === item.justId) {
        return
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left

      const sourceWinId = item.justId;
      const targetWinId = justId;

      const curTabs = justStack.tabs.filter(tabId => !JustUtil.isEquals(tabId, sourceWinId))
      let targetIndex = JustUtil.indexOf(curTabs, targetWinId)
      if (hoverClientX > hoverMiddleX) {
        targetIndex += 1
      }
      item.pos = 'stack'
      item.index = targetIndex
    }
  })

  useEffect(() => {
    if (JustUtil.isEquals(justId, justLayoutStore.lastActiveId ?? null)) {
      if (ref.current == null) return;
      if (parentRect == null) return;
      const rect = ref.current.getBoundingClientRect();
      if (parentRect.left > rect.left || parentRect.right < rect.right) {
        ref.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        })
      }
    }
  }, [justLayoutStore.lastActiveTm])



  useLayoutEffect(() => {
    if (ref.current) {
      drag(drop(ref))
    }
  }, [drop, drag]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true);
  }, [toggleMenu]);



  // console.log("JustDraggableTitle", winId, winInfo)
  return (
    <div
      className={classNames(
        "just-draggable-title",
        "just-title-menus",
        {
          "dragging": isDragging,
          "just-active": JustUtil.isEquals(justStack.active, justId),
          "last-active": JustUtil.isEquals(justLayoutStore.lastActiveId, justId)
        }
      )}
      ref={ref}
      onContextMenu={handleContextMenu}
    >
      <div className="just-icon"
           onClick={(e) => clickTitle(e, justId)}
           onDoubleClick={(e) => dblClickTitle(e, justId)}
      >
        {winInfo.icon}
      </div>
      <div className="just-title"
           onClick={(e) => clickTitle(e, justId)}
           onDoubleClick={(e) => dblClickTitle(e, justId)}
      >
        {typeof winInfo.title === 'string' ? winInfo.title : winInfo.title(justId)}
      </div>

      {(winInfo.showClose ?? true) &&
      <div className="just-icon just-close" onClick={() => clickClose(justId)}>
          <Icon icon={faCircleXmark}/>
      </div>}
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
        >
        <MenuItem onClick={() => clickClose(justId)}>
          <div className="just-icon">
          </div>
          <div className="just-title">
            Close
          </div>
          <div className="just-icon" />
        </MenuItem>
        {(winInfo.canDup ?? false) &&
          <MenuItem onClick={() => cloneWin(justId)}>
            <div className="just-icon">
                <Icon icon={faClone} />
            </div>
            <div className="just-title">
                Clone
            </div>
            <div className="just-icon" />
          </MenuItem>
        }
        {(winInfo.canFullScreen ?? false) &&
          <>
            <MenuItem onClick={() => fullScreenWin(justId)}>
                <div className="just-icon">
                    <Icon icon={faExpand} />
                </div>
                <div className="just-title">
                    Screen
                </div>
                <div className="just-icon" />
            </MenuItem>
            { isParentBranch() &&
              <MenuItem onClick={() => fullScreenBranch(justBranch.slice(0, -1))}>
                  <div className="just-icon">
                      <Icon icon={faExpand} />
                  </div>
                  <div className="just-title">
                      P-Screen
                  </div>
                  <div className="just-icon" />
              </MenuItem>
            }
          </>
        }
      </ControlledMenu>
    </div>
  )
})

export default JustDraggableTitle
