import "./chart.css"
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {GridData} from "@/app/grid-data/gridData.types.ts";

interface DataKey {
  id: string
  name: string
  color: string
}

interface Props {
  title: string
  outFile: string
  legend: DataKey[]
}

function PageLineChart({title, outFile, legend}: Props) {

  const gridDataStore = useGridDataStore(GRID_DATA_ID)

  const defaultConfigTable: GridData = {path: outFile, header: [], data: []}

  const configTable = gridDataStore.gridDataMap[outFile] ?? defaultConfigTable;

  // const data = [
  //   {
  //     name: 'Page A',
  //     uv: 400,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page B',
  //     uv: 300,
  //     pv: 4567,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page C',
  //     uv: 320,
  //     pv: 1398,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page D',
  //     uv: 200,
  //     pv: 9800,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page E',
  //     uv: 278,
  //     pv: 3908,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page F',
  //     uv: 189,
  //     pv: 4800,
  //     amt: 2400,
  //   },
  // ];
  return (
    <div className="page-chart">
      <div className="chart-title">{title}</div>
      <div className="chart-body">
        <LineChart
          key={outFile}
          className="page-chart"
          responsive
          data={configTable.data}
        >
          {legend.map(l =>
            <Line key={l.id} dataKey={l.id} name={l.name} stroke={l.color}/>
          )}
          <XAxis dataKey="stdrYm" />
          <YAxis />
          <Legend />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  )
}

export default PageLineChart
