import {observer} from "mobx-react-lite";
import {JustId} from "@kangtae49/just-layout";

interface Props {
  justId: JustId
  layoutId: string
}

const JustBottomPanel = observer(({justId: _justId, layoutId: _layoutId}: Props) => {
  return (
    <div></div>
  )
})

export default JustBottomPanel