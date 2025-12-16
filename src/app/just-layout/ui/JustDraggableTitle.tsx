import {useEffect, useRef} from "react";
import {
  createJustLayoutSlice,
  type JustBranch,
  type JustDirection, type JustLayoutActions, type JustLayoutState,
  type JustPos,
  type JustStack, LAYOUT_ID,
  type WinInfo
} from "@/app/just-layout/justLayoutSlice";
import {type DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import type { XYCoord } from 'react-dnd';
import classnames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons"
import {useDynamicSlice} from "@/store/hooks";

export interface DragItem {
  justBranch: JustBranch
  winId: string
  direction: JustDirection
  pos: JustPos
  index: number
}

interface Prop {
  justBranch: JustBranch
  winId: string
  winInfo: WinInfo
  justStack: JustStack
  rect: DOMRect | null
}

function JustDraggableTitle(props: Prop) {
  const { winInfo, justBranch, winId, justStack, rect: parentRect } = props;
  const ref = useRef<HTMLDivElement>(null)
  const {
    state: justLayoutState,
    actions: justLayoutActions,
    dispatch,
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)

  const closeWin = (winId: string) => {
    console.log("closeWin", winId)
    dispatch(
      justLayoutActions.removeWin({
        winId
      })
    )
  }
  const activeWin = (winId: string) => {
    console.log("activeWin", winId)
    dispatch(
      justLayoutActions.activeWin({
        winId
      })
    )
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
  }, [ref.current, parentRect, justLayoutState])


  drag(drop(ref))


  // console.log("JustDraggableTitle", winId, winInfo)
  return (
    <div
      className={classnames(
        "just-draggable-title",
        {
          "dragging": isDragging,
          "just-active": justStack.active === winId
        }
      )}
      ref={ref}
    >
      <div className="just-icon" onClick={() => activeWin(winId)}>{winInfo.icon}</div>
      <div className="just-title" onClick={() => activeWin(winId)}>{winInfo.title}</div>

      {(winInfo.showClose ?? true) &&
        <div className="just-icon just-close" onClick={() => closeWin(winId)}>
        <Icon icon={faCircleXmark}/>
      </div>}
    </div>
  )
}

export default JustDraggableTitle
