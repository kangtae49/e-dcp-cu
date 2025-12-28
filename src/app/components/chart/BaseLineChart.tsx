import "./chart.css"
import useGridData from "@/app/grid/useGridData.ts";
import {GRID_DATA_ID} from "@/app/grid/gridDataSlice.ts";
import {GridData} from "@/types.ts";
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

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

function BaseLineChart({dataKey, legend, xAxisCol}: Props) {
  const {state: gridDataState} = useGridData(GRID_DATA_ID)
  const defaultGridData: GridData = {key: dataKey, header: [], data: []}
  const gridData = gridDataState?.gridDataMap[dataKey] ?? defaultGridData;
  console.log('BaseLineChart:', dataKey, legend, xAxisCol)
  return (
    <LineChart
      key={dataKey}
      className="page-chart"
      responsive
      data={gridData.data}
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

export default BaseLineChart
