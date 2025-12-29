import JustGrid from "@/app/components/grid/JustGrid.tsx";
import "./GridView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";

interface Props {
  justId: JustId
}

function GridView({justId}: Props) {

  const dataKey = JustUtil.getParamString(justId, 'file');
  const title = JustUtil.getParamString(justId, 'title');

  const clickTitle = () => {
    console.log(dataKey)
    openSetting(dataKey)
  }

  const openSetting = (key: string) => {
    window.api.startDataFile(key).then()
  }

  return (
    <div className="grid-view">
      <div className="grid-head">
        <div className="grid-title" onClick={clickTitle}>
          <Icon icon={faPenToSquare} /> {title}
        </div>
      </div>
      <div className="grid-container">
        <JustGrid
          dataKey={dataKey}
        />
      </div>
    </div>
  )
}

export default GridView;

