import {type DropTargetMonitor, useDrop} from "react-dnd";
import classNames from 'classnames';
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faEllipsisVertical, faAngleDown, faCircleXmark} from "@fortawesome/free-solid-svg-icons"

import {
  createJustLayoutSlice,
  type JustBranch, JustId,
  type JustLayoutActions,
  type JustLayoutState,
  type JustStack,
} from "../justLayoutSlice.ts";
import JustDraggableTitle, {type JustDragItem} from "./JustDraggableTitle";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Menu, MenuItem} from "@szhsin/react-menu";
import {CloseWinFn, GetWinInfoFn, JUST_DRAG_SOURCE, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {createJustLayoutThunks} from "../justLayoutThunks.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";


interface Prop {
  layoutId: string
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
  // viewMap: Record<string, WinInfo>
}

function JustWinTitleView({layoutId, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) {
  const ref = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const {
    actions: justLayoutActions,
    thunks: justLayoutThunks,
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice, createJustLayoutThunks)
  const dispatch = useAppDispatch();

  const clickClose = (justId: JustId) => {
    console.log("clickClose", justId)

    dispatch(
      justLayoutActions.removeWin({
        justId
      })
    )
    if (closeWin) {
      closeWin(justId)
    }
  }

  const closeAllTabs = (branch: JustBranch) => {
    const winIds: JustId[] = dispatch(justLayoutThunks.getWinIdsByBranch({branch}));

    dispatch(
      justLayoutActions.removeAllTabs({
        branch
      })
    )

    if (closeWin) {
      winIds.forEach((justId: JustId) => {
        closeWin(justId)
      });
    }
  }

  const activeWin = (justId: JustId) => {
    console.log("activeWin", justId)
    dispatch(
      justLayoutActions.activeWin({
        justId
      })
    )
  }



  const onDrop = (itemType: any, item: JustDragItem) => {
    console.log("onDrop(JustWinTitle)", itemType, item)
    dispatch(
      justLayoutActions.moveWin({
        branch: justBranch,
        justId: item.justId,
        pos: 'stack',
        index: item.index ?? -1
      })
    )
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [JUST_DRAG_SOURCE],
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
      drop(_item: JustDragItem, monitor) {
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

  const getTitle = (justId: JustId) => {
    const title = getWinInfo(justId).title
    if (typeof title === 'string') {
      return title
    } else {
      return title(justId)
    }
  }

  return (
    <div
      className={classNames("just-win-title")}
      tabIndex={1}
    >
      <div className={classNames("just-title-list", {"is-over": isOver})} ref={ref}>
        {justStack.tabs.map(justId =>
          <JustDraggableTitle
            key={[...justBranch, JustUtil.toString(justId)].join(",")}
            layoutId={layoutId}
            rect={rect}
            justId={justId}
            justBranch={justBranch}
            justStack={justStack}
            winInfo={getWinInfo(justId)}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
          />
        )}
      </div>
      <div className="just-title-menus">
        <Menu menuButton={
          <div className="just-title-menu">
            <Icon icon={faAngleDown} />
          </div>
        }>
          {justStack.tabs.map(justId =>
            <MenuItem key={JustUtil.toString(justId)}
                      className={classNames("just-menu-item", {"active": JustUtil.isEquals(justStack.active, justId)})}>
              <div className="just-icon" onClick={() => activeWin(justId)}>{getWinInfo(justId).icon}</div>
              <div className="just-title" onClick={() => activeWin(justId)}>
                {getTitle(justId)}
              </div>

              {(getWinInfo(justId).showClose ?? true) && <div className="just-icon just-close" onClick={(e) => {
                e.stopPropagation();
                clickClose(justId)
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
