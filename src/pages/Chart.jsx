
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowEditor from '../components/ReactFlowEditor';
import useStore from '../store/flowStore';
import '../styles/Chart.css';
import { X } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

const Chart = () => {
  const reactFlowWrapperRef = useRef(null);
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
    getAllSavedFlows,
    resetFlow,
    createInitialNodesForFile,
    removeNode,
    removeEdge,
    setCurrentFile
  } = useStore();
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [multiChartMode, setMultiChartMode] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  
  // On component mount, load all saved flows and check which files have saved charts
  useEffect(() => {
    // Get file data from store
    const fileId = parseInt(id);
    const file = getFileById(fileId);
    
    if (!file) {
      navigate('/table');
      return;
    }
    
    setFileData(file);
    setCurrentFile(file);
    
    // Check if we have saved charts for other files
    const savedFlows = getAllSavedFlows();
    const flowsArray = Object.values(savedFlows || {});
    
    // Get all file data
    const allFileData = useStore.getState().fileData;
    setAllFiles(allFileData);
    
    // Check for multi-chart mode
    const otherSavedFlows = flowsArray.filter(flow => flow.id !== fileId);
    if (otherSavedFlows.length > 0) {
      setMultiChartMode(true);
    }
    
    // Create initial nodes for the file, which will also load any saved flows
    createInitialNodesForFile(file);
  }, [id, getFileById, navigate, getAllSavedFlows, createInitialNodesForFile, setCurrentFile]);
  
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
  
  const handleResetChart = () => {
    if (fileData) {
      // Create initial nodes for the file (only the Instrument node as requested)
      createInitialNodesForFile(fileData);
      setHasChanges(true);
    }
  };
  
  const handleDownloadImage = useCallback(() => {
    if (!reactFlowWrapperRef.current) return;
    
    // Find the ReactFlow element within the wrapper
    const reactFlowElement = reactFlowWrapperRef.current.querySelector('.react-flow');
    
    if (!reactFlowElement) {
      console.error('ReactFlow element not found');
      return;
    }
    
    toJpeg(reactFlowElement, { 
      quality: 0.95, 
      backgroundColor: '#ffffff',
      width: reactFlowElement.offsetWidth,
      height: reactFlowElement.offsetHeight
    })
      .then((dataUrl) => {
        saveAs(dataUrl, `flow-chart-${fileData.id}.jpeg`);
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
      });
  }, [fileData]);

  const handleDeleteSelected = () => {
    if (selectedNode) {
      removeNode(selectedNode.id);
      setSelectedNode(null);
    } else if (selectedEdge) {
      removeEdge(selectedEdge.id);
      setSelectedEdge(null);
    }
  };

  const handleViewPdf = (url) => {
    setPdfUrl(url);
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setPdfUrl('');
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
          <div className="reactflow-wrapper" ref={reactFlowWrapperRef}>
            <ReactFlowEditor
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={handlePaneClick}
              onViewPdf={handleViewPdf}
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="right-sidebar">
            {/* Nodes Section */}
            <div className="sidebar-section">
              <h3>Nodes</h3>
              <div className="sidebar-node-item" style={{ backgroundColor: '#9b87f5' }}>
                Grantor
              </div>
              <div className="sidebar-node-item" style={{ backgroundColor: '#f5f5f5' }}>
                Instrument
              </div>
              <div className="sidebar-node-item" style={{ backgroundColor: '#7E69AB' }}>
                Grantee
              </div>
              <div className="sidebar-node-item" style={{ backgroundColor: '#4a9af5' }}>
                Retained Rights
              </div>
            </div>
            
            {/* Actions Section */}
            <div className="sidebar-section">
              <h3>Actions</h3>
              {(selectedNode || selectedEdge) && (
                <button className="sidebar-action-button" onClick={handleDeleteSelected}>
                  Delete
                </button>
              )}
              <button className="sidebar-action-button" onClick={handleResetChart}>
                Reset
              </button>
              <button className="sidebar-action-button" onClick={handleDownloadImage}>
                Download Image
              </button>
            </div>
            
            {/* Selected Node Info */}
            {selectedNode && (
              <div className="sidebar-section">
                <h3>Selected Node</h3>
                <div className="selected-node-info">
                  <p><strong>Type:</strong> {selectedNode.type}</p>
                  <p><strong>ID:</strong> {selectedNode.id}</p>
                  {selectedNode.data.label && (
                    <p><strong>Label:</strong> {selectedNode.data.label}</p>
                  )}
                  <button 
                    className="sidebar-action-button color-button"
                    onClick={() => {
                      // Show color picker
                      document.querySelector('.color-picker-container').classList.toggle('show');
                    }}
                  >
                    Change Color
                  </button>
                  <div className="color-picker-container">
                    <div className="color-swatches">
                      <div className="color-swatch" style={{backgroundColor: '#9b87f5'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#9b87f5')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#7E69AB'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#7E69AB')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#6E59A5'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#6E59A5')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#f5f5f5'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#f5f5f5')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#4a9af5'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#4a9af5')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#ea384c'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#ea384c')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#FFC107'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#FFC107')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#4CAF50'}} onClick={() => useStore.getState().setNodeColor(selectedNode.id, '#4CAF50')}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Selected Edge Info */}
            {selectedEdge && (
              <div className="sidebar-section">
                <h3>Selected Edge</h3>
                <div className="selected-node-info">
                  <p><strong>ID:</strong> {selectedEdge.id}</p>
                  <button 
                    className="sidebar-action-button color-button"
                    onClick={() => {
                      // Show color picker
                      document.querySelector('.edge-color-picker-container').classList.toggle('show');
                    }}
                  >
                    Change Edge Color
                  </button>
                  <div className="edge-color-picker-container">
                    <div className="color-swatches">
                      <div className="color-swatch" style={{backgroundColor: '#000000'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#000000')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#9b87f5'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#9b87f5')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#ea384c'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#ea384c')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#FFD700'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#FFD700')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#1EAEDB'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#1EAEDB')}></div>
                      <div className="color-swatch" style={{backgroundColor: '#4CAF50'}} onClick={() => useStore.getState().setEdgeColor(selectedEdge.id, '#4CAF50')}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ReactFlowProvider>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="pdf-viewer-overlay">
          <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
              <h3>Document Viewer</h3>
              <button className="close-pdf-btn" onClick={closePdfViewer}>
                <X size={18} />
              </button>
            </div>
            <div className="pdf-viewer-content">
              <iframe 
                src={pdfUrl} 
                title="PDF Viewer" 
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      )}
      
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
