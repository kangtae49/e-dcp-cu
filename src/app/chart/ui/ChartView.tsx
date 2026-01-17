import "./ChartView.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import JustLineChart, {LegendItem} from "@/app/components/chart/JustLineChart.tsx";
import {observer} from "mobx-react-lite";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";

interface Props {
  justId: JustId
  layoutId: string
}
const ChartView = observer(({ justId }: Props)=> {
  const dataKey = JustUtil.getParamString(justId, 'file')!;
  const title = justId.title;
  const xAxisCol = JustUtil.getParamString(justId, 'xAxisCol')!;
  const legend= JustUtil.getParam<LegendItem []>(justId, 'legend') ?? [];

  const clickTitle = () => {
    openSetting(dataKey)
  }

  const openSetting = (key: string) => {
    window.api.startFile(key).then()
  }

  return (
    <div className="chart-view">
      <div className="chart-head">
        <div className="chart-title">
          <div className="chart-icon" onClick={clickTitle}>
            <Icon icon={faPenToSquare} />
          </div>
          <div  className="chart-label">
            {title}
          </div>
        </div>
      </div>
      <div className="chart-container">
        <JustLineChart dataKey={dataKey} legend={legend} xAxisCol={xAxisCol} />
      </div>
    </div>
  )
})

export default ChartView
