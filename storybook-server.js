// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6006;

// Basic authentication middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Storybook"');
    return res.status(401).send('Authentication required');
  }

  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64')
    .toString()
    .split(':');

  const validUser = process.env.BASIC_AUTH_USER;
  const validPass = process.env.BASIC_AUTH_PASSWORD;

  if (username === validUser && password === validPass) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Storybook"');
    res.status(401).send('Invalid credentials');
  }
});

// Serve Storybook static files with index fallback
app.use(express.static(path.join(__dirname, 'storybook-static'), {
  index: 'index.html',
  extensions: ['html']
}));

app.listen(PORT, () => {
  console.log(`Protected Storybook server running on http://localhost:${PORT}`);
});

module.exports = app;
