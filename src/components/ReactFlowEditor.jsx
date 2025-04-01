
import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from '../store/flowStore';
import GrantorNode from './nodes/GrantorNode';
import InstrumentNode from './nodes/InstrumentNode';
import GranteeNode from './nodes/GranteeNode';
import RetainedRightsNode from './nodes/RetainedRightsNode';
import BubbleNode from './nodes/BubbleNode';
import CustomEdge from './edges/CustomEdge';
import DashedEdge from './edges/DashedEdge';
import '../styles/ReactFlowEditor.css';

// Node types definition
const nodeTypes = {
  grantorNode: GrantorNode,
  instrumentNode: InstrumentNode,
  granteeNode: GranteeNode,
  retainedRightsNode: RetainedRightsNode,
  bubbleNode: BubbleNode,
};

// Edge types definition
const edgeTypes = {
  custom: CustomEdge,
  dashed: DashedEdge,
};

const ReactFlowEditor = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  onNodeClick,
  onPaneClick
}) => {
  const reactFlow = useReactFlow();
  const { addNode } = useStore();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/data'));

      // Get the position of the drop
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Add the new node
      addNode(type, position, nodeData);
    },
    [reactFlow, addNode]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      deleteKeyCode={['Backspace', 'Delete']}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default ReactFlowEditor;
