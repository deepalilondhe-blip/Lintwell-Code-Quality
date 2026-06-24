const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://code-quality-tracker.bytestechnolab.net/login', { waitUntil: 'networkidle' });

    const styles = await page.evaluate(() => {
      const shell = document.querySelector('.login-shell');
      const card = document.querySelector('.login-card');
      
      const getStyles = (el) => {
        if (!el) return null;
        const comp = window.getComputedStyle(el);
        return {
          display: comp.display,
          position: comp.position,
          width: comp.width,
          height: comp.height,
          maxWidth: comp.maxWidth,
          minWidth: comp.minWidth,
          margin: comp.margin,
          padding: comp.padding,
          transform: comp.transform,
          top: comp.top,
          left: comp.left,
          boxSizing: comp.boxSizing
        };
      };

      return {
        shell: getStyles(shell),
        card: getStyles(card),
        body: getStyles(document.body)
      };
    });

    console.log('Computed styles:', JSON.stringify(styles, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
