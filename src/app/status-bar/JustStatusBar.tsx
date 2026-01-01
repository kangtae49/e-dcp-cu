import "./JustStatusBar.css"
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {
  BOTTOM_PANEL_NODE_NAME,
  INIT_BOTTOM_PANEL_SIZE,
  INIT_SIDE_MENU_SIZE,
  LAYOUT_ID,
  SIDE_MENU_NODE_NAME
} from "@/app/layout/layout.tsx";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
import classNames from "classnames";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faTerminal} from "@fortawesome/free-solid-svg-icons";

interface Props {
  justId: JustId
}
function JustStatusBar({justId}: Props) {
  const {
    toggleWin,
    getSizeByNodeName,
    addTabWin
  } = useJustLayout(LAYOUT_ID)


  const toggleBottomPanel = () => {
    toggleWin(BOTTOM_PANEL_NODE_NAME)
  }

  const size = getSizeByNodeName(BOTTOM_PANEL_NODE_NAME) ?? INIT_BOTTOM_PANEL_SIZE;
  return (
    <div className="just-status-bar">
      <div className="just-status-center">

      </div>
      <div
        className={classNames("just-status-icon", {"on": size > 0})}
        onClick={toggleBottomPanel}
      >
        <Icon icon={faTerminal} />
      </div>

    </div>
  )
}

export default JustStatusBar
