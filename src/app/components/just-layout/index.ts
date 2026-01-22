import React, {JSX} from "react";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";


export interface WinInfo {
  getTabTitle: GetTabTitleFn
  getIcon: GetIconFn
  getView: GetViewFn
  canDup?: boolean
  showClose?: boolean
  canFullScreen?: boolean
}
export type GetWinInfoFn = (justId: JustId) => WinInfo;
export type GetTabTitleFn = (justId: JustId, layoutId: string) => JSX.Element;
export type GetViewFn = (justId: JustId, layoutId: string) => JSX.Element;
export type GetIconFn = (justId: JustId, layoutId: string) => JSX.Element;
export type CloseWinFn = (justId: JustId, layoutId: string) => void;
export type OnClickTitleFn = (event: React.MouseEvent, justId: JustId) => void;
export type OnDoubleClickTitleFn = (event: React.MouseEvent, justId: JustId) => void;

