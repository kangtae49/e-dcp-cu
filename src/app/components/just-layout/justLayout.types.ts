import {CounterStore} from "@/app/counter/counter.store.ts";
import {JustLayoutStore} from "@/app/components/just-layout/justLayout.store.ts";

export type JustDirection = 'row' | 'column';
export type JustSplitDirection = 'first' | 'second';
export type JustSplitType = 'split-percentage' | 'split-pixels';
export type JustType = 'stack' | JustSplitType;

type JSONPrimitive = string | number | boolean | null | undefined;
export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | { [key: string]: JSONValue }
export type JSONObject = { [key: string]: JSONValue };

export interface JustId extends JSONObject {
  title: string
  viewId: string
  dupId?: string
  params?: Record<string, JSONValue>
}

export type JustNode = JustStack | JustSplit

export type JustBranch = JustSplitDirection []


export interface JustNodeBase {
  type: JustType
  name?: string
  dndAccept?: string[]
  hideTitle?: boolean
}

export interface JustStack extends JustNodeBase {
  type: 'stack'
  tabs: JustId[]
  active: JustId | null
}

export type JustSplit = JustSplitPercentage | JustSplitPixels;


export interface JustSplitBase extends JustNodeBase {
  type: JustSplitType
  direction: JustDirection
  first: JustNode
  second: JustNode
  size: number
  minSize?: number
}

export interface JustSplitPercentage extends JustSplitBase {
  type: 'split-percentage'
}

export interface JustSplitPixels extends JustSplitBase {
  type: 'split-pixels'
  primary: JustSplitDirection
  primaryDefaultSize: number
  noSplitter?: boolean
}

export type JustPos = JustSplitDirection | 'stack'


export type JustLayoutFactory = (id: string) => JustLayoutStore;

export const JUST_LAYOUT_TYPES = {
  JustLayoutService: Symbol.for("JustLayoutService"),
  JustLayoutStore: Symbol.for("JustLayoutStore"),
  JustLayoutFactory: Symbol.for("JustLayoutFactory"),
};


