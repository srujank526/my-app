import { useSortable } from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities'
import {Card} from 'react-bootstrap'

const DraggablePlayer = ({ id, name }) => {
    const { attributes, listeners, transform, transition, setNodeRef } = useSortable({ id });
  
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        padding: '8px',
        fontSize: '0.9rem', 
        border: '1px solid #ddd',
        borderRadius: '4px', 
        backgroundColor: '#fff',
        marginBottom: '8px', 
        cursor: 'move',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
        width: 'auto',
      };
  
    return (
      <Card ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <Card.Body>{name}</Card.Body>
      </Card>
    );
  };

export default DraggablePlayer