
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const InstrumentNode = ({ data, isConnectable, selected, style }) => {
  return (
    <div className="instrument-node" style={style}>
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
        <div className="node-label">{data.label}</div>
        {data.details && (
          <div className="node-details">
            {data.details.map((detail, index) => (
              <div key={index} className="detail-item">
                {detail}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(InstrumentNode);
