import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShowAllContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/show-all-contents')
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setData([]);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  return (
    <div className="App">
      <h1>Player List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={tableCellStyle}>Player Name</th>
                <th style={tableCellStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  <td style={tableCellStyle}>{item.fields.playerName}</td>
                  <td style={tableCellStyle}>{item.fields.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableCellStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'left',
};

export default ShowAllContent;