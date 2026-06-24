const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('https://code-quality-tracker.bytestechnolab.net/login', { waitUntil: 'networkidle' });

    console.log('Filling credentials...');
    await page.locator('#signinPanel input[name="email"]').fill('deepali.londhe@magnetoitsolutions.com');
    await page.locator('#signinPanel input[name="password"]').fill('Deepali123');
    
    console.log('Submitting login...');
    await page.locator('#signinPanel button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('Logged in. Current URL:', page.url());

    // Click the first project link
    console.log('Finding projects on dashboard...');
    const projectLink = page.locator('a[href*="project_id="]').first();
    const projectText = await projectLink.textContent();
    console.log('First project link found:', projectText.trim());

    console.log('Clicking project link...');
    await projectLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('Project page loaded. Current URL:', page.url());

    // Save project HTML
    const projectHtml = await page.content();
    fs.writeFileSync(path.join(__dirname, 'project-dom.html'), projectHtml);
    console.log('Saved project DOM to scratch/project-dom.html');

    // Extract all text content, links, buttons, tabs
    const pageElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('a, button, [role="tab"], .tab, span, div')).map(el => {
        const text = el.textContent ? el.textContent.trim().replace(/\s+/g, ' ') : '';
        return {
          tagName: el.tagName,
          id: el.getAttribute('id'),
          class: el.className,
          text: text.substring(0, 100),
          href: el.getAttribute('href'),
          role: el.getAttribute('role')
        };
      });
      // Filter out empty texts or huge layout divs to keep list clean
      return elements.filter(el => el.text.length > 0 && el.text.length < 150);
    });

    console.log('--- FOUND ELEMENTS ---');
    console.log(JSON.stringify(pageElements.slice(0, 200), null, 2));

  } catch (err) {
    console.error('Error during inspection:', err);
  } finally {
    await browser.close();
  }
})();
