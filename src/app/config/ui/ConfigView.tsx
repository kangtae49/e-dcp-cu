import ConfigGrid from "@/app/components/grid/ConfigGrid.tsx";
import "./ConfigView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {WinObj, WinObjId} from "@/app/components/just-layout";

interface Props {
  winObjId: WinObjId
}

function ConfigView({winObjId}: Props) {

  const configKey = WinObj.getParamString(winObjId, 'file');
  const configTitle = WinObj.getParamString(winObjId, 'title');
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
        <ConfigGrid configKey={configKey} />
      </div>
    </div>
  )
}

export default ConfigView;

