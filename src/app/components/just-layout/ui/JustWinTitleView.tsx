import {type DropTargetMonitor, useDrop} from "react-dnd";
import classNames from 'classnames';
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faEllipsisVertical, faAngleDown, faCircleXmark} from "@fortawesome/free-solid-svg-icons"


import JustDraggableTitle, {type JustDragItem} from "./JustDraggableTitle";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Menu, MenuItem} from "@szhsin/react-menu";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import {JustBranch, JustId, JustStack} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";


interface Prop {
  layoutId: string
  dndAccept: string[]
  justBranch: JustBranch
  justStack: JustStack
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

const JustWinTitleView = observer(({layoutId, dndAccept, justBranch, justStack, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle}: Prop) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const justLayoutStore = useJustLayoutStore(layoutId);

  const clickClose = (justId: JustId) => {
    justLayoutStore.removeWin({
      justId
    })
    if (closeWin) {
      closeWin(justId)
    }
  }

  const closeAllTabs = (branch: JustBranch) => {
    const winIds: JustId[] = justLayoutStore.getWinIdsByBranch({branch});

    justLayoutStore.removeAllTabs({
      branch
    })

    if (closeWin) {
      winIds.forEach((justId: JustId) => {
        closeWin(justId)
      });
    }
  }

  const activeWin = (justId: JustId) => {
    justLayoutStore.activeWin({
      justId
    })
  }



  const onDrop = (itemType: any, item: JustDragItem) => {
    justLayoutStore.moveWin({
      pos: 'stack',
      justId: item.justId,
      branch: justBranch,
      index: item.index ?? -1
    })
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: dndAccept,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
      }),
      drop(_item: JustDragItem, monitor) {
        // console.log("drop item", item, monitor.getItem())
        onDrop(monitor.getItemType(), monitor.getItem())
        return undefined
      },
      hover(item: JustDragItem, _) {
        if (!ref.current) {
          return
        }
        item.index = -1
      }
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
            dndAccept={dndAccept}
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
})

export default JustWinTitleView
