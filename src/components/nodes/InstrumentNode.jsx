
import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const InstrumentNode = ({ data, isConnectable, selected, style }) => {
  const [label, setLabel] = useState(data.label || 'Instrument Type');
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

  // Handle view PDF
  const handleViewPDF = () => {
    if (data.s3Url) {
      window.open(data.s3Url, '_blank');
    }
  };

  return (
    <div className="instrument-node" style={style}>
      <NodeResizer 
        minWidth={180} 
        minHeight={100}
        isVisible={selected}
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
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
          <div className="node-details">
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
        {data.s3Url && (
          <div className="node-actions">
            <button onClick={handleViewPDF} className="view-pdf-btn">
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(InstrumentNode);
