
import { useCallback, useRef, useState } from 'react';
import ReactFlowEditor from '../components/ReactFlowEditor';
import ControlPanel from '../components/ControlPanel';
import useStore from '../store/flowStore';
import '../styles/Index.css';

const Index = () => {
  const reactFlowWrapper = useRef(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, resetFlow } = useStore();
  const [selectedNode, setSelectedNode] = useState(null);
  
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };
  
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flow-editor-container">
      <ControlPanel 
        reactFlowWrapper={reactFlowWrapper} 
        selectedNode={selectedNode}
      />
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlowEditor
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
        />
      </div>
    </div>
  );
};

export default Index;
