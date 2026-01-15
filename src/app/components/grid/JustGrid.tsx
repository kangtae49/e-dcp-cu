import "./grid.css"
import "@silevis/reactgrid/styles.css";
import {useEffect, useRef, useState} from "react";
import {type Column, type DefaultCellTypes, type Id, ReactGrid, type Row} from "@silevis/reactgrid";
import throttle from "lodash/throttle";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {GridData} from "@/app/grid-data/gridData.types.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";

interface Props {
  dataKey: string
}

const getColumns = (header: string[], columnSize: Record<string, number>): Column[] => {
  if (!header) {
    return [
      {columnId: " ", width: 50, resizable: true,},
    ]
  }
  return [
    {columnId: " ", width: 50, resizable: true,},
    ...header.map(h => ({columnId: h, width: columnSize?.[h] ?? 150, resizable: true,})),
  ]
}

const getTableHeader = (header: string []): Row => {
  if (!header) {
    return {rowId: "header", cells: [{ type: "number", value: 1 }]}
  }
  return {
    rowId: "header",
    cells: [
      { type: "number", value: 1 },
      ...header.map<DefaultCellTypes>(h => ({ type: "header", text: h }))
    ]
  }
}



const getTableBody = (table: GridData): Row [] => {
  if (!table.data) {
    return []
  }
  return table.data.map<Row>((row: any, idx: number) => ({
    rowId: idx,
    cells: [
      { type: "number", value: idx+2, nonEditable: true},
      ...table.header.map<DefaultCellTypes>((h: any) => {
        if (row[h] === null || typeof row[h] === 'string') {
          return ({type: "text", text: row[h] ?? '', nonEditable: true})
        } else {
          return ({type: "number", value: row[h], nonEditable: true})
        }
      })
    ]
  }))
}

const getTableRows = (table: GridData): Row[] => {
  return [
    getTableHeader(table.header),
    ...getTableBody(table)
  ]
}


function JustGrid({dataKey}: Props) {

  const gridDataStore = useGridDataStore(GRID_DATA_ID)
  const [columnsSize, setColumnsSize] = useState({});

  const ref = useRef<ReactGrid>(null)


  const defaultConfigTable: GridData = {path: dataKey, header: [], data: []}





  useEffect(() => {
    ref?.current?.forceUpdate();
  }, [gridDataStore.gridDataMap[dataKey]]);

  const handleColumnResize = (ci: Id, width: number) => {
    setColumnsSize((prev) => {
      return {...prev, [ci]: width};
    })
  }

  const handleScroll = () => {
    throttledUpdateScroll()
  }

  const updateScroll = () => {
    if (ref.current == null) return null;
    console.log('scroll')
    ref?.current?.forceUpdate();
  }

  const throttledUpdateScroll = throttle(()=> updateScroll, 1000 / 2)

  const configTable = gridDataStore.gridDataMap[dataKey] ?? defaultConfigTable;

  const columns = getColumns(configTable.header, columnsSize);
  const rows = getTableRows(configTable);

  return (
    <div className="just-grid" onScroll={handleScroll}>
      <ReactGrid
        key={dataKey}
        ref={ref}
        rows={rows}
        columns={columns}
        stickyTopRows={1}
        stickyLeftColumns={1}
        enableRangeSelection={true}
        onColumnResized={handleColumnResize}
        disableVirtualScrolling={false}
      />
    </div>
  )
}

export default JustGrid;

