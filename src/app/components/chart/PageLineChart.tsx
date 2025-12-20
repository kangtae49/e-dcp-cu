import "./chart.css"
import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {
  CONFIG_ID,
} from "@/app/config/configsSlice.ts";
import {ConfigTable} from "@/types.ts";
import useConfigs from "@/app/config/useConfigs.ts";

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

  const {state: configsState} = useConfigs(CONFIG_ID)

  const defaultConfigTable: ConfigTable = {key: outFile, header: [], data: []}

  const configTable = configsState?.configs[outFile] ?? defaultConfigTable;

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
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0, padding: "5px", boxSizing: "border-box"}}>
      <div style={{flex: "0 0 25px"}}>{title}</div>
      <div style={{flex: 1, minHeight: 0}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
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
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PageLineChart
