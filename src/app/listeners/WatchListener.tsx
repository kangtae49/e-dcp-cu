import {useEffect} from "react";
import {
  GRID_DATA_ID,
} from "@/app/grid/gridDataSlice.ts";
import useGridData from "@/app/grid/useGridData.ts";
import pathUtils from "@/utils/pathUtils.ts";

function WatchListener(): null {

  const {
    state: gridDataState,
    updateGridData,
    updateIsLocked
  } = useGridData(GRID_DATA_ID)

  useEffect(() => {
    if (!gridDataState) {
      return;
    }

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
        updateIsLocked(dataKey, isLocked)
      } else {
        if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
          window.api.readDataExcel(watchFile.key)
            .then((gridData) => {
              if (gridData) {
                updateGridData(gridData)
              }
            })
        } else if (watchFile.status === 'DELETED') {
          updateGridData({
            key: watchFile.key,
            header: [],
            data: []
          })
        }
      }


    })
  }, [gridDataState])
  return null
}

export default WatchListener;
