import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [schemePercentage, setSchemePercentage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://britspl.coregenie.com/webapi.php');
        setData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  const headers = ['Name', 'MRP', 'Net', 'RM %', 'PTR', 'Brand'];

  const mapDataToHeaders = (item) => {
    const ptr = parseFloat(item['Selling Price tax'] || 0);
    const scheme = parseFloat(schemePercentage || 0);
    const net = (ptr - (ptr * scheme / 100)).toFixed(2);

    return {
      'Name': item['Material No Desc'] || '',
      'MRP': item['MRP'] || '',
      'Net': net,
      'RM %': item['Retailer Margin'] || '',
      'PTR': item['Selling Price tax'] || '',
      'Brand': item['Sub Brand Desc'] || ''
    };
  };

  const handleSchemePercentageChange = (e) => {
    setSchemePercentage(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(item =>
    item['Material No Desc'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Britannia - Scheme Price List</h1>
      </header>
      <main>
        <div className="input-fields">
          <div className="input-group scheme-input">
            <label htmlFor="schemePercentage">Scheme Percentage: %</label>
            <input
              type="number"
              id="schemePercentage"
              value={schemePercentage}
              onChange={handleSchemePercentageChange}
              step="0.01"
            />
          </div>
          <div className="input-group search-input">
            <label htmlFor="search">Search by Name:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter name to search"
            />
          </div>
        </div>
        <div className="table-container">
          <table className="responsive-table">
            <thead className='sticky-header'>
              <tr className='tableHead'>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const mappedItem = mapDataToHeaders(item);
                return (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td key={header} className={header === 'Net' ? 'net-value' : ''}>
                        {mappedItem[header]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
