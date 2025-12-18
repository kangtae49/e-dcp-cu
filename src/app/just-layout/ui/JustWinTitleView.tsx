import {type DropTargetMonitor, useDrop} from "react-dnd";
import classNames from 'classnames';
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faEllipsisVertical, faAngleDown, faCircleXmark} from "@fortawesome/free-solid-svg-icons"

import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustStack,
} from "@/app/just-layout/justLayoutSlice";
import JustDraggableTitle, {type DragItem} from "@/app/just-layout/ui/JustDraggableTitle";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Menu, MenuItem} from "@szhsin/react-menu";
import {LAYOUT_ID} from "@/utils/layout-util.tsx";
import {GetWinInfoFn} from "@/app/just-layout";
// import '@szhsin/react-menu/dist/index.css';
// import '@szhsin/react-menu/dist/transitions/zoom.css';


interface Prop {
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  // viewMap: Record<string, WinInfo>
}

function JustWinTitleView({justBranch, justStack, getWinInfo}: Prop) {
  const ref = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const {
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const closeWin = (winId: string) => {
    console.log("closeWin", winId)
    dispatch(
      justLayoutActions.removeWin({
        winId
      })
    )
  }

  const closeAllTabs = (branch: JustBranch) => {
    dispatch(
      justLayoutActions.removeAllTabs({
        branch
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



  const onDrop = (itemType: any, item: DragItem) => {
    console.log("onDrop(JustWinTitle)", itemType, item)
    dispatch(
      justLayoutActions.moveWin({
        branch: justBranch,
        winId: item.winId,
        direction: item.direction,
        pos: 'stack',
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
        // console.log("drop item", item, monitor.getItem())
        onDrop(monitor.getItemType(), monitor.getItem())
        return undefined
      },
    }), [justStack]
  )

  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref)
    }
  }, [drop]);

  useEffect(() => {
    if (ref.current === null) return;

    function update() {
      if (ref.current === null) return;
      const newRect = ref.current?.getBoundingClientRect() ?? null;
      // console.log("parent Rect:", newRect)
      setRect(newRect)
    }
    update();

    const observer = new ResizeObserver(update);
    observer.observe(ref.current);

    window.addEventListener("scroll", update, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
    };
  }, []);


  return (
    <div
      className={classNames("just-win-title")}
      tabIndex={1}
    >
      <div className={classNames("just-title-list", {"is-over": isOver})} ref={ref}>
        {justStack.tabs.map(winId =>
          <JustDraggableTitle
            key={[...justBranch, winId].join(",")}
            winId={winId}
            justBranch={justBranch}
            justStack={justStack}
            winInfo={getWinInfo(winId)}
            rect={rect}
          />
        )}
      </div>
      <div className="just-title-menus">
        <Menu menuButton={
          <div className="just-title-menu">
            <Icon icon={faAngleDown} />
          </div>
        }>
          {justStack.tabs.map(winId =>
            <MenuItem key={winId} className="just-menu-item">
              <div className="just-icon" onClick={() => activeWin(winId)}>{getWinInfo(winId).icon}</div>
              <div className="just-title" onClick={() => activeWin(winId)}>
                {getWinInfo(winId).title}
              </div>

              {(getWinInfo(winId).showClose ?? true) && <div className="just-icon just-close" onClick={(e) => {
                e.stopPropagation();
                closeWin(winId)
              }}>
                  <Icon icon={faCircleXmark}/>
              </div>}
            </MenuItem>
          )}
        </Menu>
        <Menu menuButton={
          <div className="just-title-menu">
            <Icon icon={faEllipsisVertical} />
          </div>
        }>
          <MenuItem className="just-menu-item" onClick={() => closeAllTabs(justBranch)}>
            <div className="just-icon" />
            <div className="just-title">
              Close All
            </div>
            <div className="just-icon" />

          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default JustWinTitleView
