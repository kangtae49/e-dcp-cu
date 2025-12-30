import "./GridView.css"
import JustGrid from "@/app/components/grid/JustGrid.tsx";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faPenToSquare, faDownload} from "@fortawesome/free-solid-svg-icons";
import {JustId} from "@/app/components/just-layout/justLayoutSlice.ts";
import {JustUtil} from "@/app/components/just-layout/layoutUtil.ts";
import React, {useLayoutEffect, useRef} from "react";
import useGridData from "@/app/grid/useGridData.ts";
import {GRID_DATA_ID} from "@/app/grid/gridDataSlice.ts";
import {useDrop} from "react-dnd";
import {NativeTypes} from "react-dnd-html5-backend";
import {FileItem} from "@/types.ts";

interface Props {
  justId: JustId
}

function GridView({justId}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const {
    state: gridDataState,
  } = useGridData(GRID_DATA_ID)

  const dataKey = JustUtil.getParamString(justId, 'file');
  const title = justId.title;

  const clickOpenFile = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log(dataKey)
    window.api.startDataFile(dataKey).then()
  }

  const dragDownload = (e: React.DragEvent) => {
    console.log('onDragDownload', dataKey)
    e.preventDefault()
    window.api.startDrag({
      file: dataKey
    })
  }

  const clickDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log(dataKey)
    window.api.openSaveDialog(dataKey, dataKey).then()
  }

  const [, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: FileItem, monitor) {
      console.log('drop:', item)
      if (gridDataState?.gridDataMap?.[dataKey]?.isLocked) {
        alert(`Close Excel: ${dataKey}`)
        window.api.startDataFile(dataKey).then()
        return
      }

      const fileItem = monitor.getItem<FileItem>()
      const path = window.api.getPathForFile(fileItem.files[0])
      window.api.uploadFile(path, dataKey).then()
    }
  }), [ref, gridDataState?.gridDataMap?.[dataKey]?.isLocked])



  useLayoutEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);



  return (
    <div ref={ref} className="grid-view">
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
          dataKey={dataKey}
        />
      </div>
    </div>
  )
}

export default GridView;

