import JustWinView from "./JustWinView.tsx";
import classNames from "classnames";
import * as React from "react";
import JustSplitter, {type SplitSize} from "./JustSplitter.tsx";
import {Activity, type CSSProperties, useEffect, useRef} from "react";
import {CloseWinFn, GetWinInfoFn, OnClickTitleFn, OnDoubleClickTitleFn} from "../index.ts";
import {JustBranch, JustNode, JustSplit, JustSplitDirection} from "@/app/components/just-layout/justLayout.types.ts";
import {useJustLayoutStore} from "@/app/components/just-layout/useJustLayoutStore.ts";
import {observer} from "mobx-react-lite";
import {isEqual} from "lodash";

interface Props {
  layoutId: string
  isFullScreenView: boolean
  justBranch: JustBranch
  node: JustNode | null
  getWinInfo: GetWinInfoFn
  hideTitle?: boolean
  dndAccept: string[]
  closeWin?: CloseWinFn
  onClickTitle?: OnClickTitleFn
  onDoubleClickTitle?: OnDoubleClickTitleFn
}

const JustNodeView: React.FC<Props> = observer(({ layoutId, isFullScreenView, hideTitle, dndAccept, node, justBranch, getWinInfo, closeWin, onClickTitle, onDoubleClickTitle }) => {
  const refNode = useRef<HTMLDivElement>(null);

  const justLayoutStore = useJustLayoutStore(layoutId)

  const onResize= ({size}: SplitSize) => {
    justLayoutStore.updateResize({ branch: justBranch, size: size })
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
    <div ref={refNode}
      className={classNames(
        "just-node",
        )
      }
    >
      {node?.type === 'stack' && (
        <JustWinView
          hideTitle={node.hideTitle ?? hideTitle}
          layoutId={layoutId}
          isFullScreenView={isFullScreenView}
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
          <Activity mode={node.type==='split-pixels' && node.primary === 'first' && node.primaryHide === true ? 'hidden' : 'visible'}>
          <div
            className={classNames("just-first", {
              "just-primary": node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first'),
              "just-secondary": !(node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first')),
            })}
            style={getStyle(node, 'first')}
          >
              <JustNodeView
                layoutId={layoutId}
                isFullScreenView={isFullScreenView}
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
          </Activity>
          {
            !(node.type === 'split-pixels' && (node.noSplitter === true || node.primaryHide === true))
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
          <Activity mode={node.type==='split-pixels' && node.primary === 'second' && node.primaryHide === true ? 'hidden' : 'visible'}>
          <div
               className={classNames("just-second", {
                 "just-primary": !(node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first')),
                 "just-secondary": node.type === "split-percentage" || (node.type === 'split-pixels' && node.primary === 'first'),
               })}
               style={getStyle(node, 'second')}
          >
              <JustNodeView
                layoutId={layoutId}
                isFullScreenView={isFullScreenView}
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
          </Activity>
        </div>
      )}

    </div>
  )

})

export default JustNodeView