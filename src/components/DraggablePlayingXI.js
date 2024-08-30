import React from "react";
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import DraggablePlayer from "./DraggablePlayer";

const DraggablePlayingXI = ({ players }) => {
    return (
        <>
        <SortableContext items={players} strategy={verticalListSortingStrategy}>
            {players.map((player) => {
                return <DraggablePlayer id={player.id} name={player.name} key={player.id}/>
            })}
            </SortableContext>
        </>
    )
}

export default DraggablePlayingXI