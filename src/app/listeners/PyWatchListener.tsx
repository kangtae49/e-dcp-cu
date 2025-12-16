import {useEffect} from "react";
import type {PyWatchEvent} from "@/types/models";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  type ConfigsState,
  type ConfigsActions,
  createConfigsSlice, CONFIG_ID, type ConfigTable,
} from "@/app/config/configsSlice.ts";


function PyWatchListener() {
  const {
    state: configsState,
    actions: configsActions,
    dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)

  useEffect(() => {

    if (!configsState || !configsState.keys) {
      return;
    }
    console.log('configsState:', configsState)
    const keys = configsState.keys;
    if (!keys) return;
    const handler = (e: CustomEvent<PyWatchEvent>) => {
      const pyWatchEvent = e.detail;
      const watchFile = pyWatchEvent.data;
      console.log(watchFile)
      // const files = keys.map(k => k.params?.['file'])
      // if (!files?.includes(watchFile.key)) return;

      if (watchFile.status === 'CREATED' || watchFile.status === 'MODIFIED') {
        console.log('!!!!!!!!!!!!!')
        setTimeout(() => {
          window.pywebview.api.read_data_excel(watchFile.key)
            .then(res => JSON.parse(res) as ConfigTable)
            .then(res => {
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
    }
    window.addEventListener("py-watch-event", handler as EventListener);
    return () => {
      window.removeEventListener("py-watch-event", handler as EventListener);
    }

  }, [configsState, dispatch])
  return null;
}

export default PyWatchListener
