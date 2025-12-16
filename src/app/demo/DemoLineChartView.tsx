import {Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import "@/app/components/chart/chart.css"
function DemoLineChartView() {
  const data = [
    {
      name: 'Page A',
      uv: 400,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 300,
      pv: 4567,
      amt: 2400,
    },
    {
      name: 'Page C',
      uv: 320,
      pv: 1398,
      amt: 2400,
    },
    {
      name: 'Page D',
      uv: 200,
      pv: 9800,
      amt: 2400,
    },
    {
      name: 'Page E',
      uv: 278,
      pv: 3908,
      amt: 2400,
    },
    {
      name: 'Page F',
      uv: 189,
      pv: 4800,
      amt: 2400,
    },
  ];
  return (
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0, padding: "5px", boxSizing: "border-box"}}>
      <div style={{flex: "0 0 25px"}}>LineChart</div>
      <div style={{flex: 1, minHeight: 0}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
            responsive
            data={data}
          >
            <Line dataKey="uv" />
            <XAxis dataKey="name" />
            <YAxis />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DemoLineChartView;

