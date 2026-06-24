const { chromium } = require('@playwright/test');

(async () => {
  console.log('Launching debug browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 520, height: 980 }
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('https://code-quality-tracker.bytestechnolab.net/login', { waitUntil: 'networkidle' });

    console.log('Injecting DOM device frame...');
    await page.evaluate(() => {
      // 1. Create frame wrapper
      const container = document.createElement('div');
      container.id = 'iphone-frame-wrapper';
      container.style.position = 'relative';
      container.style.width = '406px';
      container.style.height = '880px';
      container.style.background = 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 15%, #1e1e1e 30%, #333333 50%, #1a1a1a 70%, #2d2d2d 85%, #1a1a1a 100%)';
      container.style.borderRadius = '58px';
      container.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(0,0,0,0.9), 0 20px 60px rgba(0,0,0,0.8)';
      container.style.overflow = 'hidden';
      container.style.zIndex = '999999';

      // 2. Side buttons
      const power = document.createElement('div');
      power.style.cssText = 'position: absolute; right: 0; top: 220px; width: 4px; height: 80px; background: #4a4a4a; border-radius: 0 3px 3px 0; z-index: 10;';
      const action = document.createElement('div');
      action.style.cssText = 'position: absolute; left: 0; top: 145px; width: 4px; height: 30px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';
      const volUp = document.createElement('div');
      volUp.style.cssText = 'position: absolute; left: 0; top: 190px; width: 4px; height: 46px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';
      const volDown = document.createElement('div');
      volDown.style.cssText = 'position: absolute; left: 0; top: 250px; width: 4px; height: 46px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';

      // 3. Screen
      const screen = document.createElement('div');
      screen.style.cssText = 'position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; background: #fdfbf7; border-radius: 52px; overflow: hidden;';

      // 4. Content Scroll Wrapper
      const scrollWrapper = document.createElement('div');
      scrollWrapper.id = 'iphone-scroll-wrapper';
      scrollWrapper.style.cssText = 'width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; padding-top: 54px; padding-bottom: 24px; box-sizing: border-box;';

      // 5. Status Bar (Fixed at top of screen)
      const statusBar = document.createElement('div');
      statusBar.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; height: 54px; z-index: 50; display: flex; align-items: flex-start; justify-content: space-between; padding: 17px 28px 0 28px; pointer-events: none; color: #1a1a1a; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: bold; background: linear-gradient(to bottom, rgba(253,251,247,0.95), rgba(253,251,247,0));';
      statusBar.innerHTML = `
        <div>9:41</div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span>📶</span>
          <span>📶</span>
          <span style="font-size: 11px;">87% 🔋</span>
        </div>
      `;

      // 6. Notch / Dynamic Island (Fixed at top of screen)
      const notch = document.createElement('div');
      notch.style.cssText = 'position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 126px; height: 37px; background: #000; border-radius: 20px; z-index: 60; box-shadow: 0 0 0 0.5px rgba(255,255,255,0.04);';

      // 7. Home indicator (Fixed at bottom of screen)
      const homeInd = document.createElement('div');
      homeInd.style.cssText = 'position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 3px; z-index: 55;';

      // Move children
      const body = document.body;
      const children = Array.from(body.children);
      children.forEach(c => {
        if (c.tagName !== 'SCRIPT') {
          scrollWrapper.appendChild(c);
        }
      });

      container.appendChild(power);
      container.appendChild(action);
      container.appendChild(volUp);
      container.appendChild(volDown);
      container.appendChild(screen);
      
      screen.appendChild(scrollWrapper);
      screen.appendChild(statusBar);
      screen.appendChild(notch);
      screen.appendChild(homeInd);

      body.appendChild(container);

      // Format body
      body.style.cssText = 'background: #0a0a0a !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 100vh !important; margin: 0 !important; overflow: hidden !important;';

      // Inject mobile styling overrides
      const style = document.createElement('style');
      style.textContent = `
        /* Hide scrollbars for realistic view */
        #iphone-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        #iphone-scroll-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Reset 100vh heights to 100% to fit within the phone screen wrapper */
        html, body, .login-page, .login-shell {
          min-height: 100% !important;
          height: 100% !important;
        }
        
        .login-shell {
          padding: 20px !important;
          margin: 0 !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .login-card {
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    });

    console.log('Filling inputs...');
    await page.locator('#signinPanel input[name="email"]').fill('deepali.londhe@magnetoitsolutions.com');
    await page.locator('#signinPanel input[name="password"]').fill('Deepali123');

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'scratch/injected-frame-scrollable.png' });
    console.log('Screenshot saved to scratch/injected-frame-scrollable.png');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
})();
