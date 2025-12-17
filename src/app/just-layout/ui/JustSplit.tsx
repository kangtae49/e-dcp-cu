import {useEffect, useRef, useState} from "react";
import type {
  JustBranch,
  JustSplitDirection,
  JustSplitType,
  JustSplitTypeUnit
} from "@/app/just-layout/justLayoutSlice.ts";
import classNames from "classnames";
import throttle from 'lodash/throttle';
import clamp from "lodash/clamp";

const RESIZE_THROTTLE_MS = 1000 / 30; // 30 fps


export type SplitSize = SplitSizePercentage | SplitSizePiexels;

export interface SplitSizePercentage {
  type: JustSplitTypeUnit,
  size: number,
}

export interface SplitSizePiexels {
  type: JustSplitTypeUnit,
  primary: JustSplitDirection
  size: number
}

interface Props {
  node: JustSplitType
  justBranch: JustBranch
  containerRef: React.RefObject<HTMLDivElement | null>
  onChange?: (splitSize: SplitSize) => void;
  onRelease?: (splitSize: SplitSize) => void;
}

function JustSplit({ node, containerRef, onChange, onRelease }: Props) {
  const refSplit = useRef<HTMLDivElement>(null);
  const [listenersBound, setListenersBound] = useState(false);

  const bindListeners = () => {
    if (!listenersBound) {
      refSplit.current!.ownerDocument!.addEventListener('mousemove', onMouseMove, true);
      refSplit.current!.ownerDocument!.addEventListener('mouseup', onMouseUp, true);
      setListenersBound(true)
    }
  }

  const unbindListeners = () => {
    if (refSplit.current) {
      refSplit.current.ownerDocument!.removeEventListener('mousemove', onMouseMove, true);
      refSplit.current.ownerDocument!.removeEventListener('mouseup', onMouseUp, true);
      setListenersBound(false);
    }
  }
  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    bindListeners();
  };

  const onMouseUp = (event: MouseEvent) => {
    unbindListeners();
    if (containerRef == undefined) return;

    const splitSize = calculateSplitSize(event, node, containerRef)
    if (splitSize !== null){
      onRelease!(splitSize);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (containerRef == undefined) return;
    throttledUpdatePercentage(event, node, containerRef);
  };

  // const calculateRelativePercentage = (event: MouseEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
  //   if (containerRef.current == null) return null;
  //   const rect = containerRef.current.getBoundingClientRect()
  //   const MousePos = direction === 'row' ? event.clientX : event.clientY;
  //   const containerPos = direction === 'row' ? rect.left : rect.top;
  //   const containerSize = direction === 'row' ? rect.width : rect.height;
  //   let percentage = (MousePos - containerPos) * 100 / containerSize;
  //
  //   percentage = clamp(percentage, 0, 100);
  //   return percentage;
  // }

  const calculateSplitSize = (event: MouseEvent, node: JustSplitType, containerRef: React.RefObject<HTMLDivElement | null>): SplitSize | null => {
    if (containerRef.current == null) return null;
    const rect = containerRef.current.getBoundingClientRect()
    const MousePos = node.direction === 'row' ? event.clientX : event.clientY;
    const containerPos = node.direction === 'row' ? rect.left : rect.top;
    const containerSize = node.direction === 'row' ? rect.width : rect.height;
    const firstSize = clamp(MousePos - containerPos, 0, containerSize);
    const secondSize = clamp(containerSize - firstSize, 0, containerSize);
    const percentage = clamp(firstSize * 100 / containerSize, 0, 100);
    if (node.type === 'split-percentage') {
      return {
        type: node.type,
        size: percentage
      }
    } else if (node.type === 'split-pixels') {
      if (node.primary === 'first') {
        return {
          type: 'split-pixels',
          primary: 'first',
          size: firstSize,
        }
      } else {
        return {
          type: 'split-pixels',
          primary: 'second',
          size: secondSize,
        }
      }
    }
    return null

  }

  const throttledUpdatePercentage = throttle((event: MouseEvent, type: JustSplitType, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (containerRef.current == null) return null;
    const splitSize = calculateSplitSize(event, type, containerRef)
    if (splitSize !== null) {
      onChange!(splitSize)
    }
  }, RESIZE_THROTTLE_MS)

  useEffect(() => {

  })

  return (
    <div
      ref={refSplit}
      className={classNames("just-splitter")}
      onMouseDown={onMouseDown}
    />
  )
}

export default JustSplit