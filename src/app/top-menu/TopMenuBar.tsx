import './TopMenuBar.css'
import IconLogo from "../../assets/icon.svg?react"
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import IconClose from "../../assets/close.svg?react"
import IconMinimize from "../../assets/minimize.svg?react"
import IconMaximize from "../../assets/maximize.svg?react"
import {observer} from "mobx-react-lite";

interface Props {
  justId: JustId
  layoutId: string
}

const TopMenuBar = observer(({justId: _justId, layoutId: _layoutId}: Props) => {
  const minimize = () => {
    window.api.minimize()
  }
  const maximize = async () => {
    console.log("maximize")
    const isFullScreen = await window.api.isFullScreen();
    const isMaximized = await window.api.isMaximized();
    if (isFullScreen) {
      await window.api.setFullScreen(false)
    } else if (isMaximized) {
      window.api.unmaximize()
    } else {
      window.api.maximize()
    }

  }
  const close = () => {
    window.api.close()
  }
  return (
    <div className="just-top-menu-bar">
      <div className="just-app-icon">
        <IconLogo />
      </div>
      <div className="just-title">
        DcpCu - Data Capitalism Pro Credit Union
      </div>
      {/*<div className="just-menu-center">*/}
      {/*</div>*/}
      <div className="just-icon-system-group">
        <div className="just-icon-system" onClick={() => minimize()}><IconMinimize /></div>
        <div className="just-icon-system" onClick={() => maximize()}><IconMaximize /></div>
        <div className="just-icon-system" onClick={() => close()}><IconClose /></div>
      </div>
    </div>
  )
})

export default TopMenuBar