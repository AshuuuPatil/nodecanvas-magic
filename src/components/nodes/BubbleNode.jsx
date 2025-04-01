
import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const BubbleNode = ({ data, isConnectable, selected, style }) => {
  const [label, setLabel] = useState(data.label || '');
  const [details, setDetails] = useState(data.details || '');
  const isNote = data.isNote || false;
  
  // Determine edge color based on node label
  useEffect(() => {
    if (data.onTypeChange) {
      if (label.includes('Death Certificate')) {
        data.onTypeChange('death');
      } else if (label.includes('Affidavit of Heirship')) {
        data.onTypeChange('affidavit');
      } else if (label.includes('Obituary')) {
        data.onTypeChange('obituary');
      } else if (label.includes('Adoption') || label.includes('Divorce')) {
        data.onTypeChange('adoption');
      } else {
        data.onTypeChange('default');
      }
    }
  }, [label, data]);

  // Update the label
  const handleLabelChange = (e) => {
    const newLabel = e.target.innerText;
    setLabel(newLabel);
    if (data.onLabelChange) {
      data.onLabelChange(newLabel);
    }
  };
  
  // Update the details
  const handleDetailsChange = (e) => {
    const newDetails = e.target.innerText;
    setDetails(newDetails);
    if (data.onDetailsChange) {
      data.onDetailsChange(newDetails);
    }
  };
  
  return (
    <div 
      className={`bubble-node ${isNote ? 'note-bubble' : ''}`} 
      style={style}
    >
      <NodeResizer 
        minWidth={80} 
        minHeight={80}
        isVisible={selected}
      />
      {!isNote && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      )}
      <div className="node-content">
        <div 
          className="node-label editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleLabelChange}
        >
          {label}
        </div>
        <div 
          className="node-details editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDetailsChange}
        >
          {details}
        </div>
      </div>
    </div>
  );
};

export default memo(BubbleNode);
