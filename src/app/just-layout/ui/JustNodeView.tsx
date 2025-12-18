import {
  createJustLayoutSlice,
  type JustBranch,
  type JustLayoutActions,
  type JustLayoutState,
  type JustNode, type JustSplitDirection, type JustSplitType,
} from "@/app/just-layout/justLayoutSlice.ts";
import JustWinView from "@/app/just-layout/ui/JustWinView.tsx";
import classNames from "classnames";
import * as React from "react";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks.ts";
import JustSplit, {type SplitSize} from "@/app/just-layout/ui/JustSplit.tsx";
import {type CSSProperties, useRef} from "react";
import {LAYOUT_ID} from "@/utils/layout-util.ts";
import {GetWinInfoFn} from "@/app/just-layout";

interface Props {
  justBranch: JustBranch
  node: JustNode | null
  getWinInfo: GetWinInfoFn
  // viewMap: Record<string, WinInfo>
}

export const JustNodeView: React.FC<Props> = ({ node, justBranch, getWinInfo }) => {
  const refNode = useRef<HTMLDivElement>(null);

  const {
    // state: justLayoutState,
    actions: justLayoutActions
  } = useDynamicSlice<JustLayoutState, JustLayoutActions>(LAYOUT_ID, createJustLayoutSlice)
  const dispatch = useAppDispatch();

  const onResize= ({size}: SplitSize) => {
    dispatch(justLayoutActions.updateResize({ branch: justBranch, size: size }))
  }


  const getStyle = (node: JustSplitType, splitDirection: JustSplitDirection): CSSProperties => {

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
          justStack={node}
          justBranch={justBranch}
          getWinInfo={getWinInfo}
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
              node={node.first}
              justBranch={[...justBranch, "first"]}
              getWinInfo={getWinInfo}
            />
          </div>

          <JustSplit
            node={node}
            justBranch={justBranch}
            containerRef={refNode}
            onChange={onResize}
            onRelease={onResize}
          />

          <div
               className={classNames("just-second", {
                 "just-primary": !(node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first')),
                 "just-secondary": node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first'),
               })}
               style={getStyle(node, 'second')}
          >
            <JustNodeView
              node={node.second}
              justBranch={[...justBranch, "second"]}
              getWinInfo={getWinInfo}
            />
          </div>
        </div>
      )}

    </div>
  )

};