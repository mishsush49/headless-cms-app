const express = require('express');
const contentful = require('contentful');
const cors = require('cors');


const app = express();
app.use(cors());
const port = 9000;

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

app.get('/contentful', (req, res) => {
    client.getEntries()
      .then((response) => res.send(response.items))
      .catch((error) => {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from Contentful');
      });
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });