
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const GrantorNode = ({ data, isConnectable, selected, style }) => {
  return (
    <div className="grantor-node" style={style}>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <div className="node-label">{data.label}</div>
    </div>
  );
};

export default memo(GrantorNode);
