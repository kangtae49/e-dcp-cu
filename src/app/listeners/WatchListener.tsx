import {useEffect} from "react";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  CONFIG_ID,
  ConfigsActions,
  ConfigsState,
  createConfigsSlice
} from "@/app/config/configsSlice.ts";

function WatchListener(): null {
  const {
    state: configsState,
    actions: configsActions,
    dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)

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
            .then((res) => {
              dispatch(
                configsActions.updateConfigs({
                  configs: {
                    [watchFile.key]: res
                  }
                })
              )
            })
        }, 100)
      } else if (watchFile.status === 'DELETED') {
        dispatch(
          configsActions.updateConfigs({
            configs: {
              [watchFile.key]: {
                key: watchFile.key,
                header: [],
                data: []
              }
            }
          })
        )
      }

    })
  }, [configsState, dispatch])
  return null
}

export default WatchListener;
