import "./chart.css"
import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useDynamicSlice} from "@/store/hooks";
import {
  CONFIG_ID,
  type ConfigsActions,
  type ConfigsState,
  createConfigsSlice
} from "@/app/config/configsSlice";
import {useEffect, useState} from "react";
import {ConfigTable} from "@/types";

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
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)
  const defaultConfigTable: ConfigTable = {key: outFile, header: [], data: []}

  const [configTable, setConfigTable] = useState<ConfigTable>(defaultConfigTable);

  useEffect(() => {
    if (configsState === undefined) return;
    setConfigTable(configsState.configs[outFile] ?? defaultConfigTable)
  }, [configsState, outFile])

  useEffect(() => {
    console.log('configTable:', configTable)
  }, [configTable]);

  // const getData(data: Record<string, string | number | null>, id: string) = {
  //   return data.map(d => ({
  //
  //   }))
  // }

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
