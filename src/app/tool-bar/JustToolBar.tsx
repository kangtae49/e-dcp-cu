import './JustToolBar.css'
import IconLogo from "../../assets/icon.svg?react"
import {useDynamicSlice} from "@/store/hooks";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState, LAYOUT_ID
} from "@/app/just-layout/justLayoutSlice";
import classNames from "classnames";
import {createJustLayoutThunks} from "@/app/just-layout/justLayoutThunks";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faGear} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";
import {INIT_SIDE_MENU_SIZE, SIDE_MENU_ID_LIST} from "@/app/side-menu/ui/SideMenu";
import {fromWinId, fromWinObjId} from "@/App";
import {CONFIG_KEYS} from "@/app/config/configsSlice";


function JustToolBar() {
  const {
    state: justLayoutState,
    // actions: justLayoutActions,
    dispatch,
    thunks: justLayoutTrunks
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice, createJustLayoutThunks)
  // const [size, setSize] = useState(INIT_SIDE_MENU_SIZE);

  const toggleSideMenu = () => {
    dispatch(justLayoutTrunks.toggleSideMenu({size: INIT_SIDE_MENU_SIZE}))
  }

  const openWin = (winId: string) => {
    dispatch(justLayoutTrunks.openWin({winId}))
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
                <Jdenticon size="25" value={fromWinId(item.menuId).viewId} />
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
              <MenuItem key={fromWinObjId(winObjId)} className="just-menu-item" onClick={() => openWin(fromWinObjId(winObjId))}>
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
