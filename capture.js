const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function captureMobileScreenshot(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 390,  // iPhone 14 Pro 기준
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
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    const fileName = `${uuidv4()}.png`;
    const filePath = path.resolve(__dirname, 'screenshots', fileName);

    await page.screenshot({ path: filePath, fullPage: true });
    await browser.close();
    return fileName;
  } catch (error) {
    console.error('❌ Error during capture:', error);
    await browser.close();
    throw new Error(`Capture failed: ${error.message}`);
  }
}

module.exports = { captureMobileScreenshot };
