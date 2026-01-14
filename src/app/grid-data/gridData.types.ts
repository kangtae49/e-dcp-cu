import {GridDataStore} from "@/app/grid-data/gridData.store.ts";

export interface GridData {
  key: string,
  timestamp?: number,
  isLocked?: boolean,
  header: string [],
  data: Record<string, string | number | boolean | null> []
}

export type GridDataMap = Record<string, GridData>

export type GridDataFactory = (id: string) => GridDataStore;

export const GRID_DATA_TYPES = {
  GridDataService: Symbol("GridDataService"),
  GridDataStore: Symbol("GridDataStore"),
  GridDataFactory: Symbol("GridDataFactory"),
}
