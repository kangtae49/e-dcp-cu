import "./SideMenu.css"
import Jdenticon from "react-jdenticon";
import IconMinimize from "@/assets/minimize.svg?react"
import {JustUtil, LAYOUT_ID, SIDE_MENU_ID_LIST, SIDE_MENU_NODE_NAME} from "@/app/layout/layout-util.tsx";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";


function SideMenu() {

  const {
    toggleWin,
    addTabWin
  } = useJustLayout(LAYOUT_ID)

  const toggleSideMenu = () => {
    toggleWin(SIDE_MENU_NODE_NAME)
  }

  const openWin = async (justId: JustId) => {
    addTabWin(justId)
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
            <div key={JustUtil.toString(item.menuId)} className="side-menu-item" onClick={() => openWin(item.menuId)}>
              <div className="side-menu-icon">
                <Jdenticon size="25" value={item.menuId.viewId} />
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