
import {type DropTargetMonitor, useDrop, type XYCoord} from "react-dnd";
import classnames from 'classnames';
import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustStack,
} from "../justLayoutSlice.ts";
import {type DragItem} from "./JustDraggableTitle.tsx";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import {Activity, useLayoutEffect, useRef, useState} from "react";
import {GetWinInfoFn} from "..";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";

interface Prop {
  layoutId: string
  justBranch: JustBranch
  justStack: JustStack
  // viewMap: Record<string, WinInfo>
  getWinInfo: GetWinInfoFn
}

function JustWinBodyView (props: Prop) {
  const ref = useRef<HTMLDivElement>(null)

  const { layoutId, getWinInfo, justBranch, justStack } = props;
  const [overlayRect, setOverlayRect] = useState<{ top: number, left: number, width: number, height: number }|null>(null)
  const {
    // state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const onDrop = (itemType: any, item: DragItem) => {
    console.log("onDrop(JustWinBody)", itemType, item)

    dispatch(
      justLayoutActions.moveWin({
        branch: justBranch,
        justId: item.justId,
        direction: item.direction,
        pos: item.pos,
        index: item.index
      })
    )
  }
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['DRAG-SOURCE-JUST-TITLE'],
      canDrop: () => {
        let canDrop = true;
        if (justStack.active !== null && !(getWinInfo(justStack.active).canDrop ?? true)) {
          canDrop = false
        }
        return canDrop;
      },
      // canDrop: () => true,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop(_item: DragItem, monitor) {
        if (!ref.current) {
          return undefined
        }
        // if (item.winId === justStack.active) {
        //   return
        // }
        onDrop(monitor.getItemType(), monitor.getItem())
        return undefined
      },
      hover(item: DragItem, monitor) {
        if (!ref.current) {
          return
        }
        if(!monitor.canDrop()) {
          return;
        }
        // if (item.winId === justStack.active) {
        //   return
        // }
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
          console.log('item: ', item, percentX, percentY)

          // row    first  top:0  left: 0
          // row    second top:0  left: x
          // column first  top:0  left: 0
          // column second top:x  left: 0
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
  console.log('isOver', isOver);
  return (
    <div
      className={classnames("just-win-body", {"isOver": isOver})}
      ref={ref}
    >
      {justStack.tabs.map(justId =>
        <Activity key={JustUtil.toString(justId)} mode={JustUtil.isEquals(justStack.active, justId) ? 'visible' : 'hidden'}>
          {getWinInfo(justId).view}
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
