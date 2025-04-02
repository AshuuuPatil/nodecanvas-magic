
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
        {/* Connection Points Visualization */}
        {type === 'grantorNode' && (
          <div className="node-connection-points">
            <div className="connection-point right"></div>
          </div>
        )}
        {type === 'instrumentNode' && (
          <div className="node-connection-points">
            <div className="connection-point top"></div>
            <div className="connection-point right"></div>
            <div className="connection-point bottom"></div>
          </div>
        )}
        {type === 'granteeNode' && (
          <div className="node-connection-points">
            <div className="connection-point top"></div>
          </div>
        )}
        {type === 'retainedRightsNode' && (
          <div className="node-connection-points">
            <div className="connection-point top"></div>
            <div className="connection-point right"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableNode;
