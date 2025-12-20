import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {
  createJustLayoutSlice,
  type JustBranch,
  type JustDirection, type JustLayoutActions, type JustLayoutState,
  type JustPos,
  type JustStack,
} from "../justLayoutSlice.ts";
import {type DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import type { XYCoord } from 'react-dnd';
import classnames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleXmark, faClone} from "@fortawesome/free-solid-svg-icons"
import {useDynamicSlice} from "@/store/hooks.ts";
import {CloseWinFn, OnClickTitleFn, OnDoubleClickTitleFn, WinInfo} from "../index.ts";
import {ControlledMenu, MenuItem, useMenuState} from "@szhsin/react-menu";
import {createJustLayoutThunks} from "../justLayoutThunks.ts";

export interface DragItem {
  justBranch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
}

interface Prop {
  layoutId: string
  justBranch: JustBranch
  winId: string
  winInfo: WinInfo
  justStack: JustStack
  rect: DOMRect | null
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

function JustDraggableTitle(props: Prop) {
  const {
    layoutId,
    winInfo, justBranch, winId, justStack,
    closeWin,
    onClickTitle,
    onDoubleClickTitle,
    rect: parentRect
  } = props;
  const ref = useRef<HTMLDivElement>(null)
  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const {
    state: justLayoutState,
    actions: justLayoutActions,
    thunks: justLayoutThunks,
    dispatch,
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice, createJustLayoutThunks)

  const clickClose = (winId: string) => {
    console.log("closeWin", winId)

    dispatch(
      justLayoutActions.removeWin({
        winId
      })
    )
    if (closeWin) {
      closeWin(winId);
    }
  }

  const cloneWin = (winId: string) => {
    dispatch(
      justLayoutThunks.cloneWin({
        winId
      })
    )
  }

  const clickTitle = (e: React.MouseEvent<HTMLDivElement>, winId: string) => {
    console.log("clickTitle", winId)
    dispatch(
      justLayoutActions.activeWin({
        winId
      })
    )
    if (onClickTitle) {
      onClickTitle(e, winId)
    }

  }

  const dblClickTitle = (e: React.MouseEvent<HTMLDivElement>, winId: string) => {
    console.log("dblClickTitle", winId)
    if (onDoubleClickTitle) {
      onDoubleClickTitle(e, winId)
    }
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DRAG-SOURCE-JUST-TITLE',
      canDrag: winInfo.canDrag ?? true,
      item: {
        justBranch,
        winId,
        index: -1,
      } as DragItem,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
  )

  const [, drop] = useDrop<DragItem, void, { handlerId: any | null }> ({
    accept: 'DRAG-SOURCE-JUST-TITLE',
    canDrop: () => winInfo.canDrop ?? true,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      if (winId === item.winId) {
        return
      }
      if (!monitor.canDrop()) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left

      const sourceWinId = item.winId;
      const targetWinId = winId;

      const curTabs = justStack.tabs.filter(tabId => tabId !== sourceWinId)
      let targetIndex = curTabs.indexOf(targetWinId)
      if (hoverClientX > hoverMiddleX) {
        targetIndex += 1
      }
      item.pos = 'stack'
      item.index = targetIndex
    }
  })

  useEffect(() => {
    if (ref.current == null) return;
    if (parentRect == null) return;
    if (justStack.active !== winId) return;
    const rect = ref.current.getBoundingClientRect();

    if (parentRect.left > rect.left || parentRect.right < rect.right) {
      ref.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      })
    }
  }, [parentRect, justLayoutState, justStack.active, winId])



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
      className={classnames(
        "just-draggable-title",
        "just-title-menus",
        {
          "dragging": isDragging,
          "just-active": justStack.active === winId
        }
      )}
      ref={ref}
      onContextMenu={handleContextMenu}
    >
      <div className="just-icon"
           onClick={(e) => clickTitle(e, winId)}
           onDoubleClick={(e) => dblClickTitle(e, winId)}
      >
        {winInfo.icon}
      </div>
      <div className="just-title"
           onClick={(e) => clickTitle(e, winId)}
           onDoubleClick={(e) => dblClickTitle(e, winId)}
      >
        {winInfo.title}
      </div>

      {(winInfo.showClose ?? true) &&
      <div className="just-icon just-close" onClick={() => clickClose(winId)}>
          <Icon icon={faCircleXmark}/>
      </div>}
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
        >
        <MenuItem onClick={() => clickClose(winId)}>
          <div className="just-icon">
          </div>
          <div className="just-title">
            Close
          </div>
          <div className="just-icon" />
        </MenuItem>
        {(winInfo.canDup ?? false) &&
          <MenuItem onClick={() => cloneWin(winId)}>
            <div className="just-icon">
                <Icon icon={faClone} />
            </div>
            <div className="just-title">
                Clone
            </div>
            <div className="just-icon" />
          </MenuItem>
        }
      </ControlledMenu>
    </div>
  )
}

export default JustDraggableTitle
