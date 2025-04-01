import { memo } from 'react';
import { getSmoothStepPath, BaseEdge } from '@xyflow/react';

const DashedEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }) => {
  // Apply specific edge colors based on target node type
  let edgeStyle = { 
    ...style,
    strokeDasharray: '5, 5',
  };

  if (data && data.type) {
    switch (data.type) {
      case 'death':
        edgeStyle.stroke = '#ea384c'; // Red for Death Certificate
        break;
      case 'affidavit':
        edgeStyle.stroke = '#FFD700'; // Yellow for Affidavit of Heirship
        break;
      case 'obituary':
        edgeStyle.stroke = '#1EAEDB'; // Blue for Obituary
        break;
      case 'adoption':
        edgeStyle.stroke = '#4CAF50'; // Green for Adoption/Divorce
        break;
      default:
        // Keep default color
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

export default memo(DashedEdge);
