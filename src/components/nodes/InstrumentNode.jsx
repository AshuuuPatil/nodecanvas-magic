// Ashu 
// Ashu 
// Ashu
// Ashu

import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const InstrumentNode = ({ data, isConnectable, selected, style }) => {
  const [label, setLabel] = useState(data.label || 'Instrument Type');
  const [details, setDetails] = useState(data.details || []);
  const [note, setNote] = useState(data.note || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Toggle menu dropdown
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

    // Handle selection of a menu item
    const handleSelection = (option) => {
      setSelectedOption(option);
      setMenuOpen(false);
    };
  
  // Update the label
  const handleLabelChange = (e) => {
    const newLabel = e.target.innerText;
    setLabel(newLabel);
    if (data.onLabelChange) {
      data.onLabelChange(newLabel);
    }
  };
  
  // Update a detail item
  const handleDetailChange = (index, e) => {
    const newDetails = [...details];
    newDetails[index] = e.target.innerText;
    setDetails(newDetails);
    if (data.onDetailsChange) {
      data.onDetailsChange(newDetails);
    }
  };
  
  // Update the note
  const handleNoteChange = (e) => {
    const newNote = e.target.innerText;
    setNote(newNote);
    if (data.onNoteChange) {
      data.onNoteChange(newNote);
    }
  };



  // ashu 
  return (
    <div className="instrument-node" style={style}>
      <NodeResizer 
        minWidth={180} 
        minHeight={100}
        isVisible={selected}
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      
      <div className="node-content" >
        <div 
          className="node-label editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleLabelChange}
        >
          {label}
        </div>
        {details && (
          <div className="node-details">
            {details.map((detail, index) => (
              <div 
                key={index} 
                className="detail-item editable-content"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleDetailChange(index, e)}
              >
                {detail}
              </div>
            ))}
          </div>
        )}
        <div 
          className="node-note editable-content"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleNoteChange}
          placeholder="Add notes..."
        >
          {note}
        </div>

{/* Button Container */}
<div className="button-container" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          {data.s3Url && (
            <button
              onClick={() => window.open(data.s3Url, '_blank')}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              View
            </button>
          )}
          
          {/* Menu Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleMenu}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Menu
            </button>
            {menuOpen && (
              <ul style={{
                position: 'absolute',
                top: '25px',
                left: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                listStyle: 'none',
                padding: '5px 0',
                margin: 0,
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                width: '180px',
                textAlign: 'center'
                }}>
                {['Death Certificate', 'Affidavit of Heirship', 'Obituary', 'Adoption'].map((item, index) => (
                  <li
                    key={index}
                    style={{ padding: '8px 10px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    onClick={() => alert(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(InstrumentNode);
