
import { useCallback, useState } from 'react';
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
  onPaneClick,
  onEdgeClick,
  onViewPdf
}) => {
  const reactFlow = useReactFlow();
  const { addNode, updateNodeData, updateEdgeData } = useStore();
  const [selectedEdge, setSelectedEdge] = useState(null);

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

      // Handle different types of grantee nodes
      if (type === 'granteeNode') {
        if (nodeData.isFinal) {
          addNode(type, position, { ...nodeData, isFinal: true });
        } else {
          addNode(type, position, nodeData);
        }
      } else {
        // Add any other type of node
        addNode(type, position, nodeData);
      }
    },
    [reactFlow, addNode]
  );

  const handleEdgeClick = (event, edge) => {
    setSelectedEdge(edge);
    if (onEdgeClick) {
      onEdgeClick(event, edge);
    }
  };

  const handleNodeDataChange = (nodeId, key, value) => {
    updateNodeData(nodeId, key, value);
  };

  const handleViewPdf = (url) => {
    if (onViewPdf) {
      onViewPdf(url);
    }
  };

  // Process nodes to add onViewPdf callback
  const processedNodes = nodes.map(node => {
    if (node.type === 'instrumentNode') {
      return {
        ...node,
        data: {
          ...node.data,
          onViewPdf: handleViewPdf
        }
      };
    }
    return node;
  });

  return (
    <ReactFlow
      nodes={processedNodes}
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
      onEdgeClick={handleEdgeClick}
      onPaneClick={onPaneClick}
      deleteKeyCode={['Backspace', 'Delete']}
      nodesDraggable={true}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default ReactFlowEditor;
