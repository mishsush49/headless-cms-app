require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const { Configuration, OpenAIApi, default: OpenAI } = require("openai");
const contentful = require('contentful-management');
const contentShow = require('contentful');
// Replace these with your actual Contentful credentials
const SPACE_ID = process.env.CONTENTFUL_SPACE;
const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID // or your environment ID
const CONTENT_TYPE_ID = process.env.CONTENT_TYPE_ID


app.use(cors());
app.use(express.json());

// Load the API key from the .env file
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Initialize the Contentful client
const contentFulClient = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
});

app.post('/generate-content', async (req, res) => {
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'Player name is required' });
  }

//  const { prompt, systemMessage } = req.body;

  const prompt = `{ "prompt": "Please share information about ${playerName} in following format: 1. Player Name 2. description i.e what is his background, some 2 lines about that player , 3. What is his role in team, which should not be more than 5 words". This generated response should not have anything else than PlayerName, Description and Role. It should not be Player name, just PlayerName}`;

  //console.log(prompt);

  try {
   // console.log('01');
    const completions = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are an expert AI assistant" },
            { role: "user", content: prompt || "" }
          ]
        });
     //console.log('11');
      // Extract the generated text from the response
     //console.log(completions.choices[0].message);
     const generatedText = completions.choices[0].message.content.trim();
  
      // Send the generated text as the response
      res.json({ generatedText });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: 'Error generating text' });
  }
});

app.post('/publish-content', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    //console.log('Received content:', content);
    const { PlayerName, Description, Role } = content;
    console.log('PlayerName ::', PlayerName);
    console.log('Description ::', Description);
    console.log('Role ::', Role);
    // Get the space
    const space = await contentFulClient.getSpace(SPACE_ID);

    // Get the environment
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // Create a new entry
    const entry = await environment.createEntry(CONTENT_TYPE_ID, {
      fields: {
        // Replace with your actual fields and values
        playerName: {
          'en-US': `${PlayerName}`,
        },
        description: {
          'en-US': `${Description}`,
        },
        role: {
          'en-US': `${Role}`,
        },
      },
    });

    // Publish the entry
    const publishedEntry = await entry.publish();
    
    res.status(200).json({ message: 'Content published successfully', entry: publishedEntry });
    console.log('Entry published successfully:', publishedEntry);

    
  } catch (error) {
    console.error('Error creating or publishing entry:', error);
    console.error('Error creating or publishing entry:', error);
    res.status(500).json({ error: 'Failed to publish content' });
  }
});



app.get('/show-all-contents', (req, res) => {
  contentShow.createClient({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  }).getEntries()
      .then((response) => res.send(response.items))
      .catch((error) => {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from Contentful');
      });
  });



app.listen(port, () => {
  console.log(`Server running at http://localhost:5000`);
});
