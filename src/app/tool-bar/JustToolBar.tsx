import './JustToolBar.css'
import IconLogo from "../../assets/icon.svg?react"
import classNames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faGear} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";
import {CONFIG_KEYS} from "@/app/config/configsSlice.ts";
import {
  INIT_SIDE_MENU_SIZE,
  JustUtil,
  LAYOUT_ID,
  SIDE_MENU_ID_LIST,
  SIDE_MENU_NODE_NAME
} from "@/app/layout/layout-util.tsx";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";


function JustToolBar() {

  const {
    state: justLayoutState,
    toggleWin,
    addTabWin
  } = useJustLayout(LAYOUT_ID)


  const toggleSideMenu = () => {
    toggleWin(SIDE_MENU_NODE_NAME)
  }

  const openWin = (justId: JustId) => {
    addTabWin(justId)
  }

  const size = (justLayoutState?.layout?.type === "split-percentage" || justLayoutState?.layout?.type === "split-pixels")
    ? justLayoutState.layout.size
    : INIT_SIDE_MENU_SIZE;

  return (
    <div className="just-tool-bar">
      <div
        className={classNames("just-app-icon", {"on": size > 0})}
        onClick={toggleSideMenu}
      >
        <IconLogo />
      </div>
      <div className="just-tool-center">
        {
          size <= 0 &&
          SIDE_MENU_ID_LIST.map(item =>
            <div key={JustUtil.toString(item.menuId)} className="just-tool-center-menu" onClick={() => openWin(item.menuId)} title={item.menuName}>
              <div className="just-icon">
                <Jdenticon size="25" value={item.menuId.viewId} />
              </div>
            </div>
          )
        }
      </div>

      <div className="just-tool-menus">

        <Menu menuButton={
          <div className="just-tool-menu">
            <Icon icon={faGear} />
          </div>
        }>
          {
            CONFIG_KEYS.map((justId) =>
              <MenuItem key={JustUtil.toString(justId)} className="just-menu-item" onClick={() => openWin(justId)}>
                <div className="just-icon">
                  <Jdenticon size="25" value={justId.viewId} />
                </div>
                <div className="just-title">
                  {JustUtil.getParamString(justId, 'title')}
                </div>
                <div className="just-icon" />
              </MenuItem>
            )
          }
        </Menu>
      </div>

    </div>
  )
}

export default JustToolBar
