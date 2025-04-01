
import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const RetainedRightsNode = ({ data, isConnectable, selected, style }) => {
  const [label, setLabel] = useState(data.label || '');
  const [details, setDetails] = useState(data.details || []);
  const [note, setNote] = useState(data.note || '');
  
  // Update the label
  const handleLabelChange = (e) => {
    const newLabel = e.target.innerText;
    setLabel(newLabel);
    if (data.onLabelChange) {
      data.onLabelChange(newLabel);
    }
  };
  
  // Update a detail item
  const handleDetailChange = (index, e) => {
    const newDetails = [...details];
    newDetails[index] = e.target.innerText;
    setDetails(newDetails);
    if (data.onDetailsChange) {
      data.onDetailsChange(newDetails);
    }
  };
  
  // Update the note
  const handleNoteChange = (e) => {
    const newNote = e.target.innerText;
    setNote(newNote);
    if (data.onNoteChange) {
      data.onNoteChange(newNote);
    }
  };

  return (
    <div className="retained-rights-node" style={style}>
      <NodeResizer 
        minWidth={150} 
        minHeight={80}
        isVisible={selected}
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div 
          className="node-label editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleLabelChange}
        >
          {label}
        </div>
        {details && (
          <div className="node-details small-text">
            {details.map((detail, index) => (
              <div 
                key={index} 
                className="detail-item editable-content"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleDetailChange(index, e)}
              >
                {detail}
              </div>
            ))}
          </div>
        )}
        <div 
          className="node-note editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleNoteChange}
          placeholder="Add notes..."
        >
          {note}
        </div>
      </div>
    </div>
  );
};

export default memo(RetainedRightsNode);
