import './JustToolBar.css'
import classNames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faBars, faGear, faPen} from "@fortawesome/free-solid-svg-icons"
import {Menu, MenuItem} from "@szhsin/react-menu";
import Jdenticon from "react-jdenticon";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import {
  aboutId, CONTENTS_VIEW, excalidrawViewId, helpId,
  INIT_SIDE_MENU_SIZE,
  SIDE_MENU_ID_LIST,
  SIDE_MENU_NODE_NAME, ViewId,
  viewMap
} from "@/app/layout/layout.tsx";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {GRID_DATA_KEYS} from "@/app/grid-data/gridData.constants.ts";
import {observer} from "mobx-react-lite";

interface Props {
  justId: JustId
  layoutId: string
}

const JustToolBar = observer(({justId: _justId, layoutId}: Props) => {

  const justLayoutStore = useJustLayoutStore(layoutId)


  const toggleSideMenu = () => {
    justLayoutStore.toggleWin({nodeName: SIDE_MENU_NODE_NAME})
  }

  const openWin = (justId: JustId) => {
    // justLayoutStore.addTabByNodeName({justId, nodeName: CONTENTS_VIEW})
    justLayoutStore.openWinMenu({justId, nodeName: CONTENTS_VIEW})
  }
  const size = justLayoutStore.getSizeByNodeName({nodeName: SIDE_MENU_NODE_NAME}) ?? INIT_SIDE_MENU_SIZE;
  const isHide = justLayoutStore.isPrimaryHide({nodeName: SIDE_MENU_NODE_NAME}) ?? false;

  return (
    <div className="just-tool-bar">
      <div
        className={classNames("just-app-icon", {"on": !isHide})}
        onClick={toggleSideMenu}
      >
        {/*<IconLogo />*/}
        <Icon icon={faBars} />
      </div>
      <div className="just-tool-center">
        {
          (size <= 40 || isHide) &&
          SIDE_MENU_ID_LIST.map(item =>
            <div key={JustUtil.toString(item.menuId)} className="just-tool-center-menu" onClick={() => openWin(item.menuId)} title={item.menuName}>
              <div className="just-icon">
                <Jdenticon size="25" value={item.menuId.viewId} />
              </div>
            </div>
          )
        }
      </div>
      <div className="just-app-icon" onClick={() => openWin(JustUtil.replaceDup(excalidrawViewId))}>
        <Icon icon={faPen} />
      </div>

      <div className="just-tool-menus">

        <Menu menuButton={
          <div className="just-tool-menu">
            <Icon icon={faGear} />
          </div>
        }>
          {
            GRID_DATA_KEYS.map((justId) =>
              <MenuItem key={JustUtil.toString(justId)} className="just-menu-item" onClick={() => openWin(justId)}>
                <div className="just-icon">
                  {viewMap[justId.viewId as ViewId].getIcon(justId, layoutId)}
                </div>
                <div className="just-title">
                  {justId.title}
                </div>
                <div className="just-icon" />
              </MenuItem>
            )
          }
          <MenuItem className="just-menu-item" onClick={() => openWin(helpId)}>
            <div className="just-icon">
              {viewMap[helpId.viewId as ViewId].getIcon(helpId, layoutId)}
            </div>
            <div className="just-title">
              {helpId.title}
            </div>
            <div className="just-icon"/>
          </MenuItem>
          <MenuItem className="just-menu-item" onClick={() => openWin(aboutId)}>
            <div className="just-icon">
              {viewMap[aboutId.viewId as ViewId].getIcon(aboutId, layoutId)}
            </div>
            <div className="just-title">
              {aboutId.title}
            </div>
            <div className="just-icon" />
          </MenuItem>
        </Menu>
      </div>

    </div>
  )
})

export default JustToolBar
