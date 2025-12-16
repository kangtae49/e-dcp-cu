import "./SideMenu.css"
import Jdenticon from "react-jdenticon";
import IconMinimize from "@/assets/minimize.svg?react"
import {useDynamicSlice} from "@/store/hooks";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState, LAYOUT_ID
} from "@/app/just-layout/justLayoutSlice";
import {createJustLayoutThunks} from "@/app/just-layout/justLayoutThunks";
import {fromWinId, fromWinObjId} from "@/App";


export const INIT_SIDE_MENU_SIZE = 200;

export interface SideMenuItem {
  menuId: string,
  menuName: string
}
export const SIDE_MENU_ID_LIST: SideMenuItem[] = [
  {menuId: fromWinObjId({viewId: 'page01'}), menuName: "자산통계정보"},
  {menuId: fromWinObjId({viewId: 'demo'}), menuName: "Demo"},
  {menuId: fromWinObjId({viewId: 'demo-grid'}), menuName: "Demo Grid"},
  {menuId: fromWinObjId({viewId: 'demo-line-chart'}), menuName: "Demo Line Chart"},
]

function SideMenu() {
  const {
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)


  const toggleSideMenu = () => {
    dispatch(justLayoutTrunks.toggleSideMenu({size: INIT_SIDE_MENU_SIZE}))
  }

  const openWin = (winId: string) => {
    dispatch(justLayoutTrunks.openWin({winId}))
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
                <Jdenticon size="25" value={fromWinId(item.menuId).viewId} />
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