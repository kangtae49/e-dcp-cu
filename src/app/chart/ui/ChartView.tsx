import "./ChartView.css"
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import JustLineChart, {LegendItem} from "@/app/components/chart/JustLineChart.tsx";

interface Props {
  justId: JustId
}
function ChartView({ justId }: Props) {
  const dataKey = JustUtil.getParamString(justId, 'file');
  const title = JustUtil.getParamString(justId, 'title');
  const xAxisCol = JustUtil.getParamString(justId, 'xAxisCol');
  const legend= JustUtil.getParam<LegendItem []>(justId, 'legend') ?? [];

  const clickTitle = () => {
    console.log(dataKey)
    openSetting(dataKey)
  }

  const openSetting = (key: string) => {
    window.api.startDataFile(key).then()
  }

  return (
    <div className="chart-view">
      <div className="chart-head">
        <div className="chart-title" onClick={clickTitle}>
          <Icon icon={faPenToSquare} /> {title}
        </div>
      </div>
      <div className="chart-container">
        <JustLineChart dataKey={dataKey} legend={legend} xAxisCol={xAxisCol} />
      </div>
    </div>
  )
}

export default ChartView
