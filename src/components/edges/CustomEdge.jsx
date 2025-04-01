import { memo } from 'react';
import { getSmoothStepPath, BaseEdge } from '@xyflow/react';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }) => {
  let edgeStyle = { ...style };
  if (data && data.type) {
    switch (data.type) {
      case 'death':
        edgeStyle.stroke = '#ea384c';
        break;
      case 'affidavit':
        edgeStyle.stroke = '#FFD700';
        break;
      case 'obituary':
        edgeStyle.stroke = '#1EAEDB';
        break;
      case 'adoption':
        edgeStyle.stroke = '#4CAF50';
        break;
      default:
        break;
    }
  }

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge id={id} path={edgePath} style={edgeStyle} />
  );
};

export default memo(CustomEdge);
