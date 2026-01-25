import './AboutView.css'
import useOnload from "../../hooks/useOnload.ts";
import IconLogo from "../../assets/icon.svg?react"
import {useState} from "react";
import {Versions} from "@/types.ts";
import {observer} from "mobx-react-lite";
import {JustId} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}

const AboutView = observer(({justId: _justId, layoutId: _layoutId}: Props) => {
  const {onLoad} = useOnload();
  const [versions, setVersions] = useState<Versions | null>(null)

  onLoad(() => {
    console.log("onLoad")
    setVersions(window.api.appInfo.versions)

    // window.api.getVersions().then(res => {
    //   setVersions(res)
    // })
  })

  return (
    <div className="about"
         tabIndex={0}>
      <div className="box">
        <div className="logo">
          <IconLogo />
        </div>
        <div className="content">
          <h2>DcpCu v{versions?.app}</h2>
          <div className="versions">
            <div className="ver">Electron: {versions?.electron}</div>
            <div className="ver">Chrome: {versions?.chrome}</div>
            <div className="ver">Node: {versions?.node}</div>
            <div className="ver">V8: {versions?.v8}</div>
            <div className="ver">OS: {versions?.osType} {versions?.osArch} {versions?.osRelease}</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default AboutView

