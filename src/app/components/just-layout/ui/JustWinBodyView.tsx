
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
import {Activity, useLayoutEffect, useRef} from "react";
import {GetWinInfoFn} from "..";

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
        winId: item.winId,
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
        } else {
          const direction = percentX > percentY ? 'row' : 'column'
          const sign = direction === 'row' ? Math.sign(distX) : Math.sign(distY)
          const pos = sign > 0 ? 'second' : 'first'
          item.direction = direction
          item.pos = pos
          console.log('item: ', item, percentX, percentY)
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
      className={classnames("just-win-body", {"isOver": isOver})}
      ref={ref}
    >
      {justStack.tabs.map(winId =>
        <Activity key={winId} mode={justStack.active === winId ? 'visible' : 'hidden'}>
          {getWinInfo(winId).view}
        </Activity>
      )}
    </div>
  )
}

export default JustWinBodyView
