
import { useCallback, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { HexColorPicker } from 'react-colorful';
import { useReactFlow } from '@xyflow/react';
import useStore from '../store/flowStore';
import DraggableNode from './DraggableNode';
import '../styles/ControlPanel.css';
import Chart from '../pages/Chart';

const ControlPanel = ({ reactFlowWrapper, selectedNode, selectedEdge }) => {
  const { getNodes, getEdges, setViewport } = useReactFlow();
  const { resetFlow, setNodeColor, rotateNode, setEdgeColor } = useStore();
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
    //resetFlow();
    createInitialNodes();
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [resetFlow, setViewport]);

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
          {/* <DraggableNode 
            type="bubbleNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Death Certificate',
              details: '• Details',
              type: 'death'
            }}
            label="Death Certificate"
            className="node-bubble"
          />
          <DraggableNode 
            type="bubbleNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Affidavit of Heirship',
              details: '• Details',
              type: 'affidavit'
            }}
            label="Affidavit"
            className="node-bubble"
          />
          <DraggableNode 
            type="bubbleNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Obituary',
              details: '• Details',
              type: 'obituary'
            }}
            label="Obituary"
            className="node-bubble"
          />
          <DraggableNode 
            type="bubbleNode" 
            onDragStart={onDragStart} 
            data={{ 
              label: 'Adoption / Divorce',
              details: '• Details',
              type: 'adoption'
            }}
            label="Adoption"
            className="node-bubble"
          /> */}
        </div>
      </div>

      <div className="panel-section">
        <h3>Actions</h3>
        <div className="action-buttons">
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
            <button 
              className="btn-action"
              onClick={handleRotate}
              title="Rotate node"
            >
              Rotate
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

      {/* <div className="panel-section">
        <h3>Edge Colors</h3>
        <div className="edge-color-guide">
          <div className="edge-color-item">
            <div className="color-swatch death-color"></div>
            <span>Death Certificate</span>
          </div>
          <div className="edge-color-item">
            <div className="color-swatch affidavit-color"></div>
            <span>Affidavit of Heirship</span>
          </div>
          <div className="edge-color-item">
            <div className="color-swatch obituary-color"></div>
            <span>Obituary</span>
          </div>
          <div className="edge-color-item">
            <div className="color-swatch adoption-color"></div>
            <span>Adoption/Divorce</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ControlPanel;
