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
import {JustNodeView} from "@/app/just-layout/ui/JustNodeView.tsx";
import classNames from "classnames";
import {LAYOUT_ID} from "@/utils/layout-util.tsx";
import {CloseWinFn, GetWinInfoFn} from "@/app/just-layout";

interface Props {
  // viewMap: Record<string, WinInfo>
  getWinInfo: GetWinInfoFn
  closeWin?: CloseWinFn
  initialValue: JustNode
}



export function JustLayoutView({getWinInfo, closeWin, initialValue}: Props) {
  const {onLoad} = useOnload();
  const {
    state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)
  const dispatch = useAppDispatch();
  onLoad(() => {
    dispatch(justLayoutActions.setLayout(initialValue))

    // dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
    // dispatch(justLayoutActions.removeWin({ branch: [], winId: "winId01" }))
    // dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId01", direction: 'row', pos: 'first' }))
    // dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId02", direction: 'column', pos: 'second' }))
    // dispatch(justLayoutActions.insertWin({ branch: [], winId: "winId03", direction: 'row', pos: 'first' }))
    // dispatch(justLayoutActions.insertWin({ branch: ['second', 'second'], winId: "winId04", direction: 'row', pos: 'stack' }))

  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(
        "just-layout",
        // "thema-dark"
      )}>
        {justLayoutState && <JustNodeView
            node={justLayoutState.layout}
            justBranch={[]}
            getWinInfo={getWinInfo}
            closeWin={closeWin}
        />}
      </div>
    </DndProvider>
  )
}

export default JustLayoutView
