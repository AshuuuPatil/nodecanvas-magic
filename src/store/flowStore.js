
import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { nanoid } from 'nanoid';

// Initial nodes based on the provided image
const initialNodes = [
  {
    id: '1',
    type: 'grantorNode',
    position: { x: 350, y: 50 },
    data: { label: 'Grantor' },
    style: { backgroundColor: '#4a90e2', width: 180, height: 60 }
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
        '-User Notes-',
        'Transfered Rights'
      ]
    },
    style: { backgroundColor: '#f5f5f5', border: '1px solid #ccc', width: 220, height: 130 }
  },
  {
    id: '3',
    type: 'bubbleNode',
    position: { x: 600, y: 110 },
    data: { 
      label: 'Death Certificate',
      details: '• Details'
    },
    style: { width: 120, height: 80 }
  },
  {
    id: '4',
    type: 'bubbleNode',
    position: { x: 600, y: 160 },
    data: { 
      label: 'Affidavit of Heirship',
      details: '• Details'
    },
    style: { width: 120, height: 80 }
  },
  {
    id: '5',
    type: 'bubbleNode',
    position: { x: 600, y: 210 },
    data: { 
      label: 'Obituary',
      details: '• Details'
    },
    style: { width: 120, height: 70 }
  },
  {
    id: '6',
    type: 'bubbleNode',
    position: { x: 600, y: 270 },
    data: { 
      label: 'Adoption / Divorce',
      details: '• Details'
    },
    style: { width: 120, height: 80 }
  },
  {
    id: '7',
    type: 'granteeNode',
    position: { x: 150, y: 400 },
    data: { label: 'Grantee' },
    style: { backgroundColor: '#4a90e2', width: 180, height: 60 }
  },
  {
    id: '8',
    type: 'granteeNode',
    position: { x: 350, y: 400 },
    data: { label: 'Grantee' },
    style: { backgroundColor: '#4a90e2', width: 180, height: 60 }
  },
  {
    id: '9',
    type: 'granteeNode',
    position: { x: 550, y: 400 },
    data: { label: 'Grantee' },
    style: { backgroundColor: '#4a90e2', width: 180, height: 60 }
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
      ]
    },
    style: { backgroundColor: '#4a90e2', width: 180, height: 90 }
  },
  {
    id: '11',
    type: 'bubbleNode',
    position: { x: 660, y: 50 },
    data: { 
      label: 'Assignments are the "Instrument Type" and Evidence are in these bubbles to the side.',
      details: '',
      isNote: true
    },
    style: { 
      backgroundColor: '#fef7cd', 
      border: '1px solid #e8d85b',
      width: 160,
      height: 80 
    }
  },
];

// Initial edges based on the provided image
const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'custom',
    animated: false,
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-5', 
    source: '2', 
    target: '5', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-6', 
    source: '2', 
    target: '6', 
    type: 'custom',
    animated: false,
    sourceHandle: 'right',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-7', 
    source: '2', 
    target: '7', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-8', 
    source: '2', 
    target: '8', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-9', 
    source: '2', 
    target: '9', 
    type: 'custom',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' }
  },
  { 
    id: 'e2-10', 
    source: '2', 
    target: '10', 
    type: 'dashed',
    animated: false,
    sourceHandle: 'bottom',
    style: { stroke: '#000' }
  },
];

// Create the store
const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  
  // Apply node changes
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  // Apply edge changes
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  // Connect nodes with edges
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'custom',
        animated: false,
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
      case 'granteeNode':
        newNode.style = { 
          backgroundColor: '#4a90e2', 
          width: 180, 
          height: 60 
        };
        break;
      case 'instrumentNode':
        newNode.style = { 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ccc', 
          width: 220, 
          height: 130 
        };
        break;
      case 'retainedRightsNode':
        newNode.style = { 
          backgroundColor: '#4a90e2', 
          width: 180, 
          height: 90 
        };
        break;
      case 'bubbleNode':
        newNode.style = { 
          width: 120, 
          height: 80 
        };
        break;
      default:
        break;
    }
    
    set({
      nodes: [...get().nodes, newNode],
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
}));

export default useStore;
