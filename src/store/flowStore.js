import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { nanoid } from 'nanoid';

// Initial nodes with only the instrument node
const initialNodes = [
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
  }
];

// Initial edges (empty)
const initialEdges = [];

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
  currentFile: null,
  
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
  
  // Get current file
  getCurrentFile: () => {
    return get().currentFile;
  },
  
  // Set current file
  setCurrentFile: (file) => {
    set({ currentFile: file });
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
          backgroundColor: '#4a9af5', 
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
  
  // Remove a node
  removeNode: (nodeId) => {
    // Remove the node
    set({
      nodes: get().nodes.filter(node => node.id !== nodeId),
    });
    
    // Remove all connected edges
    set({
      edges: get().edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
  
  // Remove an edge
  removeEdge: (edgeId) => {
    set({
      edges: get().edges.filter(edge => edge.id !== edgeId),
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
  
  // Reset the flow
  resetFlow: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
    });
  },
  
  // Create initial nodes for a specific file
  createInitialNodesForFile: (file) => {
    const formattedExecDate = file.execution_date ? new Date(file.execution_date).toLocaleDateString() : 'N/A';
    const formattedEffectiveDate = file.effective_date ? new Date(file.effective_date).toLocaleDateString() : 'N/A';
    const formattedFileDate = file.file_date ? new Date(file.file_date).toLocaleDateString() : 'N/A';
    
    // For initial load or reset, we only want to show the instrument node
    const instrumentNode = {
      id: `instrument-${file.id}`,
      type: 'instrumentNode',
      position: { x: 350, y: 180 },
      data: { 
        label: file.instrument_type || 'Instrument Type',
        details: [
          `Execution Date: ${formattedExecDate}`,
          `Effective Date: ${formattedEffectiveDate}`,
          `Filed Date: ${formattedFileDate}`,
          'Transfered Rights'
        ],
        note: file.property_description || '',
        s3Url: file.s3_url || ''
      },
      style: { backgroundColor: '#f5f5f5', border: '1px solid #ccc', width: 250, height: 'auto' }
    };
    
    // Set the current file
    set({ currentFile: file });
    
    // Load existing charts if available
    const savedFlows = get().getAllSavedFlows();
    let allNodes = [instrumentNode];
    let allEdges = [];
    
    // Position offset for each chart
    let offsetX = 0;
    
    // Include previously saved charts
    Object.values(savedFlows).forEach(flow => {
      if (flow.id !== file.id) {
        // Add prefix to ensure unique IDs
        const prefixedNodes = flow.nodes.map(node => ({
          ...node,
          id: `${flow.id}-${node.id}`,
          position: {
            x: node.position.x + offsetX,
            y: node.position.y
          }
        }));
        
        // Update edge source and target IDs with the prefix
        const prefixedEdges = flow.edges.map(edge => ({
          ...edge,
          id: `${flow.id}-${edge.id}`,
          source: `${flow.id}-${edge.source}`,
          target: `${flow.id}-${edge.target}`
        }));
        
        allNodes = [...allNodes, ...prefixedNodes];
        allEdges = [...allEdges, ...prefixedEdges];
        
        // Increase offset for next chart
        offsetX += 600;
      }
    });
    
    set({
      nodes: allNodes,
      edges: allEdges
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
    return get().fileData.find(file => file.id === parseInt(id));
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
      if (!savedFlowsString) return {};
      
      const savedFlows = JSON.parse(savedFlowsString);
      return savedFlows;
    } catch (error) {
      console.error('Error getting saved flows:', error);
      return {};
    }
  }
}));

export default useStore;
