import {useDynamicSlice} from "@/store/hooks.ts";
import {ConfigsActions, ConfigsState, createConfigsSlice} from "@/app/config/configsSlice.ts";

function useConfigs(configId: string) {
  const {
    state,
    actions: configsActions,
    dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(configId, createConfigsSlice)

  const updateConfigs = (configs: Record<string, any>) => {
    dispatch(
      configsActions.updateConfigs({
        configs
      })
    )
  }

  return {
    state,
    updateConfigs
  }
}

export default useConfigs