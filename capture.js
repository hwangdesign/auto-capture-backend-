const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function captureMobileScreenshot(url) {
  console.log('🌐 URL to capture:', url);

  const screenshotsDir = path.resolve(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
    console.log('📁 Created screenshots directory');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'], // GitHub Actions 등 CI 환경에서 필수
    defaultViewport: {
      width: 390,
      height: 844,
      isMobile: true
    }
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) ' +
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  );

  try {
    console.log('🕒 Navigating to page...');
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000 // 60초로 증가
    });

    await page.waitForTimeout(5000); // 추가 로딩 대기 (ZARA 등 애니메이션 대비)

    const fileName = `${uuidv4()}.png`;
    const filePath = path.join(screenshotsDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log('✅ Screenshot saved at:', filePath);

    await browser.close();
    return fileName;
  } catch (error) {
    console.error('❌ Error during capture:', error.message);
    await browser.close();
    throw new Error(`Capture failed: ${error.message}`);
  }
}

module.exports = { captureMobileScreenshot };
