// import {useState} from "react";
// import {useDynamicSlice} from "@/store/hooks.ts";
// import {type ConfigsActions, type ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";
import ConfigGrid from "@/app/components/grid/ConfigGrid";
import "./ConfigView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import type {WinObjId} from "@/App";
// import classNames from "classnames";

interface Props {
  winObjId: WinObjId
}

function ConfigView({winObjId}: Props) {
  const configKey = winObjId.params?.file;
  const configTitle = winObjId.params?.title;

  // const {
  //   state: configsState,
  // } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  // const [configKey, setConfigKey] = useState<string | null>(null)
  const clickConfigKey = () => {
    console.log(configKey)
    openSetting(configKey)
  }

  const openSetting = (key: string) => {
    window.api.startDataFile(key)
  }

  return (
    <div className="config">
      <div className="config-key">
        <div className="config-title" onClick={clickConfigKey}>
          <Icon icon={faPenToSquare} /> {configTitle}
        </div>
      </div>
      <div className="config-table">
        {configKey && <ConfigGrid configKey={configKey} />}
      </div>
    </div>
  )
}

export default ConfigView;

