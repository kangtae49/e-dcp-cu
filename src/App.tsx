import './App.css'

import JustLayoutView from "@/app/just-layout/ui/JustLayoutView";
import AboutView from "@/app/about/AboutView";
import type {GetWinInfoFn, JustNode, WinInfo} from "@/app/just-layout/justLayoutSlice";

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons"
// import TopMenuBar from "@/app/top-menu-bar/TopMenuBar";
import JustToolBar from "@/app/tool-bar/JustToolBar";
import SideMenu from "@/app/side-menu/ui/SideMenu";
import DemoView from "@/app/demo/DemoView";
import Jdenticon from "react-jdenticon";
import PyJobListener from "@/app/listeners/PyJobListener";
import PyWatchListener from "@/app/listeners/PyWatchListener";
import {useDynamicSlice} from "@/store/hooks";
import {
  CONFIG_ID,
  CONFIG_KEYS,
  type ConfigsActions,
  type ConfigsSlice, type ConfigTable,
  createConfigsSlice
} from "@/app/config/configsSlice";
import {useEffect, useState} from "react";
import DemoGridView from "@/app/demo/DemoGridView";
import ConfigView from "@/app/config/ui/ConfigView";
import DemoLineChartView from "@/app/demo/DemoLineChartView";
import {stableStringify} from "@/utils/json-util";
import Page01View from "@/app/page/Page01View";

export type ViewId = "side-menu"
  | "page01"
  | "demo" | "demo-grid" | "demo-line-chart" | "about" | "setting-config"
export interface WinObjId {
  viewId: ViewId
  params?: Record<string, any>
}

const viewMap = {
  "side-menu": (winId: string) => ({
    title: "Menu",
    icon: <Icon icon={faCircleQuestion} />,
    view: <SideMenu key={winId} />,
    canDrag: false,
    canDrop: false,
    showTitle: false,
    // showClose: false,
  }),
  "page01": (winId: string) => {
    const winObjId = fromWinId(winId)
    return ({
      title: "자산통계정보",
      icon: <Jdenticon size="30" value={winObjId.viewId} />,
      view: <Page01View key={winId} winObjId={winObjId} />
    })
  },
  "demo": (winId: string) => ({
    title: "Demo",
    icon: <Jdenticon size="30" value="demo" />,
    view: <DemoView key={winId} />
  }),
  "demo-grid": (winId: string) => ({
    title: "Demo Grid",
    icon: <Jdenticon size="30" value="demo-grid" />,
    view: <DemoGridView key={winId} />
  }),
  "demo-line-chart": (winId: string) => ({
    title: "Demo Line Chart",
    icon: <Jdenticon size="30" value="demo-line-chart" />,
    view: <DemoLineChartView key={winId} />
  }),
  "about": (winId: string) => ({
    title: "About",
    icon: <Jdenticon size="30" value="about" />,
    view: <AboutView key={winId} />
  }),

  // "setting-config": (winId: string) => {
  //   const winObjId = fromWinId(winId);
  //   return ({
  //     title: winObjId.params?.['title'],
  //     icon: <Jdenticon size="30" value="setting-config" />,
  //     view: <ConfigView winObjId={winObjId} />
  //   })
  // },
} as Record<ViewId, GetWinInfoFn>;

CONFIG_KEYS.forEach((winObjId: WinObjId) => {

  viewMap[winObjId.viewId] = (_winId) => ({
    title: winObjId.params?.['title'],
    icon: <Jdenticon size="30" value={"setting-config"} />,
    view: <ConfigView winObjId={winObjId} />
  });
})


// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.removeWin({ branch: [], winId: "winId01" }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId02", direction: 'column', pos: 'second' }))
// dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId03", direction: 'row', pos: 'first' }))
// dispatch(justLayoutActions.insertWin({ branch: ['second', 'second'], winId: "winId04", direction: 'row', pos: 'stack' }))

const initialValue: JustNode = {
  type: 'split-pixels',
  direction: 'row',
  primary: 'first',
  size: 200,
  show: true,
  // minSize: 38,
  first: {
    type: 'stack',
    tabs: [fromWinObjId({viewId: 'side-menu'})],
    active: fromWinObjId({viewId: 'side-menu'})
  },
  second: {
    type: 'split-percentage',
    direction: 'column',
    size: 50,
    show: true,
    first: {
      type: 'stack',
      tabs: [fromWinObjId({viewId: 'demo-grid'})],
      active: fromWinObjId({viewId: 'demo-grid'})
    },
    second: {
      type: 'stack',
      tabs: [fromWinObjId({viewId: 'about'})],
      active: fromWinObjId({viewId: 'about'})
    }
  },
}

export function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}


export function fromWinObjId(winObjId: WinObjId): string {
  const winId = stableStringify(winObjId)
  if (winId == undefined) throw new Error("buildWinId: stringify error")
  return winId
}

export function fromWinId(winId: string): WinObjId {
  return JSON.parse(winId) as WinObjId
}

function App() {
  const [isPywebviewReady, setIsPywebviewReady] = useState(false);
  const {
    actions: configsActions, dispatch
  } = useDynamicSlice<ConfigsSlice, ConfigsActions>(CONFIG_ID, createConfigsSlice)

  useEffect(() => {

    window.addEventListener("pywebviewready", handleReady);

    return () => {
      window.removeEventListener("pywebviewready", handleReady);
    };
  }, []);

  function handleReady() {
    console.log("pywebview is ready!");
    setIsPywebviewReady(true);
  }

  useEffect(() => {
    if(!isPywebviewReady) return;
    console.log("api", window.pywebview.api)

    CONFIG_KEYS.forEach((winObjId: WinObjId) => {
      const file: string = winObjId.params?.['file'];
      window.pywebview.api.read_data_excel(file)
        .then(res => JSON.parse(res) as ConfigTable)
        .then(res => {
          dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
        })

      // viewMap[winObjId.viewId] = (_winId) => ({
      //   title: winObjId.params?.['title'],
      //   icon: <Jdenticon size="30" value={"setting-config"} />,
      //   view: <ConfigView winObjId={winObjId} />
      // });
    })



    // window.pywebview.api.read_config("설정1.xlsx").then(res => {
    //   dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    // })
    // window.pywebview.api.read_config("설정2.xlsx").then(res => {
    //   dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
    // })
  }, [isPywebviewReady])



  return (
    <>
      <PyJobListener />
      <PyWatchListener />
      <div className="just-app">
        {/*<TopMenuBar />*/}
        <div className="just-container">
          <JustToolBar />
          <JustLayoutView getWinInfo={getWinInfo} initialValue={initialValue} />
        </div>
        {/*<VideoView />*/}
      </div>
    </>
  )
}

export default App

// import {useEffect} from "react";
//
// function App() {
//   window.api.echo('Hello').then(console.log)
//   window.api.getResourcePath().then(console.log)
//   window.api.readDataExcel("data\\xx.xlsx").then(console.log)
//   // window.api.startDataFile("data\\xx.xlsx")
//
//   useEffect(() => {
//
//     window.api.onJobEvent((event, jobEvent) => {
//       console.log(jobEvent)
//     })
//
//     window.api.onWatchEvent((event, watchEvent) => {
//       console.log(watchEvent)
//     })
//
//     const jobId = `${new Date().getTime()}`
//     window.api.startScript(jobId, "hello_world.py", [])
//
//     setTimeout(() => {
//       window.api.stopScript(jobId)
//     }, 5000)
//
//   }, [])
//   // window.api.getResourceSubPath(SCRIPT_DIR).then(console.log)
//   // C:\sources\e-dcp-cu
//   // C:\Users\kkt\AppData\Local\e_dcp_cu\app-1.0.0\resources\app.asar
//   return (
//     <div>Hello World</div>
//   )
// }
//
// export default App
