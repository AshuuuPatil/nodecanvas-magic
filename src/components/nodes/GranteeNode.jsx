
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const GranteeNode = ({ data, isConnectable, selected, style }) => {
  return (
    <div className="grantee-node" style={style}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="node-label">{data.label}</div>
    </div>
  );
};

export default memo(GranteeNode);
