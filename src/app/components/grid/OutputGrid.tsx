import "./OutputGrid.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import JustGrid from "@/app/components/grid/JustGrid.tsx";

interface Props {
  outFile: string
  title: string
}

function OutputGrid({outFile, title}: Props) {
  const openGrid = (filePath: string) => {
    window.api.startDataFile(filePath)
  }

  return (
    <div className="output-grid">
      <div className="output-grid-title">
        <div className="output-grid-label" onClick={()=> openGrid(outFile)}>
          <Icon icon={faPenToSquare} /> {title}
        </div>
      </div>
      <div className="output-grid-table">
        <JustGrid key={outFile} dataKey={outFile} />
      </div>
    </div>
  )
}

export default OutputGrid

