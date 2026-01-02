import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustNode, type JustSplitDirection, type JustSplit,
} from "../justLayoutSlice.ts";
import JustWinView from "./JustWinView.tsx";
import classNames from "classnames";
import * as React from "react";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import JustSplitter, {type SplitSize} from "./JustSplitter.tsx";
import {type CSSProperties, useRef} from "react";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";

interface Props {
  layoutId: string
  justBranch: JustBranch
  node: JustNode | null
  getWinInfo: GetWinInfoFn
  hideTitle?: boolean
  dndAccept: string[]
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
  // viewMap: Record<string, WinInfo>
}

export const JustNodeView: React.FC<Props> = ({ layoutId, hideTitle, dndAccept, node, justBranch, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle }) => {
  const refNode = useRef<HTMLDivElement>(null);

  const {
    // state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(layoutId, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const onResize= ({size}: SplitSize) => {
    dispatch(justLayoutActions.updateResize({ branch: justBranch, size: size }))
  }


  const getStyle = (node: JustSplit, splitDirection: JustSplitDirection): CSSProperties => {

    if (node.type === "split-percentage" && splitDirection === 'first') {
      return {
        flexBasis: `calc(${node.size}% - 3px)`,
        [node.direction === 'row' ? 'minWidth' : 'minHeight']: `${node.minSize ?? 0}%`
      }
    } else if (node.type === "split-pixels" && splitDirection === node.primary) {
      return {
        flexBasis: `${node.size}px`,
        [node.direction === 'row' ? 'minWidth' : 'minHeight']: `${node.minSize ?? 0}px`
      }
    }
    return {}
  }

  return (
    <div className="just-node" ref={refNode}>
      {node?.type === 'stack' && (
        <JustWinView
          hideTitle={node.hideTitle ?? hideTitle}
          layoutId={layoutId}
          dndAccept={node.dndAccept ?? dndAccept}
          justStack={node}
          justBranch={justBranch}
          getWinInfo={getWinInfo}
          closeWin={closeWin}
          onClickTitle={onClickTitle}
          onDoubleClickTitle={onDoubleClickTitle}
        />
      )}
      {(node?.type === 'split-percentage' || node?.type === 'split-pixels') && (
        <div key={`JustNode-${justBranch.join(",")}`}
             className={classNames(
               node.type,
               {
                 "just-column": node.direction === 'column',
                 "just-row": node.direction === 'row'
               }
             )}>
          <div
            className={classNames("just-first", {
              "just-primary": node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first'),
              "just-secondary": !(node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first')),
            })}
            style={getStyle(node, 'first')}
          >
            <JustNodeView
              layoutId={layoutId}
              hideTitle={node.hideTitle ?? hideTitle}
              dndAccept={node.dndAccept ?? dndAccept}
              node={node.first}
              justBranch={[...justBranch, "first"]}
              getWinInfo={getWinInfo}
              closeWin={closeWin}
              onClickTitle={onClickTitle}
              onDoubleClickTitle={onDoubleClickTitle}
            />
          </div>
          {
            !(node.type === 'split-pixels' && node.noSplitter === true)
            &&
            <JustSplitter
              layoutId={layoutId}
              node={node}
              justBranch={justBranch}
              containerRef={refNode}
              onChange={onResize}
              onRelease={onResize}
            />
          }
          <div
               className={classNames("just-second", {
                 "just-primary": !(node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first')),
                 "just-secondary": node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first'),
               })}
               style={getStyle(node, 'second')}
          >
            <JustNodeView
              layoutId={layoutId}
              hideTitle={node.hideTitle ?? hideTitle}
              dndAccept={node.dndAccept ?? dndAccept}
              node={node.second}
              justBranch={[...justBranch, "second"]}
              getWinInfo={getWinInfo}
              closeWin={closeWin}
              onClickTitle={onClickTitle}
              onDoubleClickTitle={onDoubleClickTitle}
            />
          </div>
        </div>
      )}

    </div>
  )

};