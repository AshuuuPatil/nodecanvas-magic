
import { useState } from 'react';
import '../styles/DraggableNode.css';

const DraggableNode = ({ type, onDragStart, data, label, className }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleDragStart = (event) => {
    if (!isResizing) {
      onDragStart(event, type, data);
    }
  };

  // Prevent drag when user is editing text
  const handleMouseDown = (event) => {
    const target = event.target;
    if (target.classList.contains('resizer') || target.tagName === 'INPUT' || target.contentEditable === 'true') {
      event.stopPropagation();
    }
  };

  return (
    <div 
      className={`draggable-node ${className}`}
      onDragStart={handleDragStart}
      onMouseDown={handleMouseDown}
      draggable
    >
      <div className="node-content">
        {label}
        <div className="node-resizers">
          <div className="resizer resizer-r" onMouseDown={() => setIsResizing(true)} onMouseUp={() => setIsResizing(false)}></div>
          <div className="resizer resizer-b" onMouseDown={() => setIsResizing(true)} onMouseUp={() => setIsResizing(false)}></div>
          <div className="resizer resizer-br" onMouseDown={() => setIsResizing(true)} onMouseUp={() => setIsResizing(false)}></div>
        </div>
      </div>
    </div>
  );
};

export default DraggableNode;
