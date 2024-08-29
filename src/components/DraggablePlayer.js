import { useSortable } from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities'

const DraggablePlayer = ({id,name})=>{

    const {attributes,listeners,transform,transition,setNodeRef}= useSortable({id})
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    return(
    <>
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} >{name}</div>
    </>
    )
}

export default DraggablePlayer