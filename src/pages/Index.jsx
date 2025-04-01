
import { useCallback, useRef, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Link } from 'react-router-dom';
import ReactFlowEditor from '../components/ReactFlowEditor';
import ControlPanel from '../components/ControlPanel';
import useStore from '../store/flowStore';
import '../styles/Index.css';

const Index = () => {
  const reactFlowWrapper = useRef(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  
  const handleNodeClick = (event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setSelectedEdge(null);
  };
  
  const handleEdgeClick = (event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    setSelectedNode(null);
  };
  
  const handlePaneClick = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  return (
    <ReactFlowProvider>
      <div className="app-container">
        <div className="app-header">
          <h1>Flow Chart Editor</h1>
          <div className="nav-links">
            <Link to="/table" className="nav-link">View Document Table</Link>
          </div>
        </div>
        <div className="flow-editor-container">
          <ControlPanel 
            reactFlowWrapper={reactFlowWrapper} 
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
          />
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlowEditor
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={handlePaneClick}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Index;
