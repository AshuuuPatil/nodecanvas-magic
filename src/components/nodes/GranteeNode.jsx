
import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const GranteeNode = ({ data, isConnectable, selected, style }) => {
  const [label, setLabel] = useState(data.label || 'Grantee');
  const [note, setNote] = useState(data.note || '');
  const isFinal = data.isFinal || false;
  
  // Update the data object when label changes
  const handleLabelChange = (e) => {
    const newLabel = e.target.innerText;
    setLabel(newLabel);
    if (data.onLabelChange) {
      data.onLabelChange(newLabel);
    }
  };
  
  // Update the data object when note changes
  const handleNoteChange = (e) => {
    const newNote = e.target.innerText;
    setNote(newNote);
    if (data.onNoteChange) {
      data.onNoteChange(newNote);
    }
  };

  return (
    <div className={`grantee-node ${isFinal ? 'final-grantee' : ''}`} style={style}>
      <NodeResizer 
        minWidth={100} 
        minHeight={40}
        isVisible={selected}
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      {!isFinal && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}
      <div 
        className="node-label editable-content"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleLabelChange}
      >
        {label}
      </div>
      <div 
        className="node-note editable-content"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleNoteChange}
        placeholder="Add notes..."
      >
        {note}
      </div>
      {!isFinal && (
        <div className="node-type-indicator">Extendable</div>
      )}
      {isFinal && (
        <div className="node-type-indicator final">Final</div>
      )}
    </div>
  );
};

export default memo(GranteeNode);
