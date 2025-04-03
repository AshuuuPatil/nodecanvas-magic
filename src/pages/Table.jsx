// ashu 
// ashu 
// ashu 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/flowStore';
import '../styles/Table.css';

const Table = () => {
  const { fileData } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = fileData.filter(file => 
    file.instrument_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.grantor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.grantee.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // const handleGenerateChart = (id) => {
  //   navigate(`/chart/${id}`);
  // };

  const handleGenerateChart = (id) => {
  let savedCharts = JSON.parse(localStorage.getItem("savedCharts")) || [];
  
  // Check if row ID already exists in savedCharts
  if (!savedCharts.includes(id)) {
    savedCharts.push(id);
    localStorage.setItem("savedCharts", JSON.stringify(savedCharts));
  }

  navigate(`/chart/${id}`);
};


  
  
  return (
    <div className="table-container">
      <div className="table-header">
        <h1>Document Database</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by instrument type, grantor, or grantee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Instrument Type</th>
              <th>Volume/Page</th>
              <th>Document Case</th>
              <th>Execution Date</th>
              <th>Effective Date</th>
              <th>File Date</th>
              <th>Grantor</th>
              <th>Grantee</th>
              <th>Property Description</th>
              <th>Generate Chart</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.instrument_type}</td>
                <td>{file.volume_page}</td>
                <td>{file.document_case}</td>
                <td>{file.execution_date ? new Date(file.execution_date).toLocaleDateString() : '-'}</td>
                <td>{file.effective_date ? new Date(file.effective_date).toLocaleDateString() : '-'}</td>
                <td>{file.file_date ? new Date(file.file_date).toLocaleDateString() : '-'}</td>
                <td>{file.grantor}</td>
                <td>{file.grantee}</td>
                <td className="property-description">{file.property_description}</td>
                <td>
                  <button 
                    className="generate-chart-btn" 
                    onClick={() => handleGenerateChart(file.id)}
                  >
                    Add TO Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
