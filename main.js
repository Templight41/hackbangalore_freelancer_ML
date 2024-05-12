// Import necessary libraries
const natural = require('natural');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Sample dataset
// const upworkData = [
//   { Skill: 'Search Engine Optimization', Keywords: 'SEO|Search engine optimization|Website visibility' },
//   { Skill: 'Data Science', Keywords: 'Data analysis|Machine learning|Data mining' },
//   // Add more rows as needed
// ];

// Initialize tokenizer
// const tokenizer = new natural.WordTokenizer();

const fs = require('fs');
const csv = require('csv-parser');

// Read the CSV file and populate the upworkData array
const upworkData = [];
fs.createReadStream('upwork_dataset.csv')
  .pipe(csv())
  .on('data', (row) => {
    upworkData.push(row);
  })
  .on('end', () => {
    console.log('Upwork dataset loaded:', upworkData.length, 'rows');
    // Start the server after loading the dataset
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });

// Import necessary libraries
const { WordTokenizer, stopwords } = require('natural');
const tokenizer = new WordTokenizer();
const stopWords = new Set(stopwords);


// Words to exclude
const excludedWords = new Set(["experience", "develop", ]);

// Function to perform specific stemming for our use case
function customStem(word) {
  // Remove common suffixes
  const stemmedWord = word
      .replace(/ing$/, '')
      .replace(/s$/, '')
      .replace(/ed$/, '')
      .replace(/ly$/, '')
      .replace(/es$/, '')
      .replace(/er$/, '')
      .replace(/est$/, '');

  // Check for specific cases
  if (/^\d+$/.test(stemmedWord)) { // If the word consists of digits only (e.g., "6")
      return ''; // Exclude numbers
  } else if (stemmedWord.length <= 2) { // If the stemmed word is too short
      return ''; // Exclude short words
  } else {
      return stemmedWord;
  }
}

// Function to extract keywords from the description using NLP techniques
function extractKeywords(description) {
  const keywords = new Set();

  // Tokenize the description
  const tokens = tokenizer.tokenize(description.toLowerCase());

  // Filter out stop words and excluded words
  const filteredTokens = tokens.filter(token => !stopWords.has(token) && !excludedWords.has(token));

  // Iterate through the filtered tokens, perform specific stemming, and add them to the set
  filteredTokens.forEach(token => {
      const stemmedToken = customStem(token);
      if (stemmedToken) {
          keywords.add(stemmedToken);
      }
  });

  return Array.from(keywords);
}


// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route to extract keywords from description
app.post('/extractKeywords', (req, res) => {
  const { description } = req.body;
  console.log('Description:', description); // Log the description
  const keywords = extractKeywords(description);
  res.json({ keywords });
});


// Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
