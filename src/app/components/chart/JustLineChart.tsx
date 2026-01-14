import "./chart.css"
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {GridData} from "@/app/grid-data/gridData.types.ts";
import {toJS} from "mobx";

export interface LegendItem {
  id: string
  name: string
  color: string
}

interface Props {
  dataKey: string
  xAxisCol: string
  legend: LegendItem[]
}

function JustLineChart({dataKey, legend, xAxisCol}: Props) {
  const gridDataStore = useGridDataStore(GRID_DATA_ID)
  const defaultGridData: GridData = {key: dataKey, header: [], data: []}
  const gridData = gridDataStore.gridDataMap[dataKey] ?? defaultGridData;
  return (
    <LineChart
      key={dataKey}
      className="page-chart"
      responsive
      data={toJS(gridData.data)}
    >
      {legend.map( (l: LegendItem) =>
        <Line key={l.id} dataKey={l.id} name={l.name} stroke={l.color}/>
      )}
      <XAxis dataKey={xAxisCol} />
      <YAxis />
      <Legend />
      <Tooltip />
    </LineChart>
  )
}

export default JustLineChart
