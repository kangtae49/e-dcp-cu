import "./GridDataView.css"
import JustGrid from "@/app/components/grid/JustGrid.tsx";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare, faDownload} from "@fortawesome/free-solid-svg-icons";
import {JustUtil} from "@/app/components/just-layout/justUtil.ts";
import React, {useLayoutEffect, useRef} from "react";
import useGridDataStore from "@/app/grid-data/useGridDataStore.ts";
import {useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import {FileItem} from "@/types.ts";
import {GRID_DATA_ID} from "@/app/grid-data/gridData.constants.ts";
import {JustId} from "@/app/components/just-layout/justLayout.types.ts";
import {observer} from "mobx-react-lite";
import pathUtils from "@/utils/pathUtils.ts";

interface Props {
  justId: JustId
  layoutId: string
}

const GridDataView = observer(({justId}: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const gridDataStore = useGridDataStore(GRID_DATA_ID)

  const dataKey = JustUtil.getParamString(justId, 'file');
  const title = justId.title;
  window.api.addWatchPath([dataKey, pathUtils.getLockFile(dataKey)])

  const clickOpenFile = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.startFile(dataKey).then()
  }

  const dragDownload = (e: React.DragEvent) => {
    e.preventDefault()
    window.api.startDrag({
      file: dataKey
    })
  }

  const clickDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    window.api.openSaveDialog(dataKey, dataKey).then()
  }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(_item: FileItem, monitor) {
      if (gridDataStore.gridDataMap?.[dataKey]?.isLocked) {
        alert(`Close Excel: ${dataKey}`)
        window.api.startFile(dataKey).then()
        return
      }

      const fileItem = monitor.getItem<FileItem>()
      const path = window.api.getPathForFile(fileItem.files[0])
      window.api.uploadFile(path, dataKey).then()
    }
  }), [ref, gridDataStore.gridDataMap?.[dataKey]?.isLocked])



  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);

  return (
    <div ref={ref} className="grid-data-view">
      <div className="grid-head">
        <div
          draggable={true}
          onDragStart={dragDownload}
          onClick={clickDownload}
        >
          <Icon icon={faDownload} />
        </div>
        <div onClick={clickOpenFile}>
          <Icon icon={faPenToSquare} />
        </div>
        <div className="grid-title">
          {title}
        </div>
      </div>
      <div className="grid-container">
        <JustGrid
          key={dataKey}
          dataKey={dataKey}
        />
      </div>
    </div>
  )
})

export default GridDataView;

