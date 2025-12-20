import './JustToolBar.css'
import IconLogo from "../../assets/icon.svg?react"
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState,
} from "@/app/components/just-layout/justLayoutSlice.ts";
import classNames from "classnames";
import {createJustLayoutThunks} from "@/app/components/just-layout/justLayoutThunks.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faGear} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";
import {CONFIG_KEYS} from "@/app/config/configsSlice.ts";
import {INIT_SIDE_MENU_SIZE, LAYOUT_ID, SIDE_MENU_ID_LIST} from "@/app/layout/layout-util.tsx";
import {WinObj} from "@/app/components/just-layout/index.ts";


function JustToolBar() {
  const {
    state: justLayoutState,
    // actions: justLayoutActions,
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)
  // const [size, setSize] = useState(INIT_SIDE_MENU_SIZE);

  const toggleSideMenu = () => {
    dispatch(justLayoutTrunks.toggleSideMenu())
  }

  const openWin = (winId: string) => {
    dispatch(justLayoutTrunks.openWinMenu({winId}))
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
            <div key={item.menuId} className="just-tool-center-menu" onClick={() => openWin(item.menuId)} title={item.menuName}>
              <div className="just-icon">
                <Jdenticon size="25" value={WinObj.toWinObjId(item.menuId).viewId} />
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
            CONFIG_KEYS.map((winObjId) =>
              <MenuItem key={WinObj.toWinId(winObjId)} className="just-menu-item" onClick={() => openWin(WinObj.toWinId(winObjId))}>
                <div className="just-icon">
                  <Jdenticon size="25" value={winObjId.viewId} />
                </div>
                <div className="just-title">
                  {winObjId.params?.['title']}
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
