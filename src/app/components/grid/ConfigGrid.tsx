import "./ConfigGrid.css"
import {useEffect, useRef, useState} from "react";
import {type Column, type DefaultCellTypes, type Id, ReactGrid, type Row} from "@silevis/reactgrid";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  CONFIG_ID,
  type ConfigsActions,
  type ConfigsState,
  createConfigsSlice
} from "@/app/config/configsSlice.ts";
import throttle from "lodash/throttle";
import {ConfigTable} from "@/types.ts";

interface Props {
  configKey: string
}

const getColumns = (header: string[]): Column[] => [
  { columnId: " ", width: 50, resizable: true, },
  ...header.map(h => ({ columnId: h, width: 100, resizable: true, })),
]
function ConfigGrid({configKey}: Props) {
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)



  const ref = useRef<ReactGrid>(null)

  const defaultConfigTable: ConfigTable = {key: configKey, header: [], data: []}

  const configTable = configsState?.configs[configKey] ?? defaultConfigTable;
  const [columns, setColumns] = useState(()=> getColumns(configTable.header));

  const isReady = !!(configsState?.configs && configKey in configsState.configs);
  const getTableRows = (table: ConfigTable): Row[] => {
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

  const getTableBody = (table: ConfigTable): Row [] => {
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
    // if (ref.current == null) return null;
    ref?.current?.forceUpdate();
  }, [configTable]);


  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      prevColumns[columnIndex] = {...resizedColumn, width};
      return [...prevColumns];
    });
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
  console.log('configTable:', configKey, configTable, columns, isReady)
  return (
    // <AutoSizer>
    //   {({ height, width }) => (
    //   )}
    // </AutoSizer>

  <div className="just-grid" onScroll={handleScroll}>
    <ReactGrid
      key={configKey}
      ref={ref}
      rows={getTableRows(configTable)}
      columns={getColumns(configTable.header)}
      stickyTopRows={1}
      stickyLeftColumns={1}
      enableRangeSelection={true}
      onColumnResized={handleColumnResize}
      disableVirtualScrolling={false}
    />
    </div>
  )
}

export default ConfigGrid;

