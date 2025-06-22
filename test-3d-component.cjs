const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Puppeteer test...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push({ type, text });
    console.log(`Console ${type}:`, text);
  });
  
  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.error('Page error:', error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Page loaded successfully');
    
    // Wait a bit for 3D content to render
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    const screenshotPath = '/home/tabs/aegntic-pre-3js-sameClaude/aegntic-landing/3d-test-screenshot.png';
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Check if Three.js canvas exists
    const canvasExists = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        exists: !!canvas,
        count: document.querySelectorAll('canvas').length,
        canvasInfo: canvas ? {
          width: canvas.width,
          height: canvas.height,
          style: {
            width: canvas.style.width,
            height: canvas.style.height,
            display: canvas.style.display
          }
        } : null
      };
    });
    
    console.log('Canvas check:', canvasExists);
    
    // Check for specific React Three Fiber elements
    const r3fElements = await page.evaluate(() => {
      // Check for R3F root div
      const r3fRoot = document.querySelector('[data-fiber-root]');
      const divWithCanvas = Array.from(document.querySelectorAll('div')).find(div => 
        div.querySelector('canvas') && div.style.position
      );
      
      return {
        hasFiberRoot: !!r3fRoot,
        hasCanvasContainer: !!divWithCanvas,
        containerInfo: divWithCanvas ? {
          position: divWithCanvas.style.position,
          width: divWithCanvas.style.width,
          height: divWithCanvas.style.height,
          className: divWithCanvas.className
        } : null
      };
    });
    
    console.log('React Three Fiber elements:', r3fElements);
    
    // Filter console messages for Three.js/R3F related errors
    const threejsErrors = consoleMessages.filter(msg => 
      msg.text.toLowerCase().includes('three') || 
      msg.text.toLowerCase().includes('webgl') ||
      msg.text.toLowerCase().includes('fiber') ||
      msg.type === 'error' || 
      msg.type === 'warning'
    );
    
    console.log('\n=== Summary ===');
    console.log('Total console messages:', consoleMessages.length);
    console.log('Three.js related messages:', threejsErrors.length);
    console.log('Page errors:', pageErrors.length);
    
    if (threejsErrors.length > 0) {
      console.log('\n=== Three.js/React Three Fiber Console Messages ===');
      threejsErrors.forEach(msg => {
        console.log(`[${msg.type}] ${msg.text}`);
      });
    }
    
    if (pageErrors.length > 0) {
      console.log('\n=== Page Errors ===');
      pageErrors.forEach(error => {
        console.log(error);
      });
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
    console.log('\nTest completed!');
  }
})();