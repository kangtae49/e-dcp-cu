import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {useAppStore} from "@/app/listeners/useAppStore.ts";
import {APP_STORE_ID} from "@/app/listeners/app.constants.ts";

const AppListener = observer(() => {
  const appStore = useAppStore(APP_STORE_ID)
  useEffect(() => {
    window.api.onChangeFullScreen((_event, flag) => {
      // console.log('flag:', flag)
      appStore.changeFullScreen(flag)
      // window.api.isFullScreen().then(result => {
      //   console.log('isFullScreen:', result)
      // })
    })
  }, [])
  return null
});

export default AppListener;