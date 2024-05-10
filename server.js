const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const baseUrl = "http://localhost:3000/"; // Replace with your actual base URL
let shortCodeMap = {}; // Stores mapping of long URLs to short codes

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to encode URL
app.post("/encode", (req, res) => {
  const longURL = req.body.longURL;

  // Basic validation for URL format (can be improved)
  if (!/^https?:\/\/.+/.test(longURL)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // Generate a unique random alphanumeric string for short code
  let shortCode;
  do {
    shortCode = generateRandomString(6); // Customize the length here
  } while (shortCodeMap[shortCode]);

  // Store the mapping and return the shortened URL
  shortCodeMap[shortCode] = longURL;
  const shortenedURL = baseUrl + shortCode;
  res.json({ shortenedURL });
});

// Endpoint to decode URL and redirect
app.get("/:shortCode", (req, res) => {
  const shortCode = req.params.shortCode;
  const longURL = shortCodeMap[shortCode];

  if (!longURL) {
    return res.status(404).json({ error: "Invalid shortened URL" });
  }

  // Redirect user to the original long URL
  res.redirect(longURL);
});

// Generate random string
function generateRandomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
