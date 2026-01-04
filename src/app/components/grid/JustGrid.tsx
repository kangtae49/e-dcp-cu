import "./grid.css"
import "@silevis/reactgrid/styles.css";
import {useEffect, useRef, useState} from "react";
import {type Column, type DefaultCellTypes, type Id, ReactGrid, type Row} from "@silevis/reactgrid";
import {
  GRID_DATA_ID,
} from "@/app/grid/gridDataSlice.ts";
import throttle from "lodash/throttle";
import {GridData} from "@/types.ts";
import useGridData from "@/app/grid/useGridData.ts";

interface Props {
  dataKey: string
}

const getColumns = (header: string[], columnSize: Record<string, number>): Column[] => [
  { columnId: " ", width: 50, resizable: true, },
  ...header.map(h => ({ columnId: h, width: columnSize?.[h] ?? 150, resizable: true, })),
]
function JustGrid({dataKey}: Props) {

  const {state: configsState} = useGridData(GRID_DATA_ID)

  const ref = useRef<ReactGrid>(null)

  const defaultConfigTable: GridData = {key: dataKey, header: [], data: []}

  const configTable = configsState?.gridDataMap[dataKey] ?? defaultConfigTable;

  const [columnsSize, setColumnsSize] = useState({});

  const getTableRows = (table: GridData): Row[] => {
    return [
      getTableHeader(table.header),
      ...getTableBody(table)
    ]
  }

  const getTableHeader = (header: string []): Row => {
    return {
      rowId: "header",
      cells: [
        { type: "number", value: 1 },
        ...header.map<DefaultCellTypes>(h => ({ type: "header", text: h }))
      ]
    }
  }

  const getTableBody = (table: GridData): Row [] => {
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

  useEffect(() => {
    ref?.current?.forceUpdate();
  }, [configTable]);

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

  const rows = getTableRows(configTable);
  const columns = getColumns(configTable.header, columnsSize);
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

