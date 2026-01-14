import {useEffect} from "react";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import pathUtils from "@/utils/pathUtils.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {observer} from "mobx-react-lite";

const WatchListener = observer((): null => {

  const gridDataStore = useGridDataStore(GRID_DATA_ID)

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
          window.api.readDataExcel(watchFile.key)
            .then((gridData) => {
              if (gridData) {
                gridDataStore.updateGridData(gridData)
              }
            })
        } else if (watchFile.status === 'DELETED') {
          gridDataStore.updateGridData({
            key: watchFile.key,
            header: [],
            data: []
          })
        }
      }


    })
  }, [gridDataStore])
  return null
})

export default WatchListener;
