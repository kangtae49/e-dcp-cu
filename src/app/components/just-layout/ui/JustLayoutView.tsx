import "./JustLayoutView.css"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import {
  createJustLayoutSlice,
  type JustLayoutActions,
  type JustLayoutState,
  type JustNode,
} from "../justLayoutSlice.ts";
import useOnload from "@/hooks/useOnload.ts";
import {JustNodeView} from "./JustNodeView.tsx";
import classNames from "classnames";
import {CloseWinFn, GetWinInfoFn, JUST_DRAG_SOURCE, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";

interface Props {
  layoutId: string
  getWinInfo: GetWinInfoFn
  initialValue: JustNode
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}



export function JustLayoutView({layoutId, getWinInfo, initialValue, closeWin, onClickTitle, onDoubleClickTitle}: Props) {
  const {onLoad} = useOnload();
  const {
    state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice)
  const dispatch = useAppDispatch();
  onLoad(() => {
    dispatch(justLayoutActions.setLayout(initialValue))

  })
  // const dndAccept = [JUST_DRAG_SOURCE]
  // const hideTitle: boolean | undefined = undefined
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(
        "just-layout",
        // "thema-dark"
      )}>
        {justLayoutState && <JustNodeView
            layoutId={layoutId}
            hideTitle={justLayoutState.layout?.hideTitle}
            dndAccept={justLayoutState.layout?.dndAccept ?? []}
            node={justLayoutState.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
            onClickTitle={onClickTitle}
            onDoubleClickTitle={onDoubleClickTitle}
        />}
      </div>
    </DndProvider>
  )
}

export default JustLayoutView
