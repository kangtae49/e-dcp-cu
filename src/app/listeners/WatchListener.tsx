import {useEffect} from "react";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {observer} from "mobx-react-lite";
import {EXCALIDRAW_DATA_ID} from "@/app/excalidraw-data/excalidrawData.constants.ts";
import {useExcalidrawDataStore} from "@/app/excalidraw-data/useExcalidrawDataStore.ts";
import {ExcalidrawState} from "@/app/excalidraw/excalidraw.types.ts";
// import {retryWithBackoff} from "@/utils/asyncUtils.ts";
// import {ExcalidrawData} from "@/app/excalidraw-data/excalidrawData.types.ts";

const WatchListener = observer((): null => {

  const gridDataStore = useGridDataStore(GRID_DATA_ID)
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  useEffect(() => {

    window.api.onWatchEvent((event, watchEvent) => {
      console.log(watchEvent)
      const watchFile = watchEvent.data;
      // const keyName = pathUtils.basename(watchFile.path)
      // const isLockFile = keyName.startsWith("~$")
      // console.log('keyName:', keyName, isLockFile)
      // if (isLockFile) {
      //   const keyDir = pathUtils.dirname(watchFile.key)
      //   const orgKeyName = keyName.substring(2)
      //   const dataKey = pathUtils.join(keyDir, orgKeyName)
      //   const isLocked = watchFile.status !== 'DELETED'
      //   console.log('isLocked', dataKey, isLocked)
      //   gridDataStore.updateIsLocked({key: dataKey, isLocked})
      // } else {
        if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
          if (watchFile.path.toLowerCase().endsWith('.excalidraw')) {
            window.api.readExcalidraw(watchFile.path).then((data) => {
              console.log('readExcalidraw', data)
              if (data) {
                excalidrawDataStore.updateExcalidrawData(data)
              }
            })
            // retryWithBackoff<ExcalidrawData | null>(async () => {
            //   return await window.api.readExcalidraw(watchFile.path)
            // }, { retries: 2, timeout: 500}).then((data) => {
            //   console.log('readExcalidraw', data)
            //   if (data) {
            //     excalidrawDataStore.updateExcalidrawData(data)
            //   }
            // })
            // window.api.readDataExcalidraw(watchFile.key)
            //   .then((data) => {
            //     if (data) {
            //       excalidrawDataStore.updateExcalidrawData(data)
            //     }
            //   })

          } else if (watchFile.path.toLowerCase().endsWith('.xlsx')) {
            window.api.readExcel(watchFile.path)
              .then((gridData) => {
                if (gridData) {
                  gridDataStore.updateGridData(gridData)
                }
              })
          }
        } else if (watchFile.status === 'DELETED') {
          if (watchFile.path.toLowerCase().endsWith('.excalidraw')) {
            excalidrawDataStore.updateExcalidrawData({
              path: watchFile.path,
              data: {} as ExcalidrawState
            })
          } else if (watchFile.path.toLowerCase().endsWith('.xlsx')) {
            gridDataStore.updateGridData({
              path: watchFile.path,
              header: [],
              data: []
            })
          }
        }
      // }


    })
  }, [gridDataStore, excalidrawDataStore])
  return null
})

export default WatchListener;
