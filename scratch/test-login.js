const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  console.log('Starting debug browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to site...');
    await page.goto('https://code-quality-tracker.bytestechnolab.net', { waitUntil: 'networkidle' });

    // Dump page HTML to check fields
    const html = await page.content();
    fs.writeFileSync('scratch/page-dom.html', html);
    console.log('Saved page HTML to scratch/page-dom.html');

    // Find and list all inputs and buttons
    const inputsInfo = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, button, a')).map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        name: el.getAttribute('name'),
        id: el.getAttribute('id'),
        placeholder: el.getAttribute('placeholder'),
        text: el.textContent ? el.textContent.trim() : '',
        value: el.value || '',
        class: el.className
      }));
    });
    console.log('Elements on page:', JSON.stringify(inputsInfo, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
  }
})();
