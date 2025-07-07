const express = require('express');
const path = require('path');
const { captureMobileScreenshot } = require('./capture');

const app = express();
const PORT = 3000;

app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

app.get('/capture', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const fileName = await captureMobileScreenshot(url);
    const imageUrl = `${req.protocol}://${req.get('host')}/screenshots/${fileName}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
