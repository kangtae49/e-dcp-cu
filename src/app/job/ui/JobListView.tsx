import "./JobListView.css"
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import IconMinimize from "@/assets/minimize.svg?react"
import {BOTTOM_PANEL_NODE_NAME, LAYOUT_ID} from "@/app/layout/layout.tsx";
import useJustLayout from "@/app/components/just-layout/useJustLayout.ts";
interface Props {
  justId: JustId
}
function JobListView({justId}: Props) {
  console.log(justId)
  const {
    toggleWin,
  } = useJustLayout(LAYOUT_ID)

  const toggleView = () => {
    toggleWin(BOTTOM_PANEL_NODE_NAME)
  }
  return (
    <div className="job-list-view">
      <div className="job-list-title">
        <div className="job-list-name">Job List</div>
        <div className="icon-minimize" onClick={toggleView}>
          <IconMinimize />
        </div>
      </div>
      <div className="job-list-content">

      </div>
    </div>
  )
}

export default JobListView
