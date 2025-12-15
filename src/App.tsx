import {useEffect} from "react";

function App() {
  window.api.echo('Hello').then(console.log)
  window.api.getResourcePath().then(console.log)
  window.api.readDataExcel("data\\xx.xlsx").then(console.log)
  // window.api.startDataFile("data\\xx.xlsx")

  useEffect(() => {

    window.api.onJobEvent((event, jobEvent) => {
      console.log(jobEvent)
    })

    const jobId = `${new Date().getTime()}`
    window.api.startScript(jobId, "hello_world.py", [])

    setTimeout(() => {
      window.api.stopScript(jobId)
    }, 5000)

  }, [])
  // window.api.getResourceSubPath(SCRIPT_DIR).then(console.log)
  // C:\sources\e-dcp-cu
  // C:\Users\kkt\AppData\Local\e_dcp_cu\app-1.0.0\resources\app.asar
  return (
    <div>Hello World</div>
  )
}

export default App
