import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {
  createJustLayoutSlice,
  type JustBranch,
  type JustDirection, JustId, type JustLayoutActions, type JustLayoutState,
  type JustPos,
  type JustStack,
} from "../justLayoutSlice.ts";
import {type DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import type { XYCoord } from 'react-dnd';
import classNames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleXmark, faClone} from "@fortawesome/free-solid-svg-icons"
import {useDynamicSlice} from "@/store/hooks.ts";
import {CloseWinFn, JUST_DRAG_SOURCE, OnClickTitleFn, OnDoubleClickTitleFn, WinInfo} from "../index.ts";
import {ControlledMenu, MenuItem, useMenuState} from "@szhsin/react-menu";
import {createJustLayoutThunks} from "../justLayoutThunks.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";

export interface JustDragItem {
  // justBranch: JustBranch
  justId: JustId
  direction?: JustDirection
  pos?: JustPos
  index?: number
}

interface Prop {
  layoutId: string
  dndType: string
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

function JustDraggableTitle(props: Prop) {
  const {
    layoutId,
    dndType, dndAccept,
    winInfo, justBranch, justId, justStack,
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
    // thunks: justLayoutThunks,
    dispatch,
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice, createJustLayoutThunks)

  const clickClose = (justId: JustId) => {
    console.log("closeWin", justId)

    dispatch(
      justLayoutActions.removeWin({
        justId
      })
    )
    if (closeWin) {
      closeWin(justId);
    }
  }

  const cloneWin = (justId: JustId) => {
    const cloneJustId = JustUtil.replaceDup(justId)
    dispatch(
      justLayoutActions.cloneTab({
        justId,
        cloneJustId
      })
    )
  }

  const clickTitle = (e: React.MouseEvent<HTMLDivElement>, justId: JustId) => {
    console.log("clickTitle", justId)
    dispatch(
      justLayoutActions.activeWin({
        justId
      })
    )
    if (onClickTitle) {
      onClickTitle(e, justId)
    }

  }

  const dblClickTitle = (e: React.MouseEvent<HTMLDivElement>, justId: JustId) => {
    console.log("dblClickTitle", justId)
    if (onDoubleClickTitle) {
      onDoubleClickTitle(e, justId)
    }
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      canDrag: winInfo.canDrag ?? true,
      item: {
        justBranch,
        justId,
        index: -1,
      } as JustDragItem,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
  )

  const [, drop] = useDrop<JustDragItem, void, { handlerId: any | null }> ({
    accept: dndAccept,
    canDrop: () => winInfo.canDrop ?? true,
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
      if (!monitor.canDrop()) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
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
    if (JustUtil.isEquals(justId, justLayoutState?.lastActiveId ?? null)) {
      if (ref.current == null) return;
      if (parentRect == null) return;
      const rect = ref.current.getBoundingClientRect();
      if (parentRect.left > rect.left || parentRect.right < rect.right) {
        console.log("JustDraggableTitle useEffect")
        ref.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        })
      }
    }
  }, [justLayoutState?.lastActiveTm])



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
          "just-active": justStack.active === justId
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
      </ControlledMenu>
    </div>
  )
}

export default JustDraggableTitle
