require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is not set in environment.');
    process.exit(1);
  }

  // Option 1: Try using the SDK (if it supports listModels, which acts as a wrapper)
  // Converting to REST call pattern since SDK method for listing models might be tricky in older versions or specific setups, 
  // but let's try the direct REST API for clarity on what is actually available.
  
  console.log('Checking available models via REST API...');

  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (response.data && response.data.models) {
      console.log('\nAvailable Models:');
      response.data.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName}): ${model.description}`);
      });
      
      console.log('\nRecommended models for this app:');
      const flash = response.data.models.find(m => m.name.includes('flash'));
      const pro = response.data.models.find(m => m.name.includes('pro'));
      
      if (flash) console.log(`FAST: ${flash.name}`);
      if (pro) console.log(`SMART: ${pro.name}`);

    } else {
      console.log('No models found in response.');
    }
  } catch (error) {
    console.error('Error fetching models:', error.response ? error.response.data : error.message);
  }
}

listModels();
