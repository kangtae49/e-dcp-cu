import "@silevis/reactgrid/styles.css";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import ConfigGrid from "@/app/components/grid/ConfigGrid.tsx";
// import {useDynamicSlice} from "@/store/hooks.ts";
// import {ConfigsActions, ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";

function DemoGridView() {
  // const {
  //   state: configsState,
  // } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)
  const configKey = "data\\company.xlsx";

  // const isReady = !!(configsState?.configs && configKey in configsState.configs);

  const clickEdit = () => {
    window.api.startDataFile(configKey)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0}}>
      <div style={{flex: "0 0 25px"}}>
        DemoGridView <Icon icon={faPenToSquare} onClick={() => clickEdit()}/>
      </div>
      <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
        <ConfigGrid configKey={configKey}/>
      </div>
    </div>
  )
}

export default DemoGridView
