import './AboutView.css'
import useOnload from "../../hooks/useOnload";
import IconLogo from "../../assets/icon.svg?react"

export default function AboutView() {
  const {onLoad} = useOnload();

  onLoad(() => {
    console.log("onLoad")
  })

  return (
    <div className="about"
         tabIndex={0}>
      <div className="box">
        <div className="logo">
          <IconLogo />
        </div>
        <div className="content">
          <h2>DcpCu v0.1.0</h2>
        </div>
      </div>
    </div>
  )
}
