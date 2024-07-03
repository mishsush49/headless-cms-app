import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9000/contentful')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setData([]);
      });
  }, []);

  return (
    <div className="App">
      <h1>Contentful Data</h1>
      <div>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h2>{item.fields.title}</h2> {/* Assuming each item has a title */}
            <p>{item.fields.description}</p> {/* Assuming each item has a description */}
            {/* Display an image if it exists */}
            {item.fields.image && (
              <img src={item.fields.image.fields.file.url} alt={item.fields.title} style={{ maxWidth: '100%' }} />
            )}
            {/* You can add more fields here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;