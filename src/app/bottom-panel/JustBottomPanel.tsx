import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {observer} from "mobx-react-lite";

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