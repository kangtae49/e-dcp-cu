import type {ConfigTable} from "@/app/config/configsSlice";

function DemoView() {
  const startScript = () => {
    window.pywebview.api.start_script("job_id_01", "hello_world.py", ["한글 스페이스", "두번째 음냐"])
      .then(() => {
        console.log("done")
      })
  }
  const stopScript = () => {
    window.pywebview.api.stop_script("job_id_01")
      .then(() => {
        console.log("done")
      })
  }

  const openSetting = () => {
    window.pywebview.api.start_data_file('data\\설정1.xlsx')
  }

  const readConfig = () => {
    window.pywebview.api.read_data_excel('data\\설정1.xlsx')
      .then(res => JSON.parse(res) as ConfigTable)
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
