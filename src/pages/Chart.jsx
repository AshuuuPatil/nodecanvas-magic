
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowEditor from '../components/ReactFlowEditor';
import ControlPanel from '../components/ControlPanel';
import useStore from '../store/flowStore';
import '../styles/Chart.css';
import { Dialog } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const Chart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getFileById, 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setNodes, 
    setEdges,
    saveFlowToLocalStorage,
    loadFlowFromLocalStorage,
    getAllSavedFlows
  } = useStore();
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedFlows, setSavedFlows] = useState([]);
  
  // Load all saved flows and current file data on component mount
  useEffect(() => {
    // Get file data from store
    const fileId = parseInt(id);
    const file = getFileById(fileId);
    
    if (!file) {
      navigate('/table');
      return;
    }
    
    setFileData(file);
    
    // Load all previously saved flows
    const flows = getAllSavedFlows();
    setSavedFlows(flows);
    
    // Check if we have a saved flow for this file
    const savedFlow = loadFlowFromLocalStorage(fileId);
    
    if (savedFlow) {
      // If we have a saved flow, use it
      setNodes(savedFlow.nodes);
      setEdges(savedFlow.edges);
    } else {
      // Create initial nodes for the chart
      createInitialNodes(file);
    }
  }, [id, getFileById, navigate, setNodes, setEdges, loadFlowFromLocalStorage, getAllSavedFlows]);
  
  // Create initial nodes function
  const createInitialNodes = useCallback((file) => {
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
            `Transfered Rights`
          ],
          note: file.property_description || 'Additional notes can be added here',
          s3Url: file.s3_url || '',
          viewButton: () => {
            // Define the action for the "View" button
            window.open(file.s3_url, '_blank');
          },
          menuOptions: [
            'Death Certificate',
            'Affidavit of Heirship',
            'Obituary',
            'Adoption'
          ]
        },
        style: { 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ccc', 
          width: 250, 
          height: 'auto',
          position: 'relative' // Ensure relative positioning for the button
        },
      }
    ];
    
    // Create initial edges (empty at first)
    const initialEdges = [];
    
    // Set the nodes and edges in the store
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  // Track changes in nodes and edges
  useEffect(() => {
    setHasChanges(true);
  }, [nodes, edges]);

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
    if (hasChanges) {
      // Show save dialog if there are unsaved changes
      setShowSaveDialog(true);
    } else {
      navigate('/table');
    }
  };

  const handleSaveFlow = () => {
    if (fileData) {
      saveFlowToLocalStorage(fileData.id, nodes, edges);
      setHasChanges(false);
      setShowSaveDialog(false);
    }
  };

  const handleDiscardChanges = () => {
    setHasChanges(false);
    setShowSaveDialog(false);
    navigate('/table');
  };

  const handleSaveAndNavigate = () => {
    handleSaveFlow();
    navigate('/table');
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <button className="back-button" onClick={handleBackToTable}>Back to Table</button>
        <button className="save-button" onClick={handleSaveFlow}>Save</button>
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
          {/* If there are saved flows, display them alongside the current flow */}
          {/* {savedFlows.length > 0 && (
            <div className="saved-flows-container">
              {savedFlows.map(flow => (
                <div key={flow.id} className="saved-flow-preview">
                  <h3>File ID: {flow.id}</h3> */}
                  {/* This would be a mini preview of the saved flow */}
                {/*</div>
              ))}
            </div>
          )}
           */}

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

          <div className="control-panel-container">
            <ControlPanel 
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
            />
          </div>

        </div>
      </ReactFlowProvider>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <div className="save-dialog-header">
              <h3>Save changes before leaving?</h3>
              <button className="close-dialog-btn" onClick={() => setShowSaveDialog(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="save-dialog-content">
              <p>You have unsaved changes. Would you like to save them before navigating away?</p>
            </div>
            <div className="save-dialog-actions">
              <button className="btn-save" onClick={handleSaveAndNavigate}>Save</button>
              <button className="btn-discard" onClick={handleDiscardChanges}>Don't Save</button>
              <button className="btn-cancel" onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
