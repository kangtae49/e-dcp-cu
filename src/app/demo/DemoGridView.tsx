import "@silevis/reactgrid/styles.css";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import JustGrid from "@/app/components/grid/JustGrid.tsx";

function DemoGridView() {
  const dataKey = "data\\company.xlsx";


  const clickEdit = () => {
    window.api.startDataFile(dataKey)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0}}>
      <div style={{flex: "0 0 25px"}}>
        DemoGridView <Icon icon={faPenToSquare} onClick={() => clickEdit()}/>
      </div>
      <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
        <JustGrid dataKey={dataKey} />
      </div>
    </div>
  )
}

export default DemoGridView
