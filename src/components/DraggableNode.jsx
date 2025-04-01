
import '../styles/DraggableNode.css';

const DraggableNode = ({ type, onDragStart, data, label, className }) => {
  const handleDragStart = (event) => {
    onDragStart(event, type, data);
  };

  return (
    <div 
      className={`draggable-node ${className}`}
      onDragStart={handleDragStart}
      draggable
    >
      {label}
    </div>
  );
};

export default DraggableNode;
