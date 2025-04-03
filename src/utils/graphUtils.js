// const createInitialNodes = useCallback((file) => {
// // Create initial nodes for the chart
// const initialNodes = [
//     {
//     id: 'instrument',
//     type: 'instrumentNode',
//     position: { x: 350, y: 100 },
//     data: { 
//         label: file.instrument_type,
//         details: [
//         `Execution Date: ${file.execution_date ? new Date(file.execution_date).toLocaleDateString() : 'N/A'}`,
//         `Effective Date: ${file.effective_date ? new Date(file.effective_date).toLocaleDateString() : 'N/A'}`,
//         `Filed Date: ${file.file_date ? new Date(file.file_date).toLocaleDateString() : 'N/A'}`,
//         `Transfered Rights`
//         ],
//         note: file.property_description || 'Additional notes can be added here',
//         s3Url: file.s3_url || '',
//         viewButton: () => {
//         // Define the action for the "View" button
//         window.open(file.s3_url, '_blank');
//         },
//         menuOptions: [
//         'Death Certificate',
//         'Affidavit of Heirship',
//         'Obituary',
//         'Adoption'
//         ]
//     },
//     style: { 
//         backgroundColor: '#f5f5f5', 
//         border: '1px solid #ccc', 
//         width: 250, 
//         height: 'auto',
//         position: 'relative' // Ensure relative positioning for the button
//     },
//     }
// ];

// // Create initial edges (empty at first)
// const initialEdges = [];

// // Set the nodes and edges in the store
// setNodes(initialNodes);
// setEdges(initialEdges);
// }, [setNodes, setEdges]);



export const createInitialNodes = (file) => {
    if (!file) {
        console.error("File data is missing in createInitialNodes");
        return { initialNodes: [], initialEdges: [] }; // Return empty nodes and edges if file is undefined
    }
    
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
        `Transfered Rights`,
        ],
        note: file.property_description || 'Additional notes can be added here',
        s3Url: file.s3_url || '',
        viewButton: () => {
        window.open(file.s3_url, '_blank');
        },
        menuOptions: ['Death Certificate', 'Affidavit of Heirship', 'Obituary', 'Adoption'],
    },
    style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        width: 250,
        height: 'auto',
    },
    },
];

const initialEdges = [];
return { initialNodes, initialEdges };
};