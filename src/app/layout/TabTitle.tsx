import {observer} from "mobx-react-lite";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faClone, faExpand} from "@fortawesome/free-solid-svg-icons";
import {ControlledMenu, MenuItem, MenuState} from "@szhsin/react-menu";
import {JustBranch, JustId, JustUtil, useJustLayoutStore, WinInfo} from "@kangtae49/just-layout";
import React from "react";
import {LAYOUT_ID} from "@/app/layout/layout.tsx";

interface Props extends React.Attributes {
  justId: JustId
  layoutId: string
  justBranch: JustBranch
  winInfo: WinInfo
  menuProps: {
    state?: MenuState
    endTransition: () => void
  }
  toggleMenu: (open: boolean) => void
  anchorPoint: { x: number; y: number }
}

const TabTitle = observer(({layoutId, justId, justBranch, winInfo, menuProps, toggleMenu, anchorPoint}: Props) => {
  const layoutFullScreenId = `${LAYOUT_ID}_FULLSCREEN`
  const justLayoutStore = useJustLayoutStore(layoutId);
  const justLayoutFullScreenStore = useJustLayoutStore(layoutFullScreenId);

  const tabTitleTooltip = justLayoutStore.getTabTitleTooltip(justId)

  const clickClose = (justId: JustId) => {
    justLayoutStore.removeWin({
      justId
    })
  }
  const clickTitle = (_e: React.MouseEvent, justId: JustId) => {
    justLayoutStore.activeWin({
      justId
    })
  }
  const cloneWin = (justId: JustId) => {
    const cloneJustId = JustUtil.replaceDup(justId)
    justLayoutStore.cloneTab({
      justId,
      cloneJustId
    })
  }
  const fullScreenWin = (justId: JustId, hideTitle: boolean = false) => {
    justLayoutStore.activeWin({justId})
    if (justLayoutFullScreenStore.layout === null) {
      const justNode = justLayoutStore.getNodeAtBranch({branch: justBranch})
      justLayoutFullScreenStore.setLayout(justNode)
      justLayoutFullScreenStore.setHideTitle(hideTitle)
    } else {
      justLayoutFullScreenStore.setLayout(null)
      justLayoutFullScreenStore.setHideTitle(false)
    }
  }

  return (
    <>
      <div className="just-icon"
           onClick={(e) => clickTitle(e, justId)}
           title={tabTitleTooltip}
      >
        {winInfo.getTabIcon(justId, layoutId)}
      </div>
      <div className="just-title"
           onClick={(e) => clickTitle(e, justId)}
           title={tabTitleTooltip}
      >
        {justLayoutStore.getTabTitle(justId) ?? justId.title}
      </div>

      <div className="just-icon just-close" onClick={() => clickClose(justId)}>
        <Icon icon={faCircleXmark}/>
      </div>
      <ControlledMenu
        state={menuProps.state}
        endTransition={menuProps.endTransition}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem onClick={() => clickClose(justId)}>
          <div className="just-icon">
          </div>
          <div className="just-title">
            Close
          </div>
          <div className="just-icon" />
        </MenuItem>
        <MenuItem onClick={() => cloneWin(justId)}>
          <div className="just-icon">
            <Icon icon={faClone} />
          </div>
          <div className="just-title">
            New
          </div>
          <div className="just-icon" />
        </MenuItem>
        <MenuItem onClick={() => fullScreenWin(justId, true)}>
          <div className="just-icon">
            <Icon icon={faExpand} />
          </div>
          <div className="just-title">
            {justLayoutFullScreenStore.layout !== null ? 'F11' : 'Full'}
          </div>
          <div className="just-icon" />
        </MenuItem>
      </ControlledMenu>
    </>
  )
})

export default TabTitle
