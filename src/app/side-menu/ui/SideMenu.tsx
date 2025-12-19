import "./SideMenu.css"
import Jdenticon from "react-jdenticon";
import IconMinimize from "@/assets/minimize.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState,
} from "@/app/components/just-layout/justLayoutSlice.ts";
import {createJustLayoutThunks} from "@/app/components/just-layout/justLayoutThunks.ts";
import {LAYOUT_ID, SIDE_MENU_ID_LIST} from "@/utils/layout-util.tsx";
import {WinObj} from "@/app/components/just-layout/index.ts";




function SideMenu() {
  const {
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)


  const toggleSideMenu = () => {
    dispatch(justLayoutTrunks.toggleSideMenu())
  }

  const openWin = async (winId: string) => {
    dispatch(justLayoutTrunks.openWinMenu({winId}))

    // const viewId = WinObj.toWinObjId(winId).viewId;
    // const winIds: string[] = dispatch(justLayoutTrunks.queryWinIdByViewId({viewId}))
    // if (winIds.includes(winId) || winIds.length === 0) {
    //   dispatch(justLayoutTrunks.openWin({winId}))
    // } else {
    //   dispatch(justLayoutTrunks.openWin({winId: winIds.at(-1)}))
    // }
  }

  return (
    <div className="side-menu">
      <div className="side-menu-title">
        <div className="side-menu-name">Menu</div>
        <div className="side-menu-minimize side-menu-icon" onClick={toggleSideMenu}><IconMinimize /></div>
      </div>
      <div className="side-menu-items">
        {
          SIDE_MENU_ID_LIST.map(item =>
            <div key={item.menuId} className="side-menu-item" onClick={() => openWin(item.menuId)}>
              <div className="side-menu-icon">
                <Jdenticon size="25" value={WinObj.toWinObjId(item.menuId).viewId} />
              </div>
              <div className="side-menu-name">{item.menuName}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SideMenu