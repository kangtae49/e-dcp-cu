import {useDrag} from "react-dnd";

const useDraggableFile = (type: string | symbol, item: any) => {
  const [, drag] = useDrag({
    type: type,
    item: () => {

      return item
    }
  })
  return {drag}
}

export default useDraggableFile