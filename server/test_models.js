const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
      console.error("No API KEY found in .env");
      return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log(`Fetching models from ${url}...`);
    
    // We mask the key in the log if we were logging the URL, but here we just use it.
    const response = await axios.get(url);
    
    if (response.data && response.data.models) {
        console.log("Available Models:");
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${m.name}`);
            }
        });
    } else {
        console.log("No models found in response.");
    }

  } catch (error) {
    console.error("HTTP Request Error:", error.message);
    if (error.response) {
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

listModels();
