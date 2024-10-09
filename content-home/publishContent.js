const contentful = require('contentful-management');
require('dotenv').config()

// Replace these with your actual Contentful credentials
const SPACE_ID = process.env.CONTENTFUL_SPACE;
const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID // or your environment ID
const CONTENT_TYPE_ID = process.env.CONTENT_TYPE_ID

// Initialize the Contentful client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
  });

  // Function to create and publish an entry
async function createAndPublishEntry() {
  try {
    // Get the space
    const space = await client.getSpace(SPACE_ID);

    // Get the environment
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // Create a new entry
    const entry = await environment.createEntry(CONTENT_TYPE_ID, {
      fields: {
        // Replace with your actual fields and values
        playerName: {
          'en-US': 'Anil Kumble',
        },
        description: {
          'en-US': 'Excellent Indian Leg spineer',
        },
      },
    });

    // Publish the entry
    const publishedEntry = await entry.publish();

    console.log('Entry published successfully:', publishedEntry);
  } catch (error) {
    console.error('Error creating or publishing entry:', error);
  }
}

// Call the function to create and publish the entry
createAndPublishEntry();