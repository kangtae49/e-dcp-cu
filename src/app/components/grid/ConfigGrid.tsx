import "./ConfigGrid.css"
import {useEffect, useRef, useState} from "react";
import {type Column, type DefaultCellTypes, type Id, ReactGrid, type Row} from "@silevis/reactgrid";
import {useDynamicSlice} from "@/store/hooks";
import {
  CONFIG_ID,
  type ConfigsActions,
  type ConfigsState,
  createConfigsSlice
} from "@/app/config/configsSlice";
import throttle from "lodash/throttle";
import {ConfigTable} from "@/types";

interface Props {
  configKey: string
}

function ConfigGrid({configKey}: Props) {
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>(CONFIG_ID, createConfigsSlice)

  const ref = useRef<ReactGrid>(null)


  const defaultConfigTable: ConfigTable = {key: configKey, header: [], data: []}

  const [configTable, setConfigTable] = useState<ConfigTable>(defaultConfigTable);


  const getColumns = (header: string[]): Column[] => [
    { columnId: " ", width: 50, resizable: true, },
    ...header.map(h => ({ columnId: h, width: 100, resizable: true, })),
  ]

  const [columns, setColumns] = useState<Column[]>(getColumns([]));

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
    if (configsState === undefined) return;
    const newTable = configsState.configs[configKey] ?? defaultConfigTable;
    setColumns(getColumns(newTable.header))
    setConfigTable(configsState.configs[configKey] ?? defaultConfigTable)
  }, [configsState, configKey])

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

  const throttledUpdateScroll = throttle(() => {
    if (ref.current == null) return null;
    console.log('scroll')
    ref?.current?.forceUpdate();
  }, 1000 / 2)

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

export default ConfigGrid;

