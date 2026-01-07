import "./JustLayoutView.css"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import useOnload from "@/hooks/useOnload.ts";
import JustNodeView from "./JustNodeView.tsx";
import classNames from "classnames";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {JustNode} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";

interface Props {
  layoutId: string
  getWinInfo: GetWinInfoFn
  initialValue: JustNode
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}



const JustLayoutView = observer(({layoutId, getWinInfo, initialValue, closeWin, onClickTitle, onDoubleClickTitle}: Props) => {
  const {onLoad} = useOnload();

  const justLayoutStore = useJustLayoutStore(layoutId)

  onLoad(() => {
    justLayoutStore.setLayout(initialValue)
  })
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(
        "just-layout",
        // "thema-dark"
      )}>
        {justLayoutStore && <JustNodeView
            layoutId={layoutId}
            hideTitle={justLayoutStore.layout?.hideTitle}
            dndAccept={justLayoutStore.layout?.dndAccept ?? []}
            node={justLayoutStore.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
        />}
      </div>
    </DndProvider>
  )
})

export default JustLayoutView
