import ConfigGrid from "@/app/components/grid/ConfigGrid.tsx";
import "./ConfigView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";

interface Props {
  justId: JustId
}

function ConfigView({justId}: Props) {

  console.log('ConfigView', justId)
  const dataKey = JustUtil.getParamString(justId, 'file');
  const configTitle = JustUtil.getParamString(justId, 'title');

  const clickConfigKey = () => {
    console.log(dataKey)
    openSetting(dataKey)
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
        <ConfigGrid
          dataKey={dataKey}
        />
      </div>
    </div>
  )
}

export default ConfigView;

