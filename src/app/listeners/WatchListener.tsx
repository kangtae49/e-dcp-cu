import {useEffect} from "react";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import pathUtils from "@/utils/pathUtils.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {observer} from "mobx-react-lite";
import {EXCALIDRAW_DATA_ID} from "@/app/excalidraw-data/excalidrawData.constants.ts";
import {useExcalidrawDataStore} from "@/app/excalidraw-data/useExcalidrawDataStore.ts";
import {ExcalidrawState} from "@/app/excalidraw/excalidraw.types.ts";
import {retryWithBackoff} from "@/utils/asyncUtils.ts";
import {ExcalidrawData} from "@/app/excalidraw-data/excalidrawData.types.ts";

const WatchListener = observer((): null => {

  const gridDataStore = useGridDataStore(GRID_DATA_ID)
  const excalidrawDataStore = useExcalidrawDataStore(EXCALIDRAW_DATA_ID)

  useEffect(() => {

    window.api.onWatchEvent((event, watchEvent) => {
      console.log(watchEvent)
      const watchFile = watchEvent.data;
      const keyName = pathUtils.basename(watchFile.key)
      const isLockFile = keyName.startsWith("~$")
      console.log('keyName:', keyName, isLockFile)
      if (isLockFile) {
        const keyDir = pathUtils.dirname(watchFile.key)
        const orgKeyName = keyName.substring(2)
        const dataKey = pathUtils.join(keyDir, orgKeyName)
        const isLocked = watchFile.status !== 'DELETED'
        console.log('isLocked', dataKey, isLocked)
        gridDataStore.updateIsLocked({key: dataKey, isLocked})
      } else {
        if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
          if (watchFile.key.toLowerCase().endsWith('.excalidraw')) {
            retryWithBackoff<ExcalidrawData | null>(async () => {
              return await window.api.readDataExcalidraw(watchFile.key)
            }, { retries: 2, timeout: 500}).then((data) => {
              if(data) {
                excalidrawDataStore.updateExcalidrawData(data)
              }
            })
            // window.api.readDataExcalidraw(watchFile.key)
            //   .then((data) => {
            //     if (data) {
            //       excalidrawDataStore.updateExcalidrawData(data)
            //     }
            //   })

          } else if (watchFile.key.toLowerCase().endsWith('.xlsx')) {
            window.api.readDataExcel(watchFile.key)
              .then((gridData) => {
                if (gridData) {
                  gridDataStore.updateGridData(gridData)
                }
              })
          }
        } else if (watchFile.status === 'DELETED') {
          if (watchFile.key.toLowerCase().endsWith('.excalidraw')) {
            excalidrawDataStore.updateExcalidrawData({
              key: watchFile.key,
              data: {} as ExcalidrawState
            })
          } else if (watchFile.key.toLowerCase().endsWith('.xlsx')) {
            gridDataStore.updateGridData({
              key: watchFile.key,
              header: [],
              data: []
            })
          }
        }
      }


    })
  }, [gridDataStore, excalidrawDataStore])
  return null
})

export default WatchListener;
