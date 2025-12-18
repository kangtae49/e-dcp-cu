import './App.css'

import JustLayoutView from "@/app/just-layout/ui/JustLayoutView.tsx";
import AboutView from "@/app/about/AboutView.tsx";
import type {JustNode} from "@/app/just-layout/justLayoutSlice.ts";

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCircleQuestion} from "@fortawesome/free-solid-svg-icons"
// import TopMenuBar from "@/app/top-menu-bar/TopMenuBar";
import JustToolBar from "@/app/tool-bar/JustToolBar";
import SideMenu from "@/app/side-menu/ui/SideMenu";
import DemoView from "@/app/demo/DemoView";
import Jdenticon from "react-jdenticon";
import JobListener from "@/app/listeners/JobListener";
import WatchListener from "@/app/listeners/WatchListener";
import {useDynamicSlice} from "@/store/hooks";
import {
  CONFIG_ID,
  CONFIG_KEYS,
  type ConfigsActions,
  type ConfigsSlice,
  createConfigsSlice
} from "@/app/config/configsSlice";
import {useEffect} from "react";
import DemoGridView from "@/app/demo/DemoGridView";
import ConfigView from "@/app/config/ui/ConfigView";
import DemoLineChartView from "@/app/demo/DemoLineChartView";
import Page01View from "@/app/page/Page01View";
import {ViewId} from "@/utils/layout-util.ts";
import {GetWinInfoFn, WinInfo, WinObj, WinObjId} from "@/app/just-layout";



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
    const winObjId = WinObj.toWinObjId(winId)
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

CONFIG_KEYS.forEach((winObjId: WinObj) => {

  viewMap[winObjId.viewId] = () => ({
    title: WinObj.getParamString(winObjId, 'title'),
    icon: <Jdenticon size="30" value={"setting-config"} />,
    view: <ConfigView winObjId={winObjId} />
  });
})

const sideMenuId = new WinObj({viewId: 'side-menu'}).toWinId();
const demoGridId = new WinObj({viewId: 'demo-grid'}).toWinId();
const aboutId = new WinObj({viewId: 'about'}).toWinId();

const initialValue: JustNode = {
  type: 'split-pixels',
  direction: 'row',
  primary: 'first',
  size: 200,
  show: true,
  // minSize: 38,
  first: {
    type: 'stack',
    tabs: [sideMenuId],
    active: sideMenuId
  },
  second: {
    type: 'split-percentage',
    direction: 'column',
    size: 50,
    show: true,
    first: {
      type: 'stack',
      tabs: [demoGridId],
      active: demoGridId
    },
    second: {
      type: 'stack',
      tabs: [aboutId],
      active: aboutId
    }
  },
}

function getWinInfo(winId: string): WinInfo {
  const viewId = JSON.parse(winId).viewId as ViewId;
  return viewMap[viewId](winId)
}

function App() {
  const {
    actions: configsActions, dispatch
  } = useDynamicSlice<ConfigsSlice, ConfigsActions>(CONFIG_ID, createConfigsSlice)


  useEffect(() => {
    CONFIG_KEYS.forEach((winObjId: WinObjId) => {
      const file: string = WinObj.getParamString(winObjId, 'file');
      window.api.readDataExcel(file)
        .then(res => {
          dispatch(configsActions.updateConfigs({ configs: {[res.key]: res}}))
        })
    })

  }, [configsActions, dispatch])

  return (
    <>
      <JobListener />
      <WatchListener />
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
