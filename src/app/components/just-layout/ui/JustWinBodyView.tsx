
import {type DropTargetMonitor, useDrop, type XYCoord} from "react-dnd";
import classNames from 'classnames';
import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustStack,
} from "../justLayoutSlice.ts";
import {type JustDragItem} from "./JustDraggableTitle.tsx";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import {Activity, useLayoutEffect, useRef, useState} from "react";
import {GetWinInfoFn} from "..";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";

interface Prop {
  layoutId: string
  dndAccept: string[]
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
}

function JustWinBodyView (props: Prop) {
  const ref = useRef<HTMLDivElement>(null)

  const { layoutId, dndAccept, getWinInfo, justBranch, justStack } = props;
  const [overlayRect, setOverlayRect] = useState<{ top: number, left: number, width: number, height: number }|null>(null)
  const {
    state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const onDrop = (itemType: any, item: JustDragItem) => {
    console.log("onDrop(JustWinBody)", itemType, item)
    if (!item.pos) return;
    if (item.pos === 'stack') {
      dispatch(
        justLayoutActions.moveWin({
          pos: item.pos,
          branch: justBranch,
          justId: item.justId,
          index: item.index ?? -1
        })
      )
    } else {
      dispatch(
        justLayoutActions.moveWin({
          pos: item.pos,
          branch: justBranch,
          justId: item.justId,
          direction: item.direction ?? 'row',
        })
      )

    }
  }
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: dndAccept,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
      }),
      drop(_item: JustDragItem, monitor) {
        if (!ref.current) {
          return undefined
        }
        onDrop(monitor.getItemType(), monitor.getItem())
        return undefined
      },
      hover(item: JustDragItem, monitor) {
        if (!ref.current) {
          return
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
        const distX = hoverClientX - hoverMiddleX
        const distY = hoverClientY - hoverMiddleY
        const percentX = Math.abs((distX * 100) / hoverMiddleX)
        const percentY = Math.abs((distY * 100) / hoverMiddleY)

        console.log("percentX", percentX, "percentY", percentY)
        if (percentX < 60 && percentY < 60) {
          item.pos = 'stack'
          console.log('item: ', item)
          const overlayRect = {
            top: hoverBoundingRect.top,
            left: hoverBoundingRect.left,
            width: hoverBoundingRect.width,
            height: hoverBoundingRect.height
          }
          setOverlayRect(overlayRect)
        } else {
          const direction = percentX > percentY ? 'row' : 'column'
          const sign = direction === 'row' ? Math.sign(distX) : Math.sign(distY)
          const pos = sign > 0 ? 'second' : 'first'
          item.direction = direction
          item.pos = pos
          // console.log('item: ', item, percentX, percentY)

          const overlayRect = {
            top: (pos === 'second' && direction === 'column') ?  hoverBoundingRect.top + hoverBoundingRect.height/2 : hoverBoundingRect.top,
            left: (pos === 'second' && direction === 'row') ?  hoverBoundingRect.left + hoverBoundingRect.width/2 : hoverBoundingRect.left,
            width: direction === 'row' ? hoverBoundingRect.width/2 : hoverBoundingRect.width,
            height: direction === 'column' ? hoverBoundingRect.height/2 : hoverBoundingRect.height,
          }
          setOverlayRect(overlayRect)
        }
      }
    }), [justStack]
  )

  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);
  return (
    <div
      className={classNames(
        "just-win-body",
        {
          "isOver": isOver,
          "last-active": JustUtil.isEquals(justStack.active, justLayoutState?.lastActiveId)
        })
      }
      ref={ref}
    >
      {justStack.tabs.map(justId =>
        <Activity key={JustUtil.toString(justId)} mode={JustUtil.isEquals(justStack.active, justId) ? 'visible' : 'hidden'}>
          {getWinInfo(justId).getView(justId)}
        </Activity>
      )}

      {
        (isOver && overlayRect != null) &&
        <div className="just-overlay" style={{
          top: overlayRect.top,
          left: overlayRect.left,
          width: `${overlayRect.width}px`,
          height: `${overlayRect.height}px`,
        }} />
      }
    </div>
  )
}

export default JustWinBodyView
