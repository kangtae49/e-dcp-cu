import {observer} from "mobx-react-lite";
import {useEffect} from "react";

const KeyDownListener = observer(() => {
  useEffect(() => {
    const handleKeyDown = (_event: KeyboardEvent) => {
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return null
})

export default KeyDownListener