
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowEditor from '../components/ReactFlowEditor';
import ControlPanel from '../components/ControlPanel';
import useStore from '../store/flowStore';
import '../styles/Chart.css';

const Chart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFileById, nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges } = useStore();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [fileData, setFileData] = useState(null);
  
  useEffect(() => {
    // Get file data from store
    const fileId = parseInt(id);
    const file = getFileById(fileId);
    
    if (!file) {
      navigate('/table');
      return;
    }
    
    setFileData(file);
    
    // Create initial nodes for the chart
    const initialNodes = [
      {
        id: 'instrument',
        type: 'instrumentNode',
        position: { x: 350, y: 100 },
        data: { 
          label: file.instrument_type,
          details: [
            `Execution Date: ${file.execution_date ? new Date(file.execution_date).toLocaleDateString() : 'N/A'}`,
            `Effective Date: ${file.effective_date ? new Date(file.effective_date).toLocaleDateString() : 'N/A'}`,
            `Filed Date: ${file.file_date ? new Date(file.file_date).toLocaleDateString() : 'N/A'}`,
            '-User Notes-',
            'Transfered Rights'
          ],
          note: file.property_description || 'Additional notes can be added here'
        },
        style: { backgroundColor: '#f5f5f5', border: '1px solid #ccc', width: 250, height: 180 }
      }
    ];
    
    // Create initial edges (empty at first)
    const initialEdges = [];
    
    // Set the nodes and edges in the store
    setNodes(initialNodes);
    setEdges(initialEdges);
    
  }, [id, getFileById, navigate, setNodes, setEdges]);

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
  
  const handleBackToTable = () => {
    navigate('/table');
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <button className="back-button" onClick={handleBackToTable}>Back to Table</button>
        <div className="file-info">
          {fileData && (
            <>
              <h2>{fileData.instrument_type}</h2>
              <div className="file-details">
                <span>ID: {fileData.id}</span>
                <span>Grantor: {fileData.grantor}</span>
                <span>Grantee: {fileData.grantee}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ReactFlowProvider>
        <div className="flow-editor-container">
          <ControlPanel 
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
          />
          <div className="reactflow-wrapper">
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
      </ReactFlowProvider>
    </div>
  );
};

export default Chart;
