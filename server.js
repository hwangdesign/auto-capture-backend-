const express = require('express');
const path = require('path');
const fs = require('fs');
const { captureMobileScreenshot } = require('./capture');

const app = express();
const PORT = 3000;

// 🗂 screenshots 디렉토리 보장
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
  console.log('📁 Created screenshots directory');
}

// 🖼 정적 이미지 서빙 경로 설정
app.use('/screenshots', express.static(screenshotsDir));

// 📸 캡처 API 엔드포인트
app.get('/capture', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    console.warn('⚠️ No URL provided');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`📸 Capturing URL: ${url}`);
    const fileName = await captureMobileScreenshot(url);
    const imageUrl = `${req.protocol}://${req.get('host')}/screenshots/${fileName}`;
    console.log(`✅ Screenshot available at: ${imageUrl}`);
    res.json({ imageUrl });
  } catch (err) {
    console.error('❌ Capture failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
