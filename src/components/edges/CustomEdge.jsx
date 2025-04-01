
import { memo } from 'react';
import { getSmoothStepPath, BaseEdge } from '@xyflow/react';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge id={id} path={edgePath} style={style} />
  );
};

export default memo(CustomEdge);
