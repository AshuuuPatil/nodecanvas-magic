
import { memo } from 'react';
import { getSmoothStepPath, BaseEdge } from '@xyflow/react';

const DashedEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Add dashed style to the edge
  const dashedStyle = {
    ...style,
    strokeDasharray: '5, 5',
  };

  return (
    <BaseEdge id={id} path={edgePath} style={dashedStyle} />
  );
};

export default memo(DashedEdge);
