import "./JustStatusBar.css"
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";

interface Props {
  justId: JustId
}
function JustStatusBar({justId}: Props) {
  return (
    <div className="just-status-bar"></div>
  )
}

export default JustStatusBar
