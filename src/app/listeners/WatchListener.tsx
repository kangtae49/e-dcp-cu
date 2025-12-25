import {useEffect} from "react";
import {
  CONFIG_ID,
} from "@/app/config/configsSlice.ts";
import useConfigs from "@/app/config/useConfigs.ts";
// import {format} from "date-fns";

function WatchListener(): null {

  const {
    state: configsState,
    updateConfigs,
  } = useConfigs(CONFIG_ID)

  useEffect(() => {
    if (!configsState || !configsState.keys) {
      return;
    }

    window.api.onWatchEvent((event, watchEvent) => {
      console.log(watchEvent)
      const watchFile = watchEvent.data;
      console.log(watchFile)
      if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
        console.log('!!!!!!!!!!!!!')
        setTimeout(() => {
          window.api.readDataExcel(watchFile.key)
            .then((configTable) => {
              updateConfigs({
                [watchFile.key]: configTable
              })
            })
        }, 100)
      } else if (watchFile.status === 'DELETED') {
        updateConfigs({
          [watchFile.key]: {
            key: watchFile.key,
            header: [],
            data: []
          }
        })
      }

    })
  }, [configsState])
  return null
}

export default WatchListener;
