
import { useCallback, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { HexColorPicker } from 'react-colorful';
import { useReactFlow } from '@xyflow/react';
import useStore from '../store/flowStore';
import DraggableNode from './DraggableNode';
import '../styles/ControlPanel.css';

const ControlPanel = ({ reactFlowWrapper, selectedNode }) => {
  const { getNodes, getEdges, setViewport } = useReactFlow();
  const { resetFlow, loadFlow, setNodeColor, rotateNode } = useStore();
  const [color, setColor] = useState('#4a90e2');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // Save flow as JSON
  const onSave = useCallback(() => {
    const flow = {
      nodes: getNodes(),
      edges: getEdges(),
    };
    const jsonString = JSON.stringify(flow, null, 2);
    
    // Create a sample JSON file to download
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'flow.json');
  }, [getNodes, getEdges]);

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
    resetFlow();
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [resetFlow, setViewport]);

  // File input for loading a saved flow
  const onFileChange = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const flow = JSON.parse(e.target.result);
        loadFlow(flow);
      } catch (error) {
        console.error('Error loading flow:', error);
      }
    };
    fileReader.readAsText(event.target.files[0]);
    // Reset the input value so the same file can be loaded again
    event.target.value = null;
  };

  // Apply color to selected node
  const applyColor = useCallback(() => {
    if (selectedNode) {
      setNodeColor(selectedNode.id, color);
    }
    setShowColorPicker(false);
  }, [selectedNode, color, setNodeColor]);

  // Handle node rotation
  const handleRotate = useCallback(() => {
    if (selectedNode) {
      rotateNode(selectedNode.id);
    }
  }, [selectedNode, rotateNode]);

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
                '-User Notes-',
                'Transfered Rights'
              ]
            }}
            label="Instrument"
            className="node-instrument"
          />
          <DraggableNode 
            type="granteeNode" 
            onDragStart={onDragStart} 
            data={{ label: 'Grantee' }}
            label="Grantee"
            className="node-grantee"
          />
          <DraggableNode 
            type="retainedRightsNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Grantee (Also Grantor)',
              details: [
                '(Grantor with Retained Rights use dotted line.',
                'This depicts ongoing ownership interest after assignment)'
              ]
            }}
            label="Retained Rights"
            className="node-retained-rights"
          />
          <DraggableNode 
            type="bubbleNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Death Certificate',
              details: '• Details'
            }}
            label="Certificate"
            className="node-bubble"
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button 
            className="btn-action" 
            onClick={onSave}
            title="Save flow as JSON"
          >
            Save Flow
          </button>
          <button 
            className="btn-action" 
            onClick={onReset}
            title="Reset canvas"
          >
            Reset
          </button>
          <label className="btn-action" title="Load saved flow">
            Load Flow
            <input
              type="file"
              accept=".json"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
          </label>
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
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Change node color"
            >
              Change Color
            </button>
            <button 
              className="btn-action"
              onClick={handleRotate}
              title="Rotate node"
            >
              Rotate
            </button>
          </div>
          {showColorPicker && (
            <div className="color-picker-container" ref={colorPickerRef}>
              <HexColorPicker color={color} onChange={setColor} />
              <button 
                className="btn-apply-color"
                onClick={applyColor}
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
