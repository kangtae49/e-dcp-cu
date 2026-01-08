import './TopMenuBar.css'
import IconLogo from "../../assets/icon.svg?react"
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
// import IconClose from "../../assets/close.svg?react"
// import IconMinimize from "../../assets/minimize.svg?react"
// import IconMaximize from "../../assets/maximize.svg?react"

interface Props {
  justId: JustId
}

function TopMenuBar({justId}: Props) {
  return (
    <div className="just-top-menu-bar">
      <div className="just-app-icon">
        <IconLogo />
      </div>
      <div className="just-title">DcpCu - Data Capitalism Pro Credit Union</div>
      <div className="just-menu-center">
      </div>
      {/*<div className="just-icon-system"><IconMinimize /></div>*/}
      {/*<div className="just-icon-system"><IconMaximize /></div>*/}
      {/*<div className="just-icon-system"><IconClose /></div>*/}
    </div>
  )
}

export default TopMenuBar