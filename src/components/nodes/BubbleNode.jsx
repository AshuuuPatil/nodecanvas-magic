
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const BubbleNode = ({ data, isConnectable, selected, style }) => {
  const isNote = data.isNote || false;
  
  return (
    <div 
      className={`bubble-node ${isNote ? 'note-bubble' : ''}`} 
      style={style}
    >
      {!isNote && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      )}
      <div className="node-content">
        <div className="node-label">{data.label}</div>
        {data.details && (
          <div className="node-details">
            {data.details}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BubbleNode);
