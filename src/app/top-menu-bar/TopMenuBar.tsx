import './TopMenuBar.css'
import IconLogo from "../../assets/dcp-cu.svg?react"
// import IconClose from "../../assets/close.svg?react"
// import IconMinimize from "../../assets/minimize.svg?react"
// import IconMaximize from "../../assets/maximize.svg?react"

function TopMenuBar() {
  return (
    <div className="just-top-menu-bar">
      <div className="just-app-icon">
        <IconLogo />
      </div>
      <div className="just-menu-center">

      </div>
      {/*<div className="just-icon-system"><IconMinimize /></div>*/}
      {/*<div className="just-icon-system"><IconMaximize /></div>*/}
      {/*<div className="just-icon-system"><IconClose /></div>*/}
    </div>
  )
}

export default TopMenuBar