
function DemoView() {
  const startScript = () => {
    window.api.startScript("job_id_01", "hello_world.py", ["한글 스페이스", "두번째 음냐"])
      .then(() => {
        console.log("done")
      })
  }
  const stopScript = () => {
    window.api.stopScript("job_id_01")
      .then(() => {
        console.log("done")
      })
  }

  const openSetting = () => {
    window.api.startDataFile('data\\설정1.xlsx')
  }

  const readConfig = () => {
    window.api.readDataExcel('data\\설정1.xlsx')
    .then(res => {
      console.log(res)
    })
  }

  return (
    <div className="demo">
      <div>Demo</div>
      <div onClick={() => startScript()}>
        Start Job
      </div>
      <div onClick={() => stopScript()}>
        Stop Job
      </div>

      <div onClick={() => openSetting()}>
        Open Setting
      </div>

      <div onClick={() => readConfig()}>
        read Config
      </div>

    </div>
  )
}

export default DemoView
