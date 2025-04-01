
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const RetainedRightsNode = ({ data, isConnectable, selected, style }) => {
  return (
    <div className="retained-rights-node" style={style}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-label">{data.label}</div>
        {data.details && (
          <div className="node-details small-text">
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

export default memo(RetainedRightsNode);
