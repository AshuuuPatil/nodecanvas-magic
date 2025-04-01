import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { nanoid } from 'nanoid';

// Initial nodes with modifications (removed note bubble)
const initialNodes = [
  {
    id: '1',
    type: 'grantorNode',
    position: { x: 350, y: 50 },
    data: { 
      label: 'Grantor',
      note: 'Click to edit notes'
    },
    style: { backgroundColor: '#9b87f5', width: 180, height: 60 }
  },
  {
    id: '2',
    type: 'instrumentNode',
    position: { x: 350, y: 180 },
    data: { 
      label: 'Instrument Type',
      details: [
        'Execution Date',
        'Effective Date',
        'Filed Date',
        'Transfered Rights'
      ],
      note: 'Additional notes can be added here'
    },
    style: { backgroundColor: '#f5f5f5', border: '1px solid #ccc', width: 220, height: 'auto' }
  },
  {
    id: '7',
    type: 'granteeNode',
    position: { x: 150, y: 400 },
    data: { 
      label: 'Grantee',
      note: 'Click to edit notes'
    },
    style: { backgroundColor: '#7E69AB', width: 180, height: 60 }
  },
  {
    id: '8',
    type: 'granteeNode',
    position: { x: 350, y: 400 },
    data: { 
      label: 'Grantee',
      note: 'Click to edit notes'
    },
    style: { backgroundColor: '#7E69AB', width: 180, height: 60 }
  },
  {
    id: '9',
    type: 'granteeNode',
    position: { x: 550, y: 400 },
    data: { 
      label: 'Grantee',
      note: 'Click to edit notes'
    },
    style: { backgroundColor: '#6E59A5', width: 180, height: 60 }
  },
  {
    id: '10',
    type: 'retainedRightsNode',
    position: { x: 750, y: 400 },
    data: { 
      label: 'Grantee (Also Grantor)',
      details: [
        '(Grantor with Retained Rights use dotted line.',
        'This depicts ongoing ownership interest after',
        'assignment)'
      ],
      note: 'Click to edit notes'
    },
    style: { backgroundColor: '#7E69AB', width: 180, height: 90 }
  },
];

// Initial edges (unchanged)
const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'custom',
    animated: false,
    style: { stroke: '#000' },
    data: { type: 'default' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#ea384c' },
    data: { type: 'death' }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#FFD700' },
    data: { type: 'affidavit' }
  },
  { 
    id: 'e2-5', 
    source: '2', 
    target: '5', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#1EAEDB' },
    data: { type: 'obituary' }
  },
  { 
    id: 'e2-6', 
    source: '2', 
    target: '6', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#4CAF50' },
    data: { type: 'adoption' }
  },
  { 
    id: 'e2-7', 
    source: '2', 
    target: '7', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' },
    data: { type: 'default' }
  },
  { 
    id: 'e2-8', 
    source: '2', 
    target: '8', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' },
    data: { type: 'default' }
  },
  { 
    id: 'e2-9', 
    source: '2', 
    target: '9', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' },
    data: { type: 'default' }
  },
  { 
    id: 'e2-10', 
    source: '2', 
    target: '10', 
    type: 'dashed',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' },
    data: { type: 'default' }
  },
];

// Sample data for the table
const fileData = [
  {
    "id": 4155,
    "project_id_x": 167,
    "file_name": "file_2220",
    "ocr_status": "completed",
    "instrument_type": "Release",
    "volume_page": "none found",
    "document_case": "none found",
    "execution_date": "1939-12-23 00:00:00",
    "effective_date": null,
    "file_date": "1940-02-15 00:00:00",
    "file_id": 2220,
    "user_id_x": 2,
    "grantor": "W. H. Mannes",
    "grantee": "Tom Petrucha and Julia Petrucha",
    "remarks": null,
    "property_description": "The East 50 acres of the 165.3 acre tract in the D. McFarland League, and the East 766 acres of the 1316 acre tract in the F. W. Dempsey Survey.",
    "project_id_y": 167,
    "user_id_y": 2,
    "s3_url": "https://titlemine-app.s3.amazonaws.com/runsheet_documents/2025-03-27_02%3A40%3A49_67e4bab1e671c.pdf",
    "original_file_name": "DR 132-459 Rel OGL 1481.3Ac.pdf"
  },
  {
    "id": 4156,
    "project_id_x": 167,
    "file_name": "file_2221",
    "ocr_status": "completed",
    "instrument_type": "Affidavit",
    "volume_page": "none found",
    "document_case": "#48937-Affidavit",
    "execution_date": "1951-06-02 00:00:00",
    "effective_date": null,
    "file_date": "1951-06-12 00:00:00",
    "file_id": 2221,
    "user_id_x": 2,
    "grantor": "Ella Gibson et al",
    "grantee": "Allen Hoppe",
    "remarks": null,
    "property_description": "Quitclaimed property in Matagorda County, Texas for $10.00.",
    "project_id_y": 167,
    "user_id_y": 2,
    "s3_url": "https://titlemine-app.s3.amazonaws.com/runsheet_documents/2025-03-27_02%3A40%3A50_67e4bab2236e0.pdf",
    "original_file_name": "DR 225-368 DR Affidavit.pdf"
  },
  {
    "id": 4318,
    "project_id_x": 167,
    "file_name": "file_2283",
    "ocr_status": "Completed",
    "instrument_type": "Deed",
    "volume_page": "9/229",
    "document_case": "No.1 16512",
    "execution_date": "1902-05-21 00:00:00",
    "effective_date": null,
    "file_date": "1902-05-23 00:00:00",
    "file_id": 2283,
    "user_id_x": 2,
    "grantor": "Joseph Petrucio and Catherine Mary Petrucio",
    "grantee": "Thomas Petrucio",
    "remarks": null,
    "property_description": "A tract of 476 acres of the Francis H. Dempsey league, along with additional specified parcels in Matagorda County.",
    "project_id_y": 167,
    "user_id_y": 2,
    "s3_url": "https://titlemine-app.s3.amazonaws.com/runsheet_documents/2025-03-28_06%3A48%3A00_67e64620b715e.pdf",
    "original_file_name": "DR 9-229 Petrucha Deed.pdf"
  },
  {
    "id": 4319,
    "project_id_x": 167,
    "file_name": "file_2284",
    "ocr_status": "Completed",
    "instrument_type": "Deed",
    "volume_page": "1331/150",
    "document_case": "none found",
    "execution_date": "1975-12-16 00:00:00",
    "effective_date": null,
    "file_date": "1976-01-05 00:00:00",
    "file_id": 2284,
    "user_id_x": 2,
    "grantor": "W. C. King and Nancy E. King",
    "grantee": "Joe C. King and Katie Mae King",
    "remarks": null,
    "property_description": "3.086 acres of land in the Elihu Reynolds Survey, Abstract No. 1008, the Juan Armendaris Survey, Abstract No. 39, and the J. C. Marshall Survey, Abstract No. 825, Grayson County, Texas.",
    "project_id_y": 167,
    "user_id_y": 2,
    "s3_url": "https://titlemine-app.s3.amazonaws.com/runsheet_documents/2025-03-28_06%3A48%3A00_67e64620f3660.pdf",
    "original_file_name": "1331_150_Grayson County.pdf"
  }
];

// Create the store
const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  fileData: fileData,
  
  // Apply node changes
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    // Mark that we have unsaved changes
  },
  
  // Apply edge changes
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    // Mark that we have unsaved changes
  },
  
  // Connect nodes with edges
  onConnect: (connection) => {
    // Get source and target nodes to determine if we should allow the connection
    const sourceNode = get().nodes.find(node => node.id === connection.source);
    const targetNode = get().nodes.find(node => node.id === connection.target);
    
    // Prevent connections from regular grantee nodes (but allow from retained rights grantee)
    if (sourceNode && sourceNode.type === 'granteeNode' && 
        !(sourceNode.data.label && sourceNode.data.label.includes('Also Grantor'))) {
      return;
    }
    
    // Get target node to determine edge color based on node type
    let edgeData = { type: 'default' };
    
    if (targetNode) {
      if (targetNode.type === 'bubbleNode' && targetNode.data.type) {
        edgeData.type = targetNode.data.type;
      }
    }
    
    set({
      edges: addEdge({
        ...connection,
        type: 'custom',
        animated: false,
        data: edgeData,
        style: { stroke: '#000' }
      }, get().edges),
    });
  },
  
  // Add a new node
  addNode: (type, position, data) => {
    const newNode = {
      id: nanoid(),
      type,
      position,
      data,
      style: {}
    };
    
    // Apply default styling based on node type
    switch (type) {
      case 'grantorNode':
        newNode.style = { 
          backgroundColor: '#9b87f5', 
          width: 180, 
          height: 'auto',
          minHeight: 60
        };
        break;
      case 'granteeNode':
        newNode.style = { 
          backgroundColor: '#7E69AB', 
          width: 180, 
          height: 'auto',
          minHeight: 60
        };
        break;
      case 'instrumentNode':
        newNode.style = { 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ccc', 
          width: 220, 
          height: 'auto',
          minHeight: 130
        };
        break;
      case 'retainedRightsNode':
        newNode.style = { 
          backgroundColor: '#7E69AB', 
          width: 180, 
          height: 'auto',
          minHeight: 90
        };
        break;
      case 'bubbleNode':
        newNode.style = { 
          width: 120, 
          height: 'auto',
          minHeight: 80,
          borderRadius: '0'
        };
        break;
      default:
        break;
    }
    
    set({
      nodes: [...get().nodes, newNode],
    });
  },
  
  // Update node data
  updateNodeData: (nodeId, key, value) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value
            }
          };
        }
        return node;
      })
    });
  },
  
  // Convert node type
  convertNodeType: (nodeId, newType, newData) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            type: newType,
            data: {
              ...node.data,
              ...newData
            },
            style: {
              ...node.style,
              // Adjust style based on new type
              ...(newType === 'bubbleNode' ? { 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                width: 150,
                height: 'auto',
                minHeight: 80
              } : {})
            }
          };
        }
        return node;
      })
    });
  },
  
  // Update edge data
  updateEdgeData: (edgeId, key, value) => {
    set({
      edges: get().edges.map(edge => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              [key]: value
            }
          };
        }
        return edge;
      })
    });
  },
  
  // Set node color
  setNodeColor: (id, color) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            style: {
              ...node.style,
              backgroundColor: color,
            },
          };
        }
        return node;
      }),
    });
  },
  
  // Set edge color
  setEdgeColor: (id, color) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: color,
            },
          };
        }
        return edge;
      }),
    });
  },
  
  // Rotate node
  rotateNode: (id) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          const currentRotate = node.style?.transform 
            ? parseInt(node.style.transform.match(/rotate\((\d+)deg\)/)?.[1] || 0) 
            : 0;
          
          const newRotate = (currentRotate + 45) % 360;
          
          return {
            ...node,
            style: {
              ...node.style,
              transform: `rotate(${newRotate}deg)`,
            },
          };
        }
        return node;
      }),
    });
  },
  
  // Reset the flow
  resetFlow: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
    });
  },
  
  // Load a saved flow
  loadFlow: (flow) => {
    set({
      nodes: flow.nodes || [],
      edges: flow.edges || [],
    });
  },
  
  // Set the nodes and edges directly
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  // Get file by ID
  getFileById: (id) => {
    return get().fileData.find(file => file.id === id);
  },
  
  // Save flow to localStorage
  saveFlowToLocalStorage: (fileId, nodes, edges) => {
    try {
      const flowData = {
        id: fileId,
        nodes,
        edges,
        timestamp: new Date().toISOString()
      };
      
      // Get existing saved flows
      const savedFlowsString = localStorage.getItem('savedFlows');
      let savedFlows = savedFlowsString ? JSON.parse(savedFlowsString) : {};
      
      // Add or update this flow
      savedFlows[fileId] = flowData;
      
      // Save back to localStorage
      localStorage.setItem('savedFlows', JSON.stringify(savedFlows));
      
      return true;
    } catch (error) {
      console.error('Error saving flow:', error);
      return false;
    }
  },
  
  // Load flow from localStorage
  loadFlowFromLocalStorage: (fileId) => {
    try {
      const savedFlowsString = localStorage.getItem('savedFlows');
      if (!savedFlowsString) return null;
      
      const savedFlows = JSON.parse(savedFlowsString);
      return savedFlows[fileId] || null;
    } catch (error) {
      console.error('Error loading flow:', error);
      return null;
    }
  },
  
  // Get all saved flows
  getAllSavedFlows: () => {
    try {
      const savedFlowsString = localStorage.getItem('savedFlows');
      if (!savedFlowsString) return [];
      
      const savedFlows = JSON.parse(savedFlowsString);
      return Object.values(savedFlows);
    } catch (error) {
      console.error('Error getting saved flows:', error);
      return [];
    }
  }
}));

export default useStore;
