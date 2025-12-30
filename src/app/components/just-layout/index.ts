import React, {JSX} from "react";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";

export const JUST_DRAG_SOURCE = "JUST_DRAG_SOURCE"

export interface WinInfo {
  title: string | GetTitleFn
  icon: JSX.Element
  // view: JSX.Element
  canDrag?: boolean
  canDrop?: boolean
  canDup?: boolean
  showClose?: boolean
  showTitle?: boolean
  getView: GetViewFn
}
// export type GetWinInfoFn = (justId?: JustId) => WinInfo;
export type GetWinInfoFn = (justId: JustId) => WinInfo;
export type GetTitleFn = (justId: JustId) => string;
export type GetViewFn = (justId: JustId) => JSX.Element;
export type CloseWinFn = (justId?: JustId) => void;
export type OnClickTitleFn = (event?: React.MouseEvent, justId?: JustId) => void;
export type OnDoubleClickTitleFn = (event?: React.MouseEvent, justId?: JustId) => void;

