import "@silevis/reactgrid/styles.css";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import ConfigGrid from "@/app/components/grid/ConfigGrid.tsx";

function DemoGridView() {

  const configKey = "data\\company.xlsx";
  const clickEdit = () => {
    window.api.startDataFile(configKey)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0}}>
      <div style={{flex: "0 0 25px"}}>
        DemoGridView <Icon icon={faPenToSquare} onClick={() => clickEdit()}/>
      </div>
      <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
        <ConfigGrid configKey={configKey} />
      </div>
    </div>
  )
}

export default DemoGridView
