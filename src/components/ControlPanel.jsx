
import { useCallback, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { HexColorPicker } from 'react-colorful';
import { useReactFlow } from '@xyflow/react';
import useStore from '../store/flowStore';
import DraggableNode from './DraggableNode';
import '../styles/ControlPanel.css';

const ControlPanel = ({ reactFlowWrapper, selectedNode, selectedEdge }) => {
  const { getNodes, getEdges, setViewport } = useReactFlow();
  const { resetFlow, setNodeColor, setEdgeColor, removeNode, removeEdge, createInitialNodesForFile } = useStore();
  const [nodeColor, setNodeColorState] = useState('#4a90e2');
  const [edgeColor, setEdgeColorState] = useState('#000000');
  const [showNodeColorPicker, setShowNodeColorPicker] = useState(false);
  const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // Save as image
  const onSaveImage = useCallback(() => {
    if (reactFlowWrapper.current === null) return;

    // Export as PNG
    toPng(reactFlowWrapper.current.querySelector('.react-flow__renderer'), {
      quality: 0.95,
      backgroundColor: '#ffffff'
    })
      .then((dataUrl) => {
        saveAs(dataUrl, 'flow-diagram.png');
      })
      .catch((error) => {
        console.error('Error saving image:', error);
      });

    // Also generate JSON
    const flow = {
      nodes: getNodes().map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
        style: node.style
      })),
      edges: getEdges()
    };
    
    const jsonString = JSON.stringify(flow, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'flow-data.json');
  }, [reactFlowWrapper, getNodes, getEdges]);

  // Reset the flow
  const onReset = useCallback(() => {
    // Get the current fileData from URL or state
    const currentFile = useStore.getState().getCurrentFile();
    if (currentFile) {
      createInitialNodesForFile(currentFile);
    } else {
      resetFlow();
    }
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [resetFlow, createInitialNodesForFile, setViewport]);

  // Delete selected node or edge
  const onDeleteSelected = useCallback(() => {
    if (selectedNode) {
      removeNode(selectedNode.id);
    } else if (selectedEdge) {
      removeEdge(selectedEdge.id);
    }
  }, [selectedNode, selectedEdge, removeNode, removeEdge]);

  // Apply color to selected node
  const applyNodeColor = useCallback(() => {
    if (selectedNode) {
      setNodeColor(selectedNode.id, nodeColor);
    }
    setShowNodeColorPicker(false);
  }, [selectedNode, nodeColor, setNodeColor]);

  // Apply color to selected edge
  const applyEdgeColor = useCallback(() => {
    if (selectedEdge) {
      setEdgeColor(selectedEdge.id, edgeColor);
    }
    setShowEdgeColorPicker(false);
  }, [selectedEdge, edgeColor, setEdgeColor]);

  // Handle node drag start
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>Nodes</h3>
        <div className="draggable-nodes">
          <DraggableNode 
            type="grantorNode" 
            onDragStart={onDragStart} 
            data={{ label: 'Grantor' }}
            label="Grantor"
            className="node-grantor"
          />
          <DraggableNode 
            type="instrumentNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Instrument Type',
              details: [
                'Execution Date',
                'Effective Date',
                'Filed Date',
                'Transfered Rights'
              ]
            }}
            label="Instrument"
            className="node-instrument"
          />
          <DraggableNode 
            type="granteeNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Grantee'
            }}
            label="Grantee"
            className="node-grantee"
          />
          <DraggableNode 
            type="retainedRightsNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Grantee (Also Grantor)',
              details: [
                '( Grantor with Retained Rights use dotted line. This depicts ongoing ownership interest after assignment )'
              ]
            }}
            label="Retained Rights"
            className="node-retained-rights"
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          {(selectedNode || selectedEdge) && (
            <button 
              className="btn-action" 
              onClick={onDeleteSelected}
              title="Delete selected node or edge"
            >
              Delete
            </button>
          )}
          <button 
            className="btn-action" 
            onClick={onReset}
            title="Reset canvas"
          >
            Reset
          </button>
          <button 
            className="btn-action" 
            onClick={onSaveImage}
            title="Export as image"
          >
            Download Image
          </button>
        </div>
      </div>

      {selectedNode && (
        <div className="panel-section">
          <h3>Selected Node</h3>
          <div className="node-actions">
            <button 
              className="btn-action"
              onClick={() => setShowNodeColorPicker(!showNodeColorPicker)}
              title="Change node color"
            >
              Change Color
            </button>
          </div>
          {showNodeColorPicker && (
            <div className="color-picker-container" ref={colorPickerRef}>
              <HexColorPicker color={nodeColor} onChange={setNodeColorState} />
              <button 
                className="btn-apply-color"
                onClick={applyNodeColor}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {selectedEdge && (
        <div className="panel-section">
          <h3>Selected Edge</h3>
          <div className="edge-actions">
            <button 
              className="btn-action"
              onClick={() => setShowEdgeColorPicker(!showEdgeColorPicker)}
              title="Change edge color"
            >
              Change Edge Color
            </button>
          </div>
          {showEdgeColorPicker && (
            <div className="color-picker-container" ref={colorPickerRef}>
              <HexColorPicker color={edgeColor} onChange={setEdgeColorState} />
              <button 
                className="btn-apply-color"
                onClick={applyEdgeColor}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
